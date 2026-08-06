"use client";

import BtnNormal from "@/components/BtnNormal";

export default function Error({ reset }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      <h1 className="text-3xl font-bold tracking-widest uppercase text-white">
        Noget gik galt
      </h1>
      <p className="text-white/70 max-w-md">
        Der opstod en fejl. Prøv igen, eller vend tilbage til forsiden.
      </p>
      <div className="flex gap-4">
        <BtnNormal onClick={reset} title="Prøv igen" />
        <BtnNormal href="/" title="Til forsiden" />
      </div>
    </div>
  );
}
