import Image from "next/image";
import { notFound } from "next/navigation";

import { MdDateRange } from "react-icons/md";
import { FaDoorOpen } from "react-icons/fa";
import { CiClock1 } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { TbCategoryFilled } from "react-icons/tb";
import { IoMdPricetags } from "react-icons/io";
import { TbRating18Plus } from "react-icons/tb";

import Comments from "@/components/Comments";

import { getEvent, imageUrl } from "@/lib/api";

function InfoItem({ icon, label, value, sub }) {
  return (
    <div className="w-1/2 sm:w-1/4 lg:flex-1 flex flex-col items-center justify-center gap-1 py-6 px-2 text-center border-r border-b border-(--color-brand)/40 last:border-r-0 lg:nth-2:border-r lg:nth-4:border-r">

      <span className="text-(--color-brand) text-2xl md:text-3xl">{icon}</span>

      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">
        {label}
      </span>

      <span className="text-white font-semibold text-xs md:text-sm lg:text-base">{value}</span>

      {sub && <span className="text-gray-400 text-[10px] md:text-xs">{sub}</span>}

    </div>
  );
}

export default async function DetailPage({ params }) {

  const { slug } = await params;

  const event = await getEvent(slug);

  if (!event) notFound();

  const formattedDate = new Date(event.date).toLocaleDateString("da", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startTime = new Date(event.date).toLocaleTimeString("da", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const doorsOpenTime = new Date(event.doorsOpen).toLocaleTimeString("da", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>

      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-screen -mt-24">

        <Image
          src={imageUrl(event.heroAsset.url)}
          alt={event.heroAsset.alt}
          fill
          className="object-cover object-center z-0"
        />

        <div className="absolute flex flex-col justify-start items-start p-4 pt-20 sm:p-8 sm:pt-24 md:p-12 md:pt-28">

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white max-w-xs sm:max-w-md md:max-w-lg">
            {event.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-white/80 max-w-xs sm:max-w-md md:max-w-lg">
            {event.excerpt}
          </p>

          <p className="mt-2 text-xs sm:text-sm text-(--color-brand)">{formattedDate}</p>

        </div>
      </div>

      <div className="border border-(--color-brand) w-full lg:max-w-7xl lg:mx-auto flex flex-wrap lg:flex-nowrap -mt-16 relative z-10">

        <InfoItem icon={<MdDateRange />}     label="Dato"          value={formattedDate} />
        <InfoItem icon={<FaDoorOpen />}      label="Doors Open"    value={doorsOpenTime} />
        <InfoItem icon={<CiClock1 />}        label="Starttidspunkt" value={startTime} />
        <InfoItem
          icon={<FaLocationDot />}
          label="Sted"
          value={event.location}
          sub="Vesterbrogade 1, 1620 København V"
        />
        <InfoItem icon={<TbCategoryFilled />} label="Kategori"     value={event.category} />
        <InfoItem icon={<IoMdPricetags />}    label="Pris"         value={event.price} />
        <InfoItem icon={<TbRating18Plus />}   label="Aldersgrænse" value={event.ageLimit} />

      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-30 w-full lg:max-w-7xl lg:mx-auto px-6 py-12">

        <div>
          <h2 className="text-m tracking-[0.3em] text-neutral-500 uppercase mb-6">Lineup</h2>

          <div className="space-y-4">
            {event.lineup.map((artist, index) => (
              <div key={index} className="border-b border-white/10 pb-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  {artist}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-m tracking-[0.3em] text-neutral-500 uppercase mb-6">Schedule</h2>

          <div className="relative flex flex-col gap-0">

            <div className="absolute left-2.25 top-2 bottom-2 w-px bg-(--color-brand)" />

            <div className="flex items-start gap-4 pb-6">
              <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-(--color-brand) z-10" />
              <div>
                <p className="text-l font-semibold text-white">{doorsOpenTime}</p>
                <p className="text-l text-neutral-400 mt-0.5">Doors open</p>
              </div>
            </div>

            {event.schedule.map((item, index) => (
              <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-(--color-brand) z-10" />
                <div>
                  <p className="text-l font-semibold text-white">{item.time}</p>
                  <p className="text-l text-neutral-400 mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="col-span-full mb-10">
          <h2 className="text-3xl mb-4">Details</h2>
          <p className="leading-loose">{event.description}</p>
        </div>

        <div className="col-span-full">
          <Comments eventId={event.id} />
        </div>

      </div>
    </>
  );
}
