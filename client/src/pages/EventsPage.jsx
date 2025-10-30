import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Globe } from "lucide-react";

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events"); // adjust URL if needed
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-teal-400">
        Loading events...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-2 py-20 text-gray-100">
      <h1 className="mt-24 mb-12 text-4xl font-bold text-center text-teal-400 md:text-5xl">
        All Events
      </h1>

      <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              key={event._id}
              className="transition-all duration-300 border bg-neutral-900 border-teal-700/40 hover:border-teal-400/70"
            >
              <img
                src={event.imageUrl}
                alt={event.name}
                className="object-cover w-full h-52"
              />
              <CardContent className="p-5 text-left">
                <h2 className="mb-2 text-xl font-semibold text-teal-300">
                  {event.name}
                </h2>
                <p className="mb-2 text-lg text-teal-100">
                  {event.description}
                </p>
                <p className="flex items-center gap-2 mb-1 text-sm text-gray-400">
                  <Calendar size={16} />{" "}
                  {new Date(event.dateTime).toLocaleDateString()}
                </p>
                <p className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                  <Tag size={16} /> {event.category} | <Globe size={16} />{" "}
                  {event.mode}
                </p>
                <Button className="w-full font-semibold text-black bg-teal-500 hover:bg-teal-400">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-400">No events available.</p>
        )}
      </div>
    </div>
  );
}
