"use client"

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import SocialIcons from "./SocialIcons";

const API_URL = "https://nightclub-api-dhqe.onrender.com/testimonials";
const BASE_URL = "https://nightclub-api-dhqe.onrender.com";

const PersonSpotlight = () => {
  const [people, setPeople] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPeople(data));
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

  if (!people.length) return null;

  return (
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
      <div className="relative w-full max-w-2xl overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {people.map((p) => (
            <div key={p.id} className="flex-[0_0_100%] min-w-0 flex flex-col items-center text-center">
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
              <div className="relative max-w-2xl mb-8 max-h-40 overflow-y-auto">
                <p className="text-white/80">{p.content}</p>
              </div>
              <SocialIcons />
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex gap-2 mt-8">
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
          />
        ))}
      </div>
    </div>
  );
};

export default PersonSpotlight;
