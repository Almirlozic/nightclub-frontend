import EventsCalender from "@/components/EventsCalender";
import H2Normal from "@/components/H2Normal";
import { getEvents } from "@/lib/api";

export default async function Page() {
  const events = await getEvents({
    headers: { "x-api-key": process.env.NIGHT_CLUB_API },
    cache: "no-store",
  });

  return (
    <>
      <div>
        <H2Normal title="EVENTS" bgImage="/assets/bg/footerbg.jpg" />
      </div>
      <div className="p-6">
        <EventsCalender events={events} />
      </div>
    </>
  );
}
