import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Tag,
  Globe,
  Users,
  MapPin,
} from "lucide-react";

const events = [
  {
    id: 1,
    name: "Tech Fest 2025",
    date: "March 22, 2025",
    time: "10:00 AM - 5:00 PM",
    category: "Technology",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    id: 2,
    name: "AI Hackathon",
    date: "April 12, 2025",
    time: "9:00 AM - 6:00 PM",
    category: "Coding",
    mode: "Online",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  },
  {
    id: 3,
    name: "Gaming Marathon",
    date: "May 5, 2025",
    time: "12:00 PM - 9:00 PM",
    category: "Gaming",
    mode: "Offline",
    image: "https://images.unsplash.com/photo-1606813902915-4b0ec4aeeff9",
  },
];

const clubs = [
  {
    id: 1,
    name: "DJS Coding Club",
    members: 120,
    location: "Block A, Room 204",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    id: 2,
    name: "Robotics Society",
    members: 85,
    location: "Block B, Lab 3",
    image: "https://images.unsplash.com/photo-1581091215367-59ab6c54b8ae",
  },
  {
    id: 3,
    name: "AI Innovators",
    members: 95,
    location: "Block C, Hall 2",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
];

export default function HomePage() {
  return (
    <div className="w-full min-h-screen px-2 py-20 text-gray-100">
      {/* Events Section */}
      <h1 className="mt-24 mb-12 text-4xl font-bold text-center text-teal-400 md:text-5xl">
        Upcoming Events
      </h1>

      <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {events.map((event) => (
          <Card
            key={event.id}
            className="transition-all duration-300 border bg-neutral-900 border-teal-700/40 hover:border-teal-400/70"
          >
            <img
              src={event.image}
              alt={event.name}
              className="object-cover w-full h-52"
            />
            <CardContent className="p-5 text-left">
              <h2 className="mb-2 text-xl font-semibold text-teal-300">
                {event.name}
              </h2>
              <p className="flex items-center gap-2 mb-1 text-sm text-gray-400">
                <Calendar size={16} /> {event.date}
              </p>
              <p className="flex items-center gap-2 mb-1 text-sm text-gray-400">
                <Clock size={16} /> {event.time}
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
        ))}
      </div>

      {/* Clubs Section */}
      <h1 className="mt-24 mb-12 text-4xl font-bold text-center text-teal-400 md:text-5xl">
        College Clubs
      </h1>

      <div className="grid grid-cols-1 gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {clubs.map((club) => (
          <Card
            key={club.id}
            className="overflow-hidden transition-all duration-300 border bg-neutral-900 border-teal-700/40 hover:border-teal-400/70"
          >
            <img
              src={club.image}
              alt={club.name}
              className="object-cover w-full h-52"
            />
            <CardContent className="p-5 text-left">
              <h2 className="mb-2 text-xl font-semibold text-teal-300">
                {club.name}
              </h2>
              <p className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                <Users size={16} /> {club.members} Members
              </p>
              <p className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <MapPin size={16} /> {club.location}
              </p>
              <Button className="w-full font-semibold text-black bg-teal-500 hover:bg-teal-400">
                View Club
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
