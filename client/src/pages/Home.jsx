import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Globe, Mail, Users, Building2Icon } from "lucide-react";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events/upcomming");
        console.log("Fetched events:", res.data);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchClubs = async () => {
      try {
        const res = await axios.get("/clubs/all");
        console.log("Fetched clubs:", res.data);
        setClubs(res.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    fetchEvents();
    fetchClubs();
  }, []);

  return (
    <div className="w-full min-h-screen px-2 py-20 text-gray-100">
      {/* Events Section */}
      <h1 className="mt-24 mb-12 text-4xl font-bold text-center text-teal-400 md:text-5xl">
        Upcoming Events
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

      {/* Clubs Section */}
      <h1 className="mt-24 mb-12 text-4xl font-bold text-center text-teal-400 md:text-5xl">
        College Clubs
      </h1>

      <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {clubs.length > 0 ? (
          clubs.map((club) => (
            <Card
              key={club._id}
              className="overflow-hidden transition-all duration-300 border bg-neutral-900 border-teal-700/40 hover:border-teal-400/70"
            >
              <div className="flex items-center justify-center w-full bg-gray-800 h-52">
                <Users size={80} className="text-teal-400/40" />
              </div>
              <CardContent className="p-5 text-left">
                <h2 className="mb-2 text-xl font-semibold text-teal-300">
                  {club.name}
                </h2>
                {club.description && (
                  <p className="mb-3 text-sm text-gray-400 line-clamp-2">
                    {club.description}
                  </p>
                )}
                <p className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                  <Mail size={16} /> {club.email}
                </p>
                <p className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                  <Tag size={16} /> ID: {club.clubId}
                </p>
                <Button className="w-full font-semibold text-black bg-teal-500 hover:bg-teal-400">
                  View Club
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            No clubs available.
          </p>
        )}
      </div>
    </div>
  );
}