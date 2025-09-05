import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://afrophuket-backend-gr4j.onrender.com/events/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEventData(data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `https://afrophuket-backend-gr4j.onrender.com/events/tickets/`, // if your API allows filtering by event
          { headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
    fetchEvents();
  }, [id]);
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
        {" "}
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
      </div>{" "}
      {/* Total Scanned */}
      <div className="mt-10 px-5 text-center">
        <p className="uppercase text-lg font-bold tracking-wide text-white">
          Total Scanned
        </p>
        <p className="text-2xl font-bold text-[#E55934] mt-1">
          / {tickets.reduce((total, t) => total + t.quantity_available, 0)}
        </p>

        {/* <div className="w-full h-2 rounded-full bg-gray-700 mt-2">
          <div
            className="h-2 rounded-full bg-[#E55934]"
            style={{
              width: `${(event.totalScanned / event.totalCapacity) * 100}%`,
            }}
          />
        </div> */}
      </div>
      {/* Ticket Types */}
      <div className="mt-6 px-5">
        <p className="uppercase text-xs tracking-wide text-gray-400 mb-3">
          Ticket Types
        </p>

        <div className="flex flex-wrap gap-3">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div className="flex flex-col">
                <div
                  key={ticket.id}
                  className="bg-[#FFF2ED] rounded-full px-4 py-2 flex items-center gap-2 text-[#E55934] font-semibold"
                >
                  <Ticket size={16} />
                  <div>{ticket.name}</div>
                </div>
                <div className="font-bold text-lg mt-3">/ {ticket.quantity_available} </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No tickets for this event</p>
          )}
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
