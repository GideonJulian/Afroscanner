import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, MapPin, ArrowLeft, Ticket } from "lucide-react";
import BottomNav from "../components/BottomNav";

const SingleEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Static demo values — replace with fetched data later
  const event = {
    title: "Amapiano Night",
    date: "Friday, Aug 25th, 2025",
    time: "2:01AM - 5:04PM WAT",
    venue: "Cafe Del Mar Phuket",
    totalScanned: 800,
    totalCapacity: 1000,
    types: [
      { label: "Early Birds", scanned: 400, total: 500 },
      { label: "VIP", scanned: 400, total: 500 },
    ],
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-6">
        <ArrowLeft
          size={22}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* Event Info */}
      <div className="px-5 mt-6 space-y-2 text-sm">
        <div>
          <h1 className="text-lg font-semibold">{event.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <CalendarDays size={16} />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock size={16} />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin size={16} />
          <span>{event.venue}</span>
        </div>
      </div>

      {/* Total Scanned */}
      <div className="mt-10 px-5 text-center">
        <p className="uppercase text-xs tracking-wide text-gray-400">
          Total Scanned
        </p>
        <p className="text-2xl font-bold text-[#E55934] mt-1">
          {event.totalScanned} / {event.totalCapacity}
        </p>
        <div className="w-full h-2 rounded-full bg-gray-700 mt-2">
          <div
            className="h-2 rounded-full bg-[#E55934]"
            style={{
              width: `${(event.totalScanned / event.totalCapacity) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Ticket Types */}
      <div className="mt-6 px-5">
        <p className="uppercase text-xs tracking-wide text-gray-400 mb-3">
          Ticket Types
        </p>
        <div className="flex justify-center gap-4">
          {event.types.map((type, i) => (
            <div key={i} className="bg-[#FFF2ED] rounded-full px-3 py-2 flex items-center gap-2 text-[#E55934] font-semibold">
                <Ticket /> {type.label}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6 px-5">
       <div className="relative     w-full inline-block mt-10">
        <span className="absolute inset-0 bg-black rounded-lg translate-x-2 translate-y-2 border-2 "></span>
        <button
        //   onClick={() => navigate()}
          className="relative text-sm font-semibold uppercase cursor-pointer px-6 py-3 w-full bg-white text-black rounded-lg border-2 border-black shadow-md scale-102 hover:scale-105 transition-all duration-300"
        //   style={{ width: `${width}px` }}
        >
        CONTINUE SCANNING 
        </button>
      </div>
      </div>

      {/* Push content above nav */}
      <div className="flex-1" />

      {/* BottomNav */}
    </div>
  );
};

export default SingleEvent;
