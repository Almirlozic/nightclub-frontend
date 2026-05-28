"use client";

import Image from "next/image";

const TOTAL = 15;

const TABLE_IMAGE = {
  1: "/assets/table/table_1.png",
  2: "/assets/table/table_1.png",
  3: "/assets/table/table_2.png",
  4: "/assets/table/table_1.png",
  5: "/assets/table/table_3.png",
  6: "/assets/table/table_1.png",
  7: "/assets/table/table_1.png",
  8: "/assets/table/table_2.png",
  9: "/assets/table/table_1.png",
  10: "/assets/table/table_3.png",
  11: "/assets/table/table_1.png",
  12: "/assets/table/table_1.png",
  13: "/assets/table/table_2.png",
  14: "/assets/table/table_1.png",
  15: "/assets/table/table_3.png",
};

// AI hjalp med at lave TableUnit med visuelle states for selected og reserved borde.
const TableUnit = ({ number, selected, reserved, onSelect }) => {
  const src = TABLE_IMAGE[number];

  return (
    <button
      disabled={reserved}
      onClick={() => onSelect(selected ? null : number)}
      className={`flex flex-col items-center gap-1 transition-opacity ${
        reserved ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"
      }`}
      title={reserved ? `Table ${number} — Reserved` : `Table ${number}`}
    >
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        <Image src={src} alt={`Table ${number}`} fill style={{ objectFit: "contain", opacity: reserved ? 0.35 : 1 }} />
        {selected && (
          <div
            className="absolute inset-0 rounded"
            style={{ background: "var(--color-brand)", opacity: 0.35, mixBlendMode: "screen" }}
          />
        )}
        {reserved && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] font-bold tracking-widest px-1 py-0.5"
              style={{ color: "var(--color-brand)", border: "1px solid var(--color-brand)", background: "rgba(0,0,0,0.7)" }}
            >
              BOOKED
            </span>
          </div>
        )}
      </div>
      <span
        className="text-xs tracking-widest font-bold"
        style={{ color: reserved ? "var(--color-brand)" : selected ? "var(--color-brand)" : "white" }}
      >
        {number}
      </span>
    </button>
  );
};

export default function TableMap({ selectedTable, onSelect, reservedTables }) {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-5 gap-4 justify-items-center">
        //Hjælp med at lave en grid med 15 borde, hvor hver bord er en TableUnit komponent, der viser om det er selected eller reserved. Reserved borde er disabled og har en "BOOKED" label over sig.
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
          <TableUnit
            key={n}
            number={n}
            selected={selectedTable === n}
            reserved={reservedTables.includes(String(n))}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="flex gap-6 mt-6 text-xs tracking-widest text-gray-400">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block bg-white/20 border border-white/40" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block" style={{ background: "var(--color-brand)" }} /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 inline-block bg-gray-700 opacity-40" /> Reserved
        </span>
      </div>
    </div>
  );
}
