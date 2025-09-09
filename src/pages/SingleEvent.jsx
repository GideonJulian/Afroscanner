import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Clock, MapPin, ArrowLeft, Ticket, Calendar } from "lucide-react";
import PopupNotification from "../components/PopupNotification";
const SingleEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEventData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanStatus, setScanStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  /* ------------ FETCH DATA ----------------- */
  useEffect(() => {
    const fetchEvent = async () => {
      const r = await fetch(
        `https://afrophuket-backend-gr4j.onrender.com/events/${id}/`
      );
      if (!r.ok) throw new Error("Event load failed");
      setEventData(await r.json());
    };

    const fetchTickets = async () => {
      const r = await fetch(
        "https://afrophuket-backend-gr4j.onrender.com/events/tickets/"
      );
      if (!r.ok) throw new Error("Tickets load failed");
      const all = await r.json();
      // 🔑 only this event’s tickets
      setTickets(all.filter((t) => t.event === Number(id)));
    };

    const fetchPurchases = async () => {
      const r = await fetch(
        "https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchases/"
      );
      if (!r.ok) throw new Error("Purchases load failed");
      setPurchases(await r.json());
    };

    fetchEvent();
    fetchTickets();
    fetchPurchases();
  }, [id]);

  /* -------- Progress bar for scanStatus ----- */
  useEffect(() => {
    if (!scanStatus) return;
    setProgress(100);
    const step = 100 / (3000 / 50);
    const interval = setInterval(
      () => setProgress((p) => Math.max(p - step, 0)),
      50
    );
    const hide = setTimeout(() => setScanStatus(""), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, [scanStatus]);

  /* ---- FILTER purchases to this event only --- */
  const filteredPurchases = useMemo(() => {
    if (!tickets.length) return [];
    return purchases.filter((p) => tickets.some((t) => t.id === p.ticket));
  }, [tickets, purchases]);

  /* -------- Totals -------- */
  const totalScanned = filteredPurchases.filter((p) => p.is_used).length;
  const totalCapacity = tickets.reduce(
    (sum, t) => sum + (t.quantity_available || 0),
    0
  );

  // 💰 total price of scanned tickets
  const totalScannedAmount = filteredPurchases
    .filter((p) => p.is_used)
    .reduce((sum, p) => {
      const t = tickets.find((t) => t.id === p.ticket);
      return t ? sum + Number(t.price || 0) : sum;
    }, 0);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-5">
        <ArrowLeft
          size={22}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* EVENT INFO */}
      <div className="ml-4">
        {!event ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <h1 className="font-bold text-lg sm:text-xl lg:text-2xl mb-5">
              {event.title}
            </h1>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-2 items-center">
                <Calendar size={20} className="text-gray-600" />
                <span className="text-sm">{event.date}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Clock size={20} className="text-gray-600" />
                <span className="text-sm">
                  {event.start_time} - {event.end_time}
                </span>
              </li>
              <li className="flex gap-2 items-center">
                <MapPin size={20} className="text-gray-600" />
                <span className="text-sm">{event.location}</span>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* TOTAL SCANNED */}
      <div className="mt-10 px-5 text-center">
        <p className="uppercase text-lg font-bold tracking-wide">
          Total Scanned
        </p>
        <p className="text-2xl font-bold text-[#E55934] mt-1">
          {totalScanned} / {totalCapacity}
        </p>
      </div>

      {/* TICKET TYPES */}
      <div className="mt-6 px-5">
        <p className="uppercase text-xs tracking-wide text-gray-400 mb-3">
          Ticket Types
        </p>
        {tickets.length === 0 && (
          <p className="uppercase text-xs tracking-wide text-center mt-4 text-white mb-3">
            No ticket available for this event
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          {tickets.map((ticket) => {
            const used = filteredPurchases.filter(
              (p) => p.ticket === ticket.id && p.is_used
            ).length;
            return (
              <div key={ticket.id} className="flex flex-col">
                <div className="bg-[#FFF2ED] rounded-full px-4 py-2 flex items-center gap-2 text-[#E55934] font-semibold">
                  <Ticket size={16} />
                  <span>{ticket.name}</span>
                </div>
                <div className="font-bold text-lg mt-2">
                  {used} / {ticket.quantity_available}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SCANNER MODAL */}
      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-[300px] h-[300px] bg-gray-900 rounded-lg overflow-hidden">
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={async (err, result) => {
                if (result) {
                  setScannedResult(result.text);
                  setIsScanning(false);
                  try {
                    const res = await fetch(
                      "https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchase/validate/",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ qr_code_token: result.text }),
                      }
                    );
                    if (!res.ok) {
                      setPopup({
                        show: true,
                        type: "error",
                        message: "Invalid or Used Ticket",
                      });
                      return;
                    }
                    setPopup({
                      show: true,
                      type: "success",
                      message: "Ticket Scanned",
                    });
                    const r = await fetch(
                      "https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchases/"
                    );
                    setPurchases(await r.json());
                  } catch (e) {
                    console.error(e);
                    setPopup({
                      show: true,
                      type: "error",
                      message: "Network or server error",
                    });
                  }
                }
              }}
            />
          </div>
          <button
            className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded"
            onClick={() => setIsScanning(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* STATUS */}

      <div className="mt-4 text-center">
        <div>
          <PopupNotification
            type={popup.type}
            message={popup.message}
            show={popup.show}
            onClose={() => setPopup({ ...popup, show: false })}
          />
        </div>
      </div>

      {/* 💰 TOTAL AMOUNT OF SCANNED */}
      <div className="mt-2 px-5 text-center">
        <p className="uppercase text-xs tracking-wide text-gray-400">
          Scanned Ticket Value
        </p>
        <p className="text-xl font-bold text-green-400 mt-1">
          ₦{totalScannedAmount.toLocaleString()}
        </p>
      </div>
      {/* BUTTON */}
      <div className="mt-6 px-5">
        <div className="relative w-full inline-block mt-10">
          <span className="absolute inset-0 bg-black rounded-lg translate-x-2 translate-y-2 border-2 "></span>
          <button
            onClick={() => setIsScanning(true)}
            className="relative text-sm font-semibold uppercase cursor-pointer px-6 py-3 w-full bg-white text-black rounded-lg border-2 border-black shadow-md scale-102 hover:scale-105 transition-all duration-300"
          >
            CONTINUE SCANNING
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
