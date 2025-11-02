import React, { use, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const EventsCreator = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    venue: "",
    date: "29-10-2025",
    time: "10:30:00",
    mode: "Offline",
    picture: null,
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", data);
    navigate("/form-creator", {
      state: { eventData: data, fromEventCreator: true },
    });
  };

  return (
    <div className="w-full">
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // ask chatGPT how it works copied from there
                const form = e.target.form;

                if (!form) return; // exit if not inside a form

                const index = Array.prototype.indexOf.call(
                  form.elements,
                  e.target
                );

                for (let i = index + 1; i < form.elements.length; i++) {
                  const next = form.elements[i];
                  if (
                    next &&
                    typeof next.focus === "function" &&
                    !next.disabled &&
                    next.offsetParent !== null
                  ) {
                    next.focus();
                    break;
                  }
                }
              }
            }}
            className="space-y-4"
          >
            {/* Event Name */}
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Event's Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your event..."
                value={data.description}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
              />
            </div>
            {/* Category */}
            <div className="space-y-6">
              <Select
                onValueChange={(value) => setData({ ...data, category: value })}
              >
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
                accept="image/*"
                onChange={(e) =>
                  setData({ ...data, picture: e.target.files[0] })
                }
              />

              {data.picture && (
                <img
                  src={URL.createObjectURL(data.picture)}
                  alt="Preview"
                  className="object-cover w-32 h-32 mt-2 border rounded-md"
                />
              )}
            </div>
            {/* Date Picker */}{" "}
            {/*FIXME: (not working)-> calender not opening*/}
            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                Date of birth
              </Label>
              <Popover modal={true} open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="justify-between w-48 font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 overflow-hidden"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
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
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
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
            {/* Message */}
            <div>
              <Label htmlFor="message">Notification message</Label>
              <Input
                id="message"
                type="text"
                placeholder="Message that appears on the notification page"
                value={data.message}
                onChange={(e) => setData({ ...data, message: e.target.value })}
              />
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
