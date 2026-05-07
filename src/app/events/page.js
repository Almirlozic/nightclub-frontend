import EventsCalender from "@/components/EventsCalender";
import H2Normal from "@/components/H2Normal";

async function getEvents() {
  const res = await fetch("https://nightclub-api-dhqe.onrender.com/events", {
    headers: {
      "x-api-key": process.env.NIGHT_CLUB_API,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export default async function Page() {
  const events = await getEvents();

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
