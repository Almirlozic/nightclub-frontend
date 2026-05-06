"use client";

import { useState } from "react";
import Image from "next/image";
import { IoRestaurant } from "react-icons/io5";
import { FaChampagneGlasses } from "react-icons/fa6";

const cards = [
  {
    src: "/assets/content-img/thumb1.jpg",
    icon: "/assets/icon/favicon.png",
    label: "NIGHT CLUB",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
  {
    src: "/assets/content-img/reastaurant_1.jpg",
    icon: IoRestaurant,
    label: "RESTAURANT",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
  {
    src: "/assets/content-img/thumb2.jpg",
    icon: FaChampagneGlasses,
    label: "BAR",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.",
  },
];

const Card = ({ src, icon: Icon, label, description }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full max-w-75 h-95 overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Default: photo */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          hovered ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image src={src} alt={label} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Hover: info card */}
      <div
        className={`absolute inset-0 bg-(--color-bg) transition-opacity duration-300 flex flex-col items-center justify-center text-center px-6 gap-4 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-6 h-6 bg-(--color-brand)"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            transformOrigin: "top left",
            animation: hovered ? "corner-pop 0.3s ease both" : "none",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-6 h-6 bg-(--color-brand)"
          style={{
            clipPath: "polygon(100% 100%, 0 100%, 100% 0)",
            transformOrigin: "bottom right",
            animation: hovered ? "corner-pop 0.3s ease 0.05s both" : "none",
          }}
        />

        {/* Icon */}
        <div
          className="border border-(--color-brand) p-4"
          style={{ animation: hovered ? "slide-from-left 0.4s ease 0.15s both" : "none" }}
        >
          {typeof Icon === "string" ? (
            <img src={Icon} alt={label} className="w-10 h-10" />
          ) : (
            <Icon size={40} className="text-(--color-brand)" />
          )}
        </div>

        <h3
          className="text-white font-bold tracking-widest text-lg"
          style={{ animation: hovered ? "slide-from-right 0.4s ease 0.2s both" : "none" }}
        >
          {label}
        </h3>
        <p
          className="text-white text-sm leading-relaxed"
          style={{ animation: hovered ? "slide-from-right 0.4s ease 0.25s both" : "none" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const WelcomeInNightclub = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12 mb-12 px-4">
      {cards.map((card) => (
        <Card key={card.label} {...card} />
      ))}
    </div>
  );
};

export default WelcomeInNightclub;
