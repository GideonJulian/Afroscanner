import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import PopupNotification from "../components/PopupNotification";

const ScanPage = () => {
  const [scanning, setScanning] = useState(true);
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();

  const handleScan = async (err, result) => {
    if (result) {
      setScanning(false);
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
          setScanning(true);
          return;
        }

        const data = await res.json();
        // 👇 Make sure backend returns event_id
        if (data.event_id) {
          setPopup({
            show: true,
            type: "success",
            message: "Valid Ticket",
          });
          navigate(`/ticket/${data.event_id}`);
        } else {
          setPopup({
            show: true,
            type: "error",
            message: "Event not found",
          });
          setScanning(true);
        }
      } catch (e) {
        console.error(e);
        setPopup({
          show: true,
          type: "error",
          message: "Network error",
        });
        setScanning(true);
      }
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
      {/* SCANNER */}
      {scanning && (
        <BarcodeScannerComponent
          width={300}
          height={300}
          onUpdate={handleScan}
        />
      )}

      {/* POPUP */}
      <PopupNotification
        type={popup.type}
        message={popup.message}
        show={popup.show}
        onClose={() => setPopup({ ...popup, show: false })}
      />

      {/* RETRY BUTTON */}
      {/* {!scanning && (
        <button
          className="mt-5 px-6 py-2 bg-white text-black rounded-lg font-semibold"
          onClick={() => setScanning(true)}
        >
          Try Again
        </button>
      )} */}
    </div>
  );
};

export default ScanPage;
