"use client"

import { useState, useEffect, useRef } from "react";
import SocialIcons from "./SocialIcons";

const API_URL = "https://nightclub-api-dhqe.onrender.com/testimonials";
const BASE_URL = "https://nightclub-api-dhqe.onrender.com";

const PersonSpotlight = () => {
  const [people, setPeople] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("right");
  const [canScroll, setCanScroll] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPeople(data));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setCanScroll(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    check();
    el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, [current, people]);

  const goTo = (i) => {
    if (i === current) return;
    setDirection(i > current ? "right" : "left");
    setPrev(current);
    setCurrent(i);
    setTimeout(() => setPrev(null), 450);
  };

  if (!people.length) return null;

  const person = people[current];
  const prevPerson = prev !== null ? people[prev] : null;

  const renderSlide = (p, ref) => (
    <div className="flex flex-col items-center text-center">
      <img
        src={BASE_URL + p.asset.url}
        alt={p.asset.alt}
        width={p.asset.width}
        height={p.asset.height}
        className="object-cover mb-6"
      />
      <h3 className="text-white tracking-widest uppercase text-xl mb-4">
        {p.name}
      </h3>
      <div ref={ref} className="relative max-w-2xl mb-8 max-h-40 overflow-y-auto">
        <p className="text-white/80">{p.content}</p>
        {canScroll && (
          <div className="sticky bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end justify-center pb-1">
            <span className="text-white text-lg animate-bounce drop-shadow-lg">▼</span>
          </div>
        )}
      </div>
      <SocialIcons />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes ps-enter-right {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes ps-enter-left {
          from { transform: translateX(-100%); opacity: 0.6; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes ps-exit-left {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-100%); opacity: 0.6; }
        }
        @keyframes ps-exit-right {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0.6; }
        }
        .ps-enter-right { animation: ps-enter-right 0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .ps-enter-left  { animation: ps-enter-left  0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .ps-exit-left   { animation: ps-exit-left   0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .ps-exit-right  { animation: ps-exit-right  0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
      `}</style>
      <div
        className="relative flex flex-col items-center px-4 py-16"
        style={{
          backgroundImage: "url('/assets/bg/footerbg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative w-full max-w-2xl overflow-hidden">
          {prevPerson && (
            <div
              key={`exit-${prev}`}
              className={`absolute inset-0 ${direction === "right" ? "ps-exit-left" : "ps-exit-right"}`}
            >
              {renderSlide(prevPerson, null)}
            </div>
          )}
          <div
            key={`enter-${current}`}
            className={prevPerson ? (direction === "right" ? "ps-enter-right" : "ps-enter-left") : ""}
          >
            {renderSlide(person, scrollRef)}
          </div>
        </div>
        <div className="relative flex gap-2 mt-8">
          {people.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-4 h-4 transition-colors duration-200"
              style={{
                background: i === current ? "var(--color-brand)" : "transparent",
                border: "2px solid",
                borderColor: i === current ? "var(--color-brand)" : "white",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonSpotlight;
