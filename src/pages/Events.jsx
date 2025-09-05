import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AfroLoader from "../components/AfroLoader";
import BottomNav from "../components/BottomNav";
import EventCard from "../components/EventCard"; // <-- new card

const Events = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = import.meta.env.VITE_API_TOKEN;
      const res = await fetch("https://afrophuket-backend-gr4j.onrender.com/events/", {
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setEventData(data);
      else console.error("Expected array, got:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AfroLoader />;

  return (
    <div className=" min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-gray-200">
        <Header buttonText="CREATE NEW EVENT" route="create-event" />
      </div>

      {/* Event list */}
      <div className="flex flex-col gap-6 p-4 mb-16">
        {eventData.map((item) => (
          <EventCard
            key={item.id}
            id={item.id}
           event={item}
          />
        ))}
      </div>

      {/* Bottom navigation */}
      {/* <BottomNav /> */}
    </div>
  );
};

export default Events;
