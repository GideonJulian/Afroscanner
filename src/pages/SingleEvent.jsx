import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
  CalendarDays,
  Clock,
  MapPin,
  ArrowLeft,
  Ticket,
  Calendar,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

const SingleEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEventData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(""); // feedback text

  const [progress, setProgress] = useState(0); // 0 → 100

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(
        `https://afrophuket-backend-gr4j.onrender.com/events/${id}/`
      );
      if (!res.ok) throw new Error("Failed to fetch event");
      setEventData(await res.json());
    };

    const fetchTickets = async () => {
      const res = await fetch(
        `https://afrophuket-backend-gr4j.onrender.com/events/tickets/`
      );
      if (!res.ok) throw new Error("Failed to fetch tickets");
      setTickets(await res.json());
    };

    const fetchPurchases = async () => {
      const res = await fetch(
        `https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchases/`
      );
      if (!res.ok) throw new Error("Failed to fetch purchases");
      setPurchases(await res.json());
    };

    fetchEvents();
    fetchTickets();
    fetchPurchases();
  }, [id]);
  useEffect(() => {
    if (!scanStatus) return;
    setProgress(100);
    const step = 100 / (3000 / 50);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, 50);

    // hide after 3s
    const hide = setTimeout(() => setScanStatus(""), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(hide);
    };
  }, [scanStatus]);
  const totalCapacity = tickets.reduce(
    (total, t) => total + (t.quantity_available || 0),
    0
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-5">
        <ArrowLeft
          size={22}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="ml-4">
        {!event ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : (
          <>
            <h1 className="font-bold text-lg sm:text-xl lg:text-2xl mb-5 sm:mb-7">
              {event.title}
            </h1>

            <ul className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                <Calendar size={20} className="text-gray-600" />
                <h1 className="text-sm">{event.date}</h1>
              </div>

              <div className="flex gap-2 items-center">
                <Clock size={20} className="text-gray-600" />
                <h1 className="text-sm">
                  {event.start_time} - {event.end_time}
                </h1>
              </div>

              <div className="flex gap-2 items-center">
                <MapPin size={20} className="text-gray-600" />
                <span className="text-sm">{event.location}</span>
              </div>
            </ul>
          </>
        )}
      </div>

      {/* Total Scanned */}
      <div className="mt-10 px-5 text-center">
        <p className="uppercase text-lg font-bold tracking-wide text-white">
          Total Scanned
        </p>
        {/* Total Scanned */}
        <div className="mt-10 px-5 text-center">
          <p className="text-2xl font-bold text-[#E55934] mt-1">
            {
              // how many purchases are marked as used
              purchases.filter((p) => p.is_used).length
            }
            {" / "}
            {
              // total number of tickets
              tickets.reduce((total, t) => total + t.quantity_available, 0)
            }
          </p>
        </div>
      </div>

      {/* Ticket Types */}
      <div className="mt-6 px-5">
        <p className="uppercase text-xs tracking-wide text-gray-400 mb-3">
          Ticket Types
        </p>

        <div className="flex flex-wrap gap-3">
          {tickets.map((ticket) => {
            const scannedForThisType = purchases.filter(
              (p) => p.ticket === ticket.id && p.is_used
            ).length; // count used tickets

            return (
              <div key={ticket.id} className="flex flex-col">
                <div className="bg-[#FFF2ED] rounded-full px-4 py-2 flex items-center gap-2 text-[#E55934] font-semibold">
                  <Ticket size={16} />
                  <span>{ticket.name}</span>
                </div>
                <div className="font-bold text-lg mt-3">
                  {scannedForThisType} / {ticket.quantity_available}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                    // POST the token directly to your validation endpoint
                    const res = await fetch(
                      `https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchase/validate/`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ qr_code_token: result.text }),
                      }
                    );

                    if (!res.ok) {
                      // backend will probably send 400/404 if invalid
                      setScanStatus("⚠️ Invalid or already used ticket");
                      return;
                    }

                    const response = await res.json();
                    // you can check response if backend tells you status (used, valid, etc.)
                    setScanStatus("✅ Ticket validated and marked as used");
                    setProgress(100); // full bar
                    setTimeout(() => setScanStatus(""), 3000);
                    // refresh the list so counters update
                    const refreshed = await fetch(
                      "https://afrophuket-backend-gr4j.onrender.com/events/ticket-purchases/"
                    );
                    setPurchases(await refreshed.json());
                  } catch (e) {
                    console.error(e);
                    setScanStatus("⚠️ Network or server error");
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

      {scanStatus && (
        <div className="mt-4 text-center">
          <p className="text-sm text-white">{scanStatus}</p>

          {/* shrinking progress bar */}
          <div className="relative w-40 h-1 bg-gray-700 mx-auto mt-2 rounded">
            <div
              className="absolute top-0 left-0 h-full bg-[#E55934] rounded"
              style={{ width: `${progress}%`, transition: "width 50ms linear" }}
            />
          </div>
        </div>
      )}

      {/* Continue Button */}
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

      <div className="flex-1" />
      {/* BottomNav */}
    </div>
  );
};

export default SingleEvent;
