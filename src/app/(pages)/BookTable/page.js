import H2Normal from "@/components/H2Normal";
import BookTable from "@/components/BookTable";

export default async function BookTablePage({ searchParams }) {
  const { eventId } = await searchParams;
  return (
    <div className="bg-(--color-bg) text-white min-h-screen">
      <H2Normal title="Book a Table" bgImage="/assets/bg/footerbg.jpg" />
      <BookTable initialEventId={eventId} />
    </div>
  );
}
