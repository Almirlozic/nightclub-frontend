import Image from "next/image";

async function getEvents() {
  const res = await fetch("https://nightclub-api-dhqe.onrender.com/events", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export default async function EventsCalender() {
  const events = await getEvents();

  return (
    <div>
      {events.map((event, index) => {
        const isEven = index % 2 === 0;

        return (
          <div key={event.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className={isEven ? "order-1" : "md:order-2"}>
              <Image
                src={`https://nightclub-api-dhqe.onrender.com${event.asset.url}`}
                alt={event.asset?.alt || "event image"}
                width={800}
                height={600}
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
            <div className={isEven ? "order-2" : "md:order-1"}>
              <h2 className="text-xl font-semibold">{event.title}</h2>

              <p className="text-sm text-(--color-text)">
                <span className="text-(--color-brand)">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>

                <span className="text-(--color-text)"> | {event.location}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
