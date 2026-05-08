"use client"

import { useState, useEffect, useRef } from "react";
import SocialIcons from "./SocialIcons";

const API_URL = "https://nightclub-api-dhqe.onrender.com/testimonials";
const BASE_URL = "https://nightclub-api-dhqe.onrender.com";

const PersonSpotlight = () => {
  const [people, setPeople] = useState([]);
  const [current, setCurrent] = useState(0);
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

  if (!people.length) return null;

  const person = people[current];

  return (
    <div className="flex flex-col items-center text-center px-4 py-16">
      <img
        src={BASE_URL + person.asset.url}
        alt={person.asset.alt}
        width={person.asset.width}
        height={person.asset.height}
        className="object-cover mb-6"
      />
      <h3 className="text-white tracking-widest uppercase text-xl mb-4">
        {person.name}
      </h3>
      <div ref={scrollRef} className="relative max-w-2xl mb-8 max-h-40 overflow-y-auto">
        <p className="text-white/80">{person.content}</p>
        {canScroll && (
          <div className="sticky bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none flex items-end justify-center pb-1">
            <span className="text-white text-lg animate-bounce drop-shadow-lg">▼</span>
          </div>
        )}
      </div>
      <SocialIcons />
      <div className="flex gap-2 mt-8">
        {people.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-4 h-4 transition-colors ${
              i === current ? "bg-(--color-brand)" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonSpotlight;
