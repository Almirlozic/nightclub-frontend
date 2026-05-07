"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: hovered ? 0.55 : 0 }}
      />

      {/* Corner accents */}
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

      {/* Book Now — slides from top */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center pt-10 z-10 transition-transform duration-300"
        style={{ transform: hovered ? "translateY(0)" : "translateY(-130%)" }}
          >
        <Link href="/BookTable" className="bg-(--color-brand) text-white font-bold tracking-widest px-10 py-3 text-sm">
          Book Now
        </Link>
      </div>

      {/* Title + description — slides up */}
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

      {/* Info bar — always visible */}
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
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    fetch("https://nightclub-api-dhqe.onrender.com/events", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const goTo = (i) => {
    if (i === current) return;
    setDirection(i > current ? "right" : "left");
    setPrev(current);
    setCurrent(i);
    setTimeout(() => setPrev(null), 500);
  };

  if (events.length === 0) return null;

  const pairs = Math.ceil(events.length / 2);
  const currentPair = events.slice(current * 2, current * 2 + 2);
  const prevPair = prev !== null ? events.slice(prev * 2, prev * 2 + 2) : null;

  const renderCards = (pair) => (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {pair.map((event) => (
        <div key={event.id} className="flex-1">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );

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
      <style>{`
        @keyframes fe-enter-right {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fe-enter-left {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes fe-exit-left {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-100%); opacity: 0.6; }
        }
        @keyframes fe-exit-right {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0.6; }
        }
        .fe-enter-right { animation: fe-enter-right 0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fe-enter-left  { animation: fe-enter-left  0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fe-exit-left   { animation: fe-exit-left   0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fe-exit-right  { animation: fe-exit-right  0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
      `}</style>
      <div className="fe-wrapper flex flex-col items-center gap-6 px-4 sm:px-8 py-12 mb-12">
        <div className="relative w-full max-w-4xl overflow-hidden">
          {/* Exiting pair */}
          {prevPair && (
            <div
              key={`exit-${prev}`}
              className={`absolute inset-0 ${direction === "right" ? "fe-exit-left" : "fe-exit-right"}`}
            >
              {renderCards(prevPair)}
            </div>
          )}
          {/* Entering pair */}
          <div
            key={`enter-${current}`}
            className={prevPair ? (direction === "right" ? "fe-enter-right" : "fe-enter-left") : ""}
          >
            {renderCards(currentPair)}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex gap-3">
          {Array.from({ length: pairs }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-4 h-4 transition-colors duration-200"
              style={{
                background: i === current ? "var(--color-brand)" : "transparent",
                border: "2px solid",
                borderColor: i === current ? "var(--color-brand)" : "white",
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
