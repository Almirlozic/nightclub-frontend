import EventsCalender from "@/components/EventsCalender";

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
    <div className="p-6">
      <EventsCalender events={events} />
    </div>
  );
}
