import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EventsCreator = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({
    eventName: "",
    eventDescription: "",
    category: "",
    venue: "",
    date: "",
    time: "10:30",
    mode: "Offline",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", data);
  };

  return (
    <div className="w-full">
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Name */}
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                type="text"
                placeholder="Your Event's Name"
                value={data.eventName}
                onChange={(e) => setData({ ...data, eventName: e.target.value })}
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                placeholder="Tell us about your event..."
                value={data.eventDescription}
                onChange={(e) => setData({ ...data, eventDescription: e.target.value })}
              />
            </div>

            {/* Category */}
            <div className="space-y-6">
              <Select onValueChange={(value) => setData({ ...data, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Picture Upload */}
            <div className="grid items-center w-full max-w-sm gap-3">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                onChange={(e) => setData({ ...data, picture: e.target.files[0] })}
              />
            </div>

            {/* Date Picker */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">Date</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between w-48 font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setData({ ...data, date: selectedDate.toISOString() });
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Venue */}
            <div className="space-y-6">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                type="text"
                placeholder="eg. Seminar Hall"
                value={data.venue}
                onChange={(e) => setData({ ...data, venue: e.target.value })}
              />
            </div>

            {/* Time */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">Time</Label>
              <Input
                value={data.time}
                type="time"
                id="time-picker"
                step="1"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                onChange={(e) => setData({ ...data, time: e.target.value })}
              />
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <Label>Mode</Label>
              <RadioGroup
                value={data.mode}
                onValueChange={(value) => setData({ ...data, mode: value })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Offline"
                    id="offline"
                    className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center
                               data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor="offline">Offline</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Online"
                    id="online"
                    className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center
                               data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor="online">Online</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full text-white">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCreator;
