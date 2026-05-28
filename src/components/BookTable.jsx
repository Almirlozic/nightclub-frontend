"use client";

import { useState, useEffect } from "react";
import TableMap from "./TableMap";
import BookingForm from "./Bookingform";
import { getReservations } from "@/lib/api";


//ai hjalp med at importere child components og API funktion, og skrive den overordnede struktur for BookTable komponenten, som håndterer bordreservationer. Den bruger useState til at holde styr på det valgte bord, den valgte begivenhed og reserverede borde. useEffect bruges til at hente reservationer for den valgte begivenhed, når den ændres. Komponenten render en TableMap og en BookingForm, og passer de nødvendige props ned til dem. initialEventId prop bruges til at forudvælge en begivenhed i BookingForm.
export default function BookTable({ initialEventId }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reservedTables, setReservedTables] = useState([]);

  useEffect(() => {
    if (!selectedEvent) {
      setReservedTables([]);
      return;
    }
    getReservations(selectedEvent.id)
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
