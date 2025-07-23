import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(savedEvents);
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Get days in current month
  const getDaysInMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  // Add or Update Event
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!title || !date) return alert("Please fill title and date!");

    if (editingEvent) {
      // Update event
      setEvents(
        events.map((ev) =>
          ev.id === editingEvent.id ? { ...ev, title, date } : ev
        )
      );
      setEditingEvent(null);
    } else {
      // Add new event
      const newEvent = { id: uuidv4(), title, date };
      setEvents([...events, newEvent]);
    }
    setTitle("");
    setDate("");
    setShowForm(false);
  };

  // Edit Event
  const handleEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDate(event.date);
    setShowForm(true);
  };

  // Delete Event
  const handleDelete = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter((ev) => parseInt(ev.date.split("-")[2]) === selectedDate)
    : events;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        Super Simple Event Scheduler
      </h1>

      {/* Days of current month */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {getDaysInMonth().map((day) => (
          <button
            key={day}
            className={`p-2 rounded-lg border ${
              selectedDate === day
                ? "bg-blue-500 text-white"
                : events.some((ev) => parseInt(ev.date.split("-")[2]) === day)
                ? "bg-green-300"
                : "bg-gray-100"
            }`}
            onClick={() => setSelectedDate(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Add Event Button */}
      <button
        onClick={() => {
          setShowForm(true);
          setEditingEvent(null);
          setTitle("");
          setDate("");
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add Event
      </button>

      {/* Event Form */}
      {showForm && (
        <form
          onSubmit={handleSaveEvent}
          className="p-4 mb-4 bg-gray-100 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            {editingEvent ? "Update Event" : "Save Event"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Event List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-gray-600">No events found.</p>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex justify-between items-center p-3 bg-white shadow rounded"
            >
              <div>
                <h3 className="font-bold">{ev.title}</h3>
                <p className="text-sm text-gray-500">{ev.date}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(ev)}
                  className="bg-yellow-400 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
                  className="bg-red-500 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
