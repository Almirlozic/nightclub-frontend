"use client";

import { useState } from "react";

const videos = [
  "/assets/media/video-crowd.mp4",
  "/assets/media/video-dj-crowd-2.mp4",
  "/assets/media/video-dj-crowd1.mp4",
];

const LatestVideo = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i - 1 + videos.length) % videos.length);
  const next = () => setCurrent((i) => (i + 1) % videos.length);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Video with corner accents */}
      <div className="relative w-full max-w-4xl">
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-10 h-10 bg-(--color-brand) z-10"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-10 h-10 bg-(--color-brand) z-10"
          style={{ clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }}
        />

        <video
          key={videos[current]}
          className="w-full aspect-video object-cover"
          autoPlay
          muted
          controls={false}
        >
          <source src={videos[current]} type="video/mp4" />
        </video>
      </div>

      {/* Arrow buttons */}
      <div className="flex gap-2">
        <button
          onClick={prev}
          className="w-10 h-10 border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
          aria-label="Previous video"
        >
          &#9664;
        </button>
        <button
          onClick={next}
          className="w-10 h-10 border border-white text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-200"
          aria-label="Next video"
        >
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default LatestVideo;
