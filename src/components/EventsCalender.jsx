"use client";

import Image from "next/image";

import { useState } from "react";

import BtnNormal from "./BtnNormal";

import { imageUrl } from "@/lib/api";

export default function EventsCalender({ events }) {

  const pageSize = 3;

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));

  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * pageSize;

  const currentEvents = events.slice(start, start + pageSize);

  return (
    <div>

      {currentEvents.map((event, index) => {

        const isEven = index % 2 === 0;

        return (
          <div key={event.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10 mt-10">

            <div className={isEven ? "order-1" : "md:order-2"}>
              <Image
                src={imageUrl(event.heroAsset.url)}
                alt={event.heroAsset?.alt || "event image"}
                width={800}
                height={800}
                className="w-full h-68 object-center"
              />
            </div>

            <div
              className={`flex flex-col ${
                isEven ? "order-2 md:pl-6 text-left" : "md:order-1 md:pr-6 text-left md:text-right"
              }`}
            >
              <h2 className="text-xl font-semibold">{event.title}</h2>

              <p className="text-sm text-(--color-text)">
                <span className="text-(--color-brand)">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {" "}-{" "}
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
                <span className="text-(--color-text)"> | {event.location}</span>
              </p>

              <p className="mt-4 text-sm">{event.description}</p>

              <BtnNormal
                href={`/detailview/${event.slug}`}
                title="READ MORE"
                className={`mt-10 self-start ${isEven ? "md:self-start" : "md:self-end"}`}
              />

            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2 justify-center mt-6">

        {Array.from({ length: totalPages }).map((_, i) => {

          const pageNumber = i + 1;

          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-4 py-2 border-b rounded-md transition ${
                isActive
                  ? "border-(--color-text) text-(--color-text)"
                  : "border-gray-300 text-(--color-text)"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}
