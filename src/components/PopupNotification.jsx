import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const PopupNotification = ({ type, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3s
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 sm:top-10 sm:right-6 
            max-w-[90%] sm:max-w-sm w-auto 
            px-5 sm:px-7 py-4 sm:py-5 rounded-xl shadow-lg 
            flex items-center gap-2 sm:gap-3 z-50
            ${type === "success" ? "bg-green-600" : "bg-red-600"} text-white`}
        >
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
          <p className="text-xs sm:text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupNotification;
