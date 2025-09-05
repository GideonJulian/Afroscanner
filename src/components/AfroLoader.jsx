// src/components/AfroLoader.jsx
import React from "react";
import { motion } from "framer-motion";

const dotVariants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const AfroLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#111111] z-50">
      {/* Bouncing Dots */}
      <div className="flex gap-2">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#E55934" }}
            variants={dotVariants}
            animate="bounce"
            transition={{ delay }}
          />
        ))}
      </div>

      {/* Text */}
      <h1
        className="mt-6 text-lg sm:text-xl font-medium tracking-wide"
        style={{ color: "#E55934" }}
      >
        Loading Events
      </h1>
    </div>
  );
};

export default AfroLoader;
