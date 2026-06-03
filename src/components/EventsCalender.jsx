// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Vi bruger useState til at holde styr på hvilken side brugeren er på.
"use client";

// Henter Image fra Next.js — optimeret billedkomponent der skalerer og komprimerer automatisk.
import Image from "next/image";

// Henter useState fra React — lader os gemme og ændre information.
import { useState } from "react";

// Henter vores custom knap-komponent BtnNormal.
import BtnNormal from "./BtnNormal";

// Henter imageUrl fra vores API-bibliotek — bygger den fulde URL til et billede.
import { imageUrl } from "@/lib/api";

// EventsCalender modtager én prop: events — en liste af event-objekter fra backend.
// Komponenten viser 3 events ad gangen med bladre-knapper (pagination).
// export default er skrevet direkte foran function — det er en alternativ måde at eksportere på.
export default function EventsCalender({ events }) {

  // pageSize er antallet af events der vises på én side — fast sat til 3.
  const pageSize = 3;

  // Beregner det samlede antal sider.
  // events.length / pageSize giver f.eks. 7/3 = 2.333...
  // Math.ceil(...) runder altid OP til nærmeste hele tal → 3 sider.
  // Math.max(1, ...) sikrer at der altid er mindst 1 side, selv hvis listen er tom.
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));

  // currentPage holder styr på hvilken side brugeren er på — starter på side 1.
  const [currentPage, setCurrentPage] = useState(1);

  // Beregner indekset for det første event på den aktuelle side.
  // Side 1: (1-1) * 3 = 0 → starter fra index 0
  // Side 2: (2-1) * 3 = 3 → starter fra index 3
  const start = (currentPage - 1) * pageSize;

  // .slice(start, start + pageSize) skærer en del af events-arrayet ud.
  // Returnerer kun de 3 events der hører til den aktuelle side.
  const currentEvents = events.slice(start, start + pageSize);

  return (
    <div>

      {/* Løber igennem de 3 events på den aktuelle side og laver et element for hvert */}
      {currentEvents.map((event, index) => {

        // isEven er true hvis index er et lige tal (0, 2, 4...) — altså første og tredje event.
        // % er modulo-operatoren: 0 % 2 = 0 (lige), 1 % 2 = 1 (ulige).
        // Bruges til at skifte mellem billede-til-venstre og billede-til-højre layout.
        const isEven = index % 2 === 0;

        return (
          // Hvert event vises i et 2-kolonne grid: billede og tekst side om side på desktop.
          // key={event.id} giver hvert element et unikt ID som React kræver i lister.
          // mb-10 mt-10 giver luft over og under hvert event.
          <div key={event.id} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-10 mt-10">

            {/* BILLEDKOLONNE
                order-1 på mobile: billedet vises først (øverst).
                md:order-2 på desktop (ulige events): billedet rykkes til højre. */}
            <div className={isEven ? "order-1" : "md:order-2"}>
              <Image
                // imageUrl() bygger den fulde URL ud fra den relative URL fra API'et
                src={imageUrl(event.heroAsset.url)}
                // ?. er optional chaining: brug event.heroAsset.alt hvis det findes, ellers "event image"
                alt={event.heroAsset?.alt || "event image"}
                width={800}
                height={800}
                // w-full: fylder kolonnens fulde bredde | h-68: fast højde | object-center: centrerer billedet
                className="w-full h-68 object-center"
              />
            </div>

            {/* TEKSTKOLONNE
                Lige events (isEven): tekst til venstre, padding til højre, venstrestillet tekst.
                Ulige events: på desktop rykkes kolonnen til venstre (md:order-1) og teksten højrestilles. */}
            <div
              className={`flex flex-col ${
                isEven ? "order-2 md:pl-6 text-left" : "md:order-1 md:pr-6 text-left md:text-right"
              }`}
            >
              {/* Eventets titel */}
              <h2 className="text-xl font-semibold">{event.title}</h2>

              {/* Dato, tidspunkt og lokation */}
              <p className="text-sm text-(--color-text)">
                <span className="text-(--color-brand)">
                  {/* Formaterer datoen til kort format, f.eks. "Mar 15" */}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    // month: "short" → forkortet månedsnavn (Jan, Feb, Mar...)
                    month: "short",
                    // day: "numeric" → dagen som tal
                    day: "numeric",
                  })}
                  {/* {" "} indsætter et mellemrum i JSX (ellers ignoreres det) */}
                  {" "}-{" "}
                  {/* Formaterer tidspunktet, f.eks. "21:30" */}
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    // hour og minute: "2-digit" → altid to cifre (f.eks. 09, 21)
                    hour: "2-digit",
                    minute: "2-digit",
                    // hour12: false → brug 24-timers format (ikke AM/PM)
                    hour12: false,
                  })}
                </span>
                {/* Lodret streg som separator, efterfulgt af lokationen */}
                <span className="text-(--color-text)"> | {event.location}</span>
              </p>

              {/* Kortfattet beskrivelse af eventet */}
              <p className="mt-4 text-sm">{event.description}</p>

              {/* "READ MORE"-knap der linker til eventets detaljeside.
                  href bruger event.slug — en URL-venlig version af eventets navn.
                  Template literal `...` bygger URL'en dynamisk, f.eks. "/detailview/dj-night-2024".
                  self-start/self-end justerer knappen til venstre eller højre afhængigt af layout. */}
              <BtnNormal
                href={`/detailview/${event.slug}`}
                title="READ MORE"
                className={`mt-10 self-start ${isEven ? "md:self-start" : "md:self-end"}`}
              />

            </div>
          </div>
        );
      })}

      {/* PAGINATION — bladre-knapper i bunden */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">

        {/* Array.from({ length: totalPages }) laver et tomt array med totalPages antal pladser.
            .map((_, i) => ...) løber igennem dem — _ er elementet (vi ignorerer det), i er indekset.
            Det giver os en sidenummerknap for hvert sidetal. */}
        {Array.from({ length: totalPages }).map((_, i) => {

          // Sidetallet er indeks + 1, fordi arrays starter fra 0 men sidenumre fra 1.
          const pageNumber = i + 1;

          // isActive er true hvis denne knap svarer til den side brugeren er på.
          const isActive = pageNumber === currentPage;

          return (
            // Sidenummerknap — klik på den hopper til den tilsvarende side.
            <button
              key={pageNumber}
              // type="button" forhindrer knappen i at opføre sig som en submit-knap i en formular.
              type="button"
              // Sætter currentPage til dette sidetal når der klikkes.
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-4 py-2 border-b rounded-md transition ${
                // Aktiv side: fremhævet kant og tekstfarve.
                // Inaktive sider: grå kant, normal tekstfarve.
                isActive
                  ? "border-(--color-text) text-(--color-text)"
                  : "border-gray-300 text-(--color-text)"
              }`}
            >
              {/* Viser sidetallet på knappen */}
              {pageNumber}
            </button>
          );
        })}

        {/* "Next"-knap der går én side frem.
            Math.min(prev + 1, totalPages) sikrer at vi aldrig går forbi den sidste side.
            disabled={currentPage === totalPages} deaktiverer knappen på den sidste side.
            disabled:cursor-not-allowed — viser en "forbudt"-cursor når den er deaktiveret.
            disabled:opacity-50 — gør knappen halvt gennemsigtig når den er deaktiveret. */}
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
