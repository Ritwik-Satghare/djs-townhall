// components/EventModal.jsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventModal = ({ event, onClose }) => {
  const navigate = useNavigate();
  if (!event) return null; // safety check

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1E1E1E] text-white p-6 rounded-2xl max-w-lg w-full relative overflow-y-auto max-h-[90vh] shadow-lg"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute transition text-grey-400 top-3 right-3 hover:text-red-500"
        >
          <X size={32} />
        </button>

        {/* Event details */}
        <img
          src={event.imageUrl}
          alt={event.name}
          className="object-cover w-full h-56 mb-4 pt-7 rounded-xl"
        />

        <h2 className="mb-2 text-2xl font-bold">{event.name}</h2>
        <p className="mb-4 text-gray-400">{event.category}</p>
        <p className="mb-4 text-gray-300">{event.description}</p>

        <div className="mb-6 space-y-1 text-sm text-gray-400">
          <p>Date: {new Date(event.dateTime).toLocaleString()}</p>
          <p>Venue: {event.venue}</p>
          <p>Mode: {event.mode}</p>
        </div>

        {/* Fill Form Button */}
        <Button
          onClick={() => navigate(`/events/fill-form/${event._id}`)}
          className="w-full transition-all bg-purple-200 hover:bg-purple-500"
        >
          Fill Form
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EventModal;
