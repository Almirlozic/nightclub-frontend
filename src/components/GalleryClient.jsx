"use client";

import { useState } from "react";

import Image from "next/image";

import { motion } from "framer-motion";

import { imageUrl } from "@/lib/api";

const GalleryClient = ({ images = [] }) => {

  const [currentIndex, setCurrentIndex] = useState(null);

  const [touchStart, setTouchStart] = useState(null);

  const [touchEnd, setTouchEnd] = useState(null);

  const selectedImage = currentIndex !== null ? images[currentIndex] : null;

  const closeModal = () => setCurrentIndex(null);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage({ stopPropagation: () => {} });
    }
    if (isRightSwipe) {
      prevImage({ stopPropagation: () => {} });
    }
  };

  return (
    <>

      <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-0">

        {images.slice(0, 7).map((image, index) => (

          <motion.div
            key={image.id}
            className={`relative overflow-hidden image-corners ${
              index < 4 ? "col-span-3 md:col-span-3" : "col-span-4 md:col-span-4"
            }`}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{
              duration: 0.4,
              delay: index * 0.07,
              ease: [0.12, 0, 0.39, 0],
            }}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={imageUrl(image.asset.url)}
              alt={image.asset.alt}
              width={800}
              height={800}
              className="w-full h-full object-cover block cursor-pointer"
            />
          </motion.div>

        ))}
      </motion.div>

      {selectedImage && (

        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>

            <button
              onClick={prevImage}
              className="hidden md:block absolute -left-4 md:-left-20 text-white text-2xl md:text-xl border py-1 px-3 md:py-0 md:px-2 bg-black/50 md:bg-transparent"
            >
              ‹
            </button>

            <div className="bg-black w-fit mx-auto">
              <Image
                src={imageUrl(selectedImage.asset.url)}
                alt={selectedImage.asset.alt}
                width={selectedImage.asset.width}
                height={selectedImage.asset.height}
                className="max-h-[85vh] w-auto object-contain"
              />

              <div className="max-w-120">
                <h3 className="text-white px-6 py-2 text-xl">{selectedImage.description}</h3>
                <p className="text-white px-6 py-2 text-sm leading-loose">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, quisquam nam quis
                  aperiam nisi dolor beatae incidunt animi, sed eveniet, eligendi quos neque harum
                  laborum?
                </p>
              </div>
            </div>

            <button
              onClick={nextImage}
              className="hidden md:block absolute -right-4 md:-right-20 text-white text-2xl md:text-xl border py-1 px-3 md:py-0 md:px-2 bg-black/50 md:bg-transparent"
            >
              ›
            </button>

          </div>
        </div>
      )}

    </>
  );
};

export default GalleryClient;
