"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, easeIn, easeInOut, spring } from "framer-motion";

export default function Gallery() {
  const images = [
    { id: 1, title: "Night Club", desc: "Nightclub atmosphere" },
    { id: 2, title: "Gallery 2", desc: "Crowd energy" },
    { id: 3, title: "Gallery 3", desc: "DJ performance" },
    { id: 4, title: "Gallery 4", desc: "Lights & stage" },
    { id: 5, title: "Gallery 5", desc: "Dancefloor vibes" },
    { id: 6, title: "Gallery 6", desc: "VIP section" },
    { id: 7, title: "Gallery 7", desc: "Closing moments" },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const open = (index) => setActiveIndex(index);
  const close = () => setActiveIndex(null);

  const next = () => setActiveIndex((prev) => (prev + 1) % images.length);

  const prev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeIndex]);

  return (
    <>
      <div className="grid grid-cols-12">
        {images.slice(0, 4).map((img, index) => (
          <motion.div
            key={img.id}
            className="relative h-[250px] cursor-pointer overflow-hidden group col-span-12 md:col-span-3"
            onClick={() => open(index)}
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: easeIn, type: "spring", stiffness: 50, damping: 18 }}
          >
            <Image
              src={`/assets/content-img/gallery${img.id}_big.jpg`}
              alt={img.title}
              fill
              className="object-cover"
            />

            <div
              className="absolute top-0 left-0 w-10 h-10 bg-(--color-brand) opacity-0 group-hover:opacity-100 transition"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />

            <div
              className="absolute bottom-0 right-0 w-10 h-10 bg-(--color-brand) opacity-0 group-hover:opacity-100 transition"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
          </motion.div>
        ))}
        {images.slice(4, 7).map((img, index) => (
          <motion.div
            key={img.id}
            className="relative h-[250px] cursor-pointer overflow-hidden group col-span-12 md:col-span-4"
            onClick={() => open(index + 4)}
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, ease: easeIn, type: "spring", stiffness: 50, damping: 18 }}
          >
            <Image
              src={`/assets/content-img/gallery${img.id}_big.jpg`}
              alt={img.title}
              fill
              className="object-cover"
            />
            <div
              className="absolute top-0 left-0 w-10 h-10 bg-(--color-brand) opacity-0 group-hover:opacity-100 transition"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-10 h-10 bg-(--color-brand) opacity-0 group-hover:opacity-100 transition"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            />
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-[80vw] h-[80vh] flex flex-col items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/assets/content-img/gallery${images[activeIndex].id}_big.jpg`}
                  alt={images[activeIndex].title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center mt-4 text-white">
                <h2 className="text-xl font-semibold">{images[activeIndex].title}</h2>
                <p className="text-sm text-gray-300 mt-1">{images[activeIndex].desc}</p>
              </div>

              <button
                onClick={prev}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 text-white text-xl border px-2"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 text-white text-xl border px-2"
              >
                ›
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
