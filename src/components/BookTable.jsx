"use client";

import { useState, useEffect } from "react";
import TableMap from "./TableMap";
import BookingForm from "./Bookingform";

const API = "https://nightclub-api-dhqe.onrender.com";

export default function BookTable({ initialEventId }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reservedTables, setReservedTables] = useState([]);

  useEffect(() => {
    if (!selectedEvent) {
      setReservedTables([]);
      return;
    }
    fetch(`${API}/reservations?eventId=${selectedEvent.id}`)
      .then((r) => r.json())
      .then((data) => setReservedTables(data.map((r) => String(r.table))));
  }, [selectedEvent]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <TableMap
        selectedTable={selectedTable}
        onSelect={setSelectedTable}
        reservedTables={reservedTables}
      />
      <BookingForm
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        initialEventId={initialEventId}
      />
    </div>
  );
}
