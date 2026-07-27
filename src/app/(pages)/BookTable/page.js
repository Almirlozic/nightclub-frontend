import H2Normal from "@/components/H2Normal";
import BookTable from "@/components/BookTable";
import { getAllReservations, getEvents } from "@/lib/api";

export default async function BookTablePage({ searchParams }) {
  const { eventId } = await searchParams;
  const [events, reservations] = await Promise.all([
    getEvents({ headers: { "x-api-key": process.env.NIGHT_CLUB_API }, cache: "no-store" }),
    getAllReservations({ cache: "no-store" }),
  ]);

  const reservationsByEvent = reservations.reduce((acc, reservation) => {
    const key = String(reservation.eventId);
    if (!acc[key]) acc[key] = [];
    acc[key].push(reservation);
    return acc;
  }, {});

  return (
    <div className="bg-(--color-bg) text-white min-h-screen">
      <H2Normal title="Book a Table" bgImage="/assets/bg/footerbg.jpg" />
      <BookTable
        initialEventId={eventId}
        initialEvents={events}
        initialReservationsByEvent={reservationsByEvent}
      />
    </div>
  );
}
