"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

const EventCard = ({ event }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={`https://nightclub-api-dhqe.onrender.com${event.asset.url}`}
        alt={event.asset.alt}
        fill
        style={{ objectFit: "cover" }}
      />

      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: hovered ? 0.55 : 0 }}
      />

      <div
        className="absolute top-0 left-0 w-8 h-8 bg-(--color-brand) z-10"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          transformOrigin: "top left",
          transform: hovered ? "scale(1)" : "scale(0)",
          opacity: hovered ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        }}
      />
      <div
        className="absolute z-10"
        style={{
          bottom: "48px",
          right: 0,
          width: "32px",
          height: "32px",
          background: "var(--color-brand)",
          clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
          transformOrigin: "bottom right",
          transform: hovered ? "scale(1)" : "scale(0)",
          opacity: hovered ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s, opacity 0.3s ease 0.05s",
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 flex justify-center pt-10 z-10 transition-transform duration-300"
        style={{ transform: hovered ? "translateY(0)" : "translateY(-130%)" }}
      >
        <Link href="/BookTable" className="bg-(--color-brand) text-white font-bold tracking-widest px-10 py-3 text-sm">
          Book Now
        </Link>
      </div>

      <div
        className="absolute left-0 right-0 z-10 px-6 py-5 transition-transform duration-300"
        style={{
          bottom: "48px",
          transform: hovered ? "translateY(0)" : "translateY(120%)",
        }}
      >
        <h3 className="text-white font-bold tracking-widest text-lg mb-2">
          {event.title}
        </h3>
        <p className="text-white text-sm leading-relaxed">{event.description}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-(--color-brand) px-6 h-12 flex items-center gap-6 text-white text-sm font-semibold">
        <span className="shrink-0">{formatDate(event.date)}</span>
        <span className="truncate">{event.title}</span>
        <span className="shrink-0">Doors: {formatTime(event.doorsOpen)}</span>
      </div>
    </div>
  );
};

const FeauteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    fetch("https://nightclub-api-dhqe.onrender.com/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (events.length === 0) return null;

  const pairs = [];
  for (let i = 0; i < events.length; i += 2) {
    pairs.push(events.slice(i, i + 2));
  }

  return (
    <>
      <style>{`
        .fe-wrapper {
          background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.88)), url('/assets/bg/slider_bg_overlay.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
      <div className="fe-wrapper flex flex-col items-center gap-6 px-4 sm:px-8 py-12 mb-12">
        <div className="w-full max-w-4xl overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {pairs.map((pair, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="flex flex-col md:flex-row gap-8 w-full">
                  {pair.map((event) => (
                    <div key={event.id} className="flex-1">
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="w-4 h-4 transition-colors duration-200"
              style={{
                background: i === selectedIndex ? "var(--color-brand)" : "transparent",
                border: "2px solid",
                borderColor: i === selectedIndex ? "var(--color-brand)" : "white",
              }}
              aria-label={`Go to events ${i * 2 + 1} and ${i * 2 + 2}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FeauteredEvents;
