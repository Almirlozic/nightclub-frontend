"use client";

import { useState } from "react";
import TableMap from "./TableMap";
import BookingForm from "./Bookingform";

export default function BookTable({ initialEventId, initialEvents = [], initialReservationsByEvent = {} }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const initialSelectedEvent =
    initialEvents.find((event) => String(event.id) === String(initialEventId)) ?? null;
  const [selectedEvent, setSelectedEvent] = useState(initialSelectedEvent);

  const reservedTables = selectedEvent
    ? (initialReservationsByEvent[String(selectedEvent.id)] ?? []).map((reservation) => String(reservation.table))
    : [];

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
        events={initialEvents}
      />
    </div>
  );
}
