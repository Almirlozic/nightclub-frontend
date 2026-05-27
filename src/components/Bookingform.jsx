"use client";

import { useState, useEffect } from "react";
import BtnNormal from "./BtnNormal";
import { getEvents, postReservation, deleteReservation } from "@/lib/api";

const inputClass =
  "w-full bg-transparent border border-gray-700 text-white placeholder-gray-500 px-4 py-3 outline-none focus:border-white transition-colors text-sm";

const formatEventLabel = (event) =>
  new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + ` — ${event.title}`;

export default function BookingForm({
  selectedTable,
  setSelectedTable,
  selectedEvent,
  setSelectedEvent,
  initialEventId,
  onReservationComplete,
}) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", guests: "", phone: "", comment: "" });
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data);
        if (initialEventId) {
          const match = data.find((ev) => String(ev.id) === String(initialEventId));
          if (match) setSelectedEvent(match);
        }
      });
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleEventChange = (e) => {
    const event = events.find((ev) => String(ev.id) === e.target.value) || null;
    setSelectedEvent(event);
  };

  const handleSubmit = async () => {
    if (!selectedTable) return setError("Please select a table from the map above.");
    if (!selectedEvent) return setError("Please choose a night.");
    if (!form.name || !form.email || !form.guests || !form.phone)
      return setError("Please fill in all required fields.");
    setError("");
    setLoading(true);
    try {
      const res = await postReservation({
        name: form.name,
        email: form.email,
        table: String(selectedTable),
        guests: form.guests,
        date: selectedEvent.date,
        phone: form.phone,
        eventId: selectedEvent.id,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBooking(data);
      setForm({ name: "", email: "", guests: "", phone: "", comment: "" });
      setSelectedTable(null);
      onReservationComplete?.(selectedEvent.id);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking) return;
    await deleteReservation(booking.id);
    setBooking(null);
    setSelectedEvent(null);
  };

  if (booking) {
    return (
      <div className="border border-gray-700 p-8 text-center">
        <div
          className="text-2xl font-bold tracking-widest mb-2"
          style={{ color: "var(--color-brand)" }}
        >
          RESERVATION CONFIRMED
        </div>
        <p className="text-gray-400 mb-1 text-sm">
          Table <span className="text-white font-bold">{booking.table}</span> for{" "}
          <span className="text-white font-bold">{booking.guests}</span> guests
        </p>
        <p className="text-gray-400 mb-8 text-sm">
          Name: <span className="text-white font-bold">{booking.name}</span>
        </p>
        <button
          onClick={handleDelete}
          className="text-sm tracking-widest uppercase border border-gray-600 px-6 py-3 text-gray-400 hover:border-white hover:text-white transition-colors"
        >
          Cancel Reservation
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="uppercase tracking-widest font-bold text-xl mb-6">Book a Table</h2>
      {error && (
        <p className="mb-4 text-sm" style={{ color: "var(--color-brand)" }}>
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className={inputClass}
            placeholder="Your Name"
            value={form.name}
            onChange={set("name")}
          />
          <input
            className={inputClass}
            placeholder="Your Email"
            type="email"
            value={form.email}
            onChange={set("email")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className={`${inputClass} cursor-default`}
            placeholder="Table Number"
            value={selectedTable ? `Table ${selectedTable}` : ""}
            readOnly
          />
          <input
            className={inputClass}
            placeholder="Number of Guests"
            type="number"
            min="1"
            value={form.guests}
            onChange={set("guests")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            className={`${inputClass} cursor-pointer`}
            style={{ backgroundColor: "#000" }}
            value={selectedEvent ? String(selectedEvent.id) : ""}
            onChange={handleEventChange}
          >
            <option value="" disabled>
              Choose Night
            </option>
            {events.map((ev) => (
              <option key={ev.id} value={String(ev.id)}>
                {formatEventLabel(ev)}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            placeholder="Your Contact Number"
            value={form.phone}
            onChange={set("phone")}
          />
        </div>
        <textarea
          className={`${inputClass} resize-none h-32`}
          placeholder="Your Comment"
          value={form.comment}
          onChange={set("comment")}
        />
        <div className="flex justify-end">
          <BtnNormal title={loading ? "RESERVING..." : "RESERVE"} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
