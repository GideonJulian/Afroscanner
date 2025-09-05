import React, { useState } from "react";
import { Calendar, SquarePen, Ticket, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const EventCard = ({ event, handleDelete }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`scan/${event.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        className="cursor-pointer bg-black p-4 sm:p-4 flex flex-row justify-between gap-3 rounded-xl shadow-xl"
      >
        {/* Event Image */}
        <motion.div
          className="w-28 h-30 sm:w-36 sm:h-36 flex-shrink-0"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={event.thumbnail_url}
            alt={event.title}
            className="w-full h-full object-cover rounded-md"
          />
        </motion.div>

        {/* Event Info */}
        <div className="flex-1 flex flex-col justify-between ">
          <div className="flex justify-between items-start flex-wrap gap-y-1">
            <div className="space-y-1">
              <h1 className="font-[700] text-white text-md leading-tight">
                {event.title}
              </h1>
              <h2 className="flex items-center gap-2 text-white text-xs sm:text-sm">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                {event.date}
              </h2>
            </div>

          
          </div>

          {/* Ticket Sold */}
          <div className="mt-3 sm:mt-6">
            <h2 className="text-[#FC6435] text-xs sm:text-sm font-medium flex items-center gap-2">
              <Ticket className="text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
              {event.tickets.length}
            </h2>
            <h2 className="text-xs sm:text-sm text-white">Ticket sold</h2>
          </div>
        </div>
      </motion.div>

    
    </>
  );
};

export default EventCard;
