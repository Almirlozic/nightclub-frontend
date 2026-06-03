# EXPLAINED.md — Kode forklaret linje for linje

Denne fil forklarer **hver eneste linje kode** i simple ord — som om du aldrig har kodet før.
Kommentarer starter med `//` og står over den linje de forklarer.

---

## detailview/[slug]/page.js

```jsx
// Henter Image fra Next.js — optimeret billedkomponent.
import Image from "next/image";

// Henter ikoner fra react-icons-biblioteket.
// react-icons er en pakke med tusindvis af ikoner fra kendte ikonbiblioteker.
// Hvert ikon er en komponent man bare skriver som <MdDateRange /> i JSX.
import { MdDateRange } from "react-icons/md";       // Kalenderikon
import { FaDoorOpen } from "react-icons/fa";         // Dørikon
import { CiClock1 } from "react-icons/ci";           // Urikon
import { FaLocationDot } from "react-icons/fa6";     // Lokationsikon (nålespids)
import { TbCategoryFilled } from "react-icons/tb";   // Kategoriikon
import { IoMdPricetags } from "react-icons/io";      // Prisikon
import { TbRating18Plus } from "react-icons/tb";     // 18+-aldersgrænse-ikon

// Henter Comments-komponenten (stavefejlen "Commments" med tre m'er er i den originale kode).
import Commments from "@/components/Comments";

// Henter to funktioner fra vores API-bibliotek:
//   getEvent  — henter data for ét specifikt event ud fra dets slug
//   imageUrl  — bygger den fulde URL til et billede
import { getEvent, imageUrl } from "@/lib/api";

// InfoItem er en lille genanvendelig komponent til én informationscelle i infobaren.
// Den modtager fire props:
//   icon  — et React-ikon-element (f.eks. <MdDateRange />)
//   label — den grå overskrift (f.eks. "Dato")
//   value — den hvide hovedværdi (f.eks. "15. marts 2024")
//   sub   — en valgfri lille undertekst (f.eks. en adresse)
function InfoItem({ icon, label, value, sub }) {
  return (
    // Cellen fylder halvdelen af bredden på mobil (w-1/2), en fjerdedel på sm, og fordeles jævnt på lg.
    // items-center: centrerer indholdet vandret.
    // border-r border-b: streg til højre og i bunden — skaber gitteret i infobaren.
    // last:border-r-0: den SIDSTE celle i rækken har ingen højre streg (Tailwind "last child"-modifier).
    // border-(--color-brand)/40: brandfarve med 40% gennemsigtighed.
    <div className="w-1/2 sm:w-1/4 lg:flex-1 flex flex-col items-center justify-center gap-1 py-6 px-2 text-center border-r border-b border-(--color-brand)/40 last:border-r-0 lg:nth-2:border-r lg:nth-4:border-r">

      {/* Ikonet vises i brandfarven med stor skriftstørrelse */}
      <span className="text-(--color-brand) text-2xl md:text-3xl">{icon}</span>

      {/* Etiketten — grå, meget lille, store bogstaver med bogstavmellemrum */}
      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-widest mt-1">
        {label}
      </span>

      {/* Hovedværdien — hvid og fed */}
      <span className="text-white font-semibold text-xs md:text-sm lg:text-base">{value}</span>

      {/* sub er valgfri — vises kun hvis den er givet (ikke undefined/null).
          && er "short-circuit": højre side vises kun hvis venstre side er sand. */}
      {sub && <span className="text-gray-400 text-[10px] md:text-xs">{sub}</span>}

    </div>
  );
}

// DetailPage er en async server-komponent — Next.js kører den på serveren og henter data.
// Den modtager { params } — et objekt fra Next.js med URL-parametre.
// Filen ligger i mappen [slug], som er en "dynamisk rute" i Next.js:
//   Hvis URL'en er /detailview/dj-night-2024, er slug = "dj-night-2024".
//   Next.js finder automatisk denne fil og sender slug som parameter.
export default async function DetailPage({ params }) {

  // await params er nødvendigt i nyere versioner af Next.js, fordi params er en Promise.
  // Destructuring { slug } pakker slug-værdien ud af params-objektet.
  const { slug } = await params;

  // Henter event-data fra backend ud fra slug — await venter på svaret.
  const event = await getEvent(slug);

  // Formaterer eventets dato til dansk langt format, f.eks. "15. marts 2024".
  const formattedDate = new Date(event.date).toLocaleDateString("da", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Formaterer starttidspunktet til timer og minutter, f.eks. "21:30".
  const startTime = new Date(event.date).toLocaleTimeString("da", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Formaterer døråbningstidspunktet på samme måde som startTime.
  // event.doorsOpen er et separat tidsstempel fra backend.
  const doorsOpenTime = new Date(event.doorsOpen).toLocaleTimeString("da", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    // React Fragment — samler flere elementer uden ekstra HTML-element
    <>

      {/* HERO-BILLEDE — fylder hele skærmen og skjules bag infobaren */}
      {/* relative: nødvendigt for at det absolutte tekstlag indeni positioneres rigtigt.
          -mt-24: negativ margin-top trækker sektionen op bag headeren (headeren er ca. 24 enheder høj).
          Højden stiger med skærmstørrelse: 50vh → 60vh → 80vh → 100vh (hele skærmen). */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-screen -mt-24">

        <Image
          src={imageUrl(event.heroAsset.url)}
          alt={event.heroAsset.alt}
          // fill er en Next.js Image-prop der får billedet til at fylde forælderelementet fuldstændigt.
          // Kræver at forælderelementet har position: relative (sat ovenfor).
          fill
          // object-cover: billedet beskæres og fylder pladsen uden at blive skævt.
          // object-center: beskæringen centreres.
          // z-0: billedet ligger i bunden af stakkens lagorden.
          className="object-cover object-center z-0"
        />

        {/* Tekstlag oven på billedet — titel, uddrag og dato.
            absolute: placeret relativt til forælderelementet (billedet).
            pt-20/pt-24/pt-28: ekstra padding-top for at skubbe teksten ned under headeren. */}
        <div className="absolute flex flex-col justify-start items-start p-4 pt-20 sm:p-8 sm:pt-24 md:p-12 md:pt-28">

          {/* Eventets titel — skriftstørrelsen stiger med skærmstørrelsen */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white max-w-xs sm:max-w-md md:max-w-lg">
            {event.title}
          </h1>

          {/* Kort uddrag/teaser-tekst — hvid med 80% gennemsigtighed */}
          <p className="mt-3 text-xs sm:text-sm md:text-base text-white/80 max-w-xs sm:max-w-md md:max-w-lg">
            {event.excerpt}
          </p>

          {/* Datoen i brandfarven under uddraget */}
          <p className="mt-2 text-xs sm:text-sm text-(--color-brand)">{formattedDate}</p>

        </div>
      </div>

      {/* INFOBAR — en vandret boks med 7 informationsceller om eventet.
          -mt-16: negativ margin trækker baren op og overlapper bunden af herobilledet.
          relative z-10: sikrer at baren vises ovenpå billedet (højere z-index end z-0).
          lg:max-w-7xl lg:mx-auto: på store skærme begrænses bredden og centreres. */}
      <div className="border border-(--color-brand) w-full lg:max-w-7xl lg:mx-auto flex flex-wrap lg:flex-nowrap -mt-16 relative z-10">

        {/* Syv InfoItem-celler — én per information.
            Hvert ikon er en React-komponent fra react-icons, skrevet som JSX: <MdDateRange /> */}
        <InfoItem icon={<MdDateRange />}     label="Dato"          value={formattedDate} />
        <InfoItem icon={<FaDoorOpen />}      label="Doors Open"    value={doorsOpenTime} />
        <InfoItem icon={<CiClock1 />}        label="Starttidspunkt" value={startTime} />
        <InfoItem
          icon={<FaLocationDot />}
          label="Sted"
          value={event.location}
          // sub er den valgfrie undertekst — her bruges den til adressen
          sub="Vesterbrogade 1, 1620 København V"
        />
        <InfoItem icon={<TbCategoryFilled />} label="Kategori"     value={event.category} />
        <InfoItem icon={<IoMdPricetags />}    label="Pris"         value={event.price} />
        <InfoItem icon={<TbRating18Plus />}   label="Aldersgrænse" value={event.ageLimit} />

      </div>

      {/* HOVED-INDHOLD — to-kolonne grid med lineup, schedule, detaljer og kommentarer.
          col-span-full på visse børn lader dem strække sig over begge kolonner.
          lg:max-w-7xl lg:mx-auto: begrænset bredde og centreret på store skærme. */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-30 w-full lg:max-w-7xl lg:mx-auto px-6 py-12">

        {/* LINEUP-KOLONNE */}
        <div>
          {/* Overskrift med store bogstaver og bogstavmellemrum */}
          <h2 className="text-m tracking-[0.3em] text-neutral-500 uppercase mb-6">Lineup</h2>

          {/* space-y-4 tilføjer lodret mellemrum mellem hvert artist-element */}
          <div className="space-y-4">
            {/* event.lineup er en liste af kunstnernavne — map() laver et element for hvert */}
            {event.lineup.map((artist, index) => (
              // border-b border-white/10: tynd halvt-gennemsigtig linje under hvert navn
              <div key={index} className="border-b border-white/10 pb-4">
                {/* Kunstnernavnet — meget stort, fed og med store bogstaver */}
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                  {artist}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* SCHEDULE-KOLONNE — en visuel tidslinje */}
        <div>
          <h2 className="text-m tracking-[0.3em] text-neutral-500 uppercase mb-6">Schedule</h2>

          {/* relative på denne div er nødvendigt for at den absolutte tidslinje-streg virker */}
          <div className="relative flex flex-col gap-0">

            {/* Den lodrette tidslinje-streg.
                absolute: placeret relativt til forælderelementet.
                left-2.25: placeret lidt fra venstre — justeret til at stå bag cirklerne.
                top-2 bottom-2: stregen starter og slutter lidt inde fra kanten.
                w-px: bredde på 1 pixel (en tynd linje).
                bg-(--color-brand): brandfarve. */}
            <div className="absolute left-2.25 top-2 bottom-2 w-px bg-(--color-brand)" />

            {/* Første punkt på tidslinjen: Doors Open */}
            <div className="flex items-start gap-4 pb-6">
              {/* Cirkel-dot på tidslinjen.
                  shrink-0: cirklen må aldrig krympe selv om pladsen er trang.
                  rounded-full: gør det til en cirkel (50% border-radius).
                  z-10: placeret ovenpå den lodrette streg. */}
              <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-(--color-brand) z-10" />
              <div>
                <p className="text-l font-semibold text-white">{doorsOpenTime}</p>
                <p className="text-l text-neutral-400 mt-0.5">Doors open</p>
              </div>
            </div>

            {/* Resten af schedule-punkterne — hentet fra event.schedule-arrayet */}
            {event.schedule.map((item, index) => (
              // last:pb-0 fjerner bunden padding på det SIDSTE element (Tailwind "last child"-modifier)
              <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                {/* Cirkel-dot for hvert schedule-punkt */}
                <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-(--color-brand) z-10" />
                <div>
                  {/* item.time er tidspunktet, item.label er beskrivelsen */}
                  <p className="text-l font-semibold text-white">{item.time}</p>
                  <p className="text-l text-neutral-400 mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* DETALJER-SEKTION — strækker sig over begge kolonner med col-span-full */}
        <div className="col-span-full mb-10">
          <h2 className="text-3xl mb-4">Details</h2>
          {/* Den fulde beskrivelse af eventet — leading-loose giver ekstra linjehøjde for læselighed */}
          <p className="leading-loose">{event.description}</p>
        </div>

        {/* KOMMENTARSEKTION — strækker sig også over begge kolonner */}
        <div className="col-span-full">
          {/* Gengiver Comments-komponenten der viser kommentarliste og -formular */}
          <Commments />
        </div>

      </div>
    </>
  );
}
```

---

## BtnNormal.jsx

```jsx
// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Nødvendigt fordi Framer Motion-animationer kræver en browser.
"use client";

// Henter Link fra Next.js — bruges når knappen skal navigere til en ny side.
import Link from "next/link";

// Henter motion fra Framer Motion — bruges til hover-animationerne på knappens streger.
import { motion } from "framer-motion";

// BtnNormal er en knap-komponent der bruges på tværs af hele projektet.
// Den modtager fire valgfrie props:
//   href      — URL-stien knappen skal linke til (bruges når det er et navigationslink)
//   title     — teksten der vises på knappen
//   className — ekstra CSS-klasser udefra (f.eks. til placering). "" er default-værdi: ingen ekstra klasser.
//   onClick   — en funktion der køres ved klik (bruges i stedet for href når vi ikke navigerer)
export default function BtnNormal({ href, title, className = "", onClick }) {
  return (
    // motion.div er den ydre animerede container for hele knappen.
    // inline-flex: knappen fylder kun den plads den har brug for (ikke hele linjen).
    // relative: nødvendigt for at de absolutte steg-elementer indeni positioneres rigtigt.
    // px-4 py-2: indre luft (padding) vandret og lodret.
    // ${className}: tilføjer eventuelle ekstra klasser der sendes udefra.
    // initial="rest": start i "rest"-tilstanden (normal, ikke hover).
    // whileHover="hover": skift til "hover"-tilstanden når musen er over elementet.
    // animate="rest": sørger for at det animerer tilbage til "rest" når musen forlader.
    <motion.div
      className={`relative inline-flex px-4 py-2 ${className}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >

      {/* motion.span indeholder selve knapteksten og animerer dens farve ved hover.
          relative z-10 placerer teksten ovenpå de dekorative streganimationer bagved. */}
      <motion.span
        className="relative z-10"
        variants={{
          // I "rest"-tilstand: teksten har den normale tekstfarve (CSS custom property).
          // var(--color-text) er en CSS-variabel defineret andetsteds i projektet.
          rest: { color: "var(--color-text)" },
          // I "hover"-tilstand: teksten skifter til brandfarven (guld/accent).
          hover: { color: "var(--color-brand)" },
        }}
        // Farveændringen tager 0.25 sekunder.
        transition={{ duration: 0.25 }}
      >
        {/* Ternær operator: if onClick eksisterer → vis en <button>, ellers → vis et <Link>.
            Det gør at samme komponent kan bruges både som navigationslink og som klikknap. */}
        {onClick ? (
          // Hvis onClick er givet: render en knap der kalder onClick-funktionen ved klik.
          // type="button" forhindrer knappen i at opføre sig som submit i formularer.
          <button type="button" onClick={onClick} className="cursor-pointer">{title}</button>
        ) : (
          // Ellers: render et Next.js Link der navigerer til href.
          <Link href={href}>{title}</Link>
        )}
      </motion.span>

      {/* STATISK STREG ØVERST — hvid linje der altid vises (ikke animeret).
          absolute top-0 left-0: placeret i toppen af knap-containeren.
          w-full: strækker sig over hele knappens bredde.
          h-0.5: meget tynd højde (ser ud som en linje).
          bg-white: hvid farve. */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-white" />

      {/* STATISK STREG NEDERST — hvid linje der altid vises (ikke animeret).
          Samme som ovenfor, men placeret i bunden med bottom-0. */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />

      {/* ANIMERET BRANDFARVET STREG ØVERST — glider ind fra højre ved hover.
          absolute top-0 left-0: placeret oven på den hvide streg.
          h-0.5: samme tynde højde som den hvide streg.
          bg-(--color-brand): brandfarve (guld/accent) — dækker den hvide streg.
          origin-right: skaleringsorigin er højre kant — animationen starter fra højre og glider til venstre.
          scaleX er en CSS-transformation der skalerer elementet vandret.
          scaleX: 0 = usynlig (sammenklappet) | scaleX: 1 = fuld bredde (synlig). */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-(--color-brand) origin-right"
        style={{ width: "100%" }}
        variants={{
          // Normal tilstand: stregen er sammenklappet (usynlig)
          rest: { scaleX: 0 },
          // Hover tilstand: stregen udvider sig til fuld bredde
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* ANIMERET BRANDFARVET STREG NEDERST — glider ind fra venstre ved hover.
          origin-left: skaleringsorigin er venstre kant — animationen starter fra venstre.
          delay: 0.05 giver en lille forsinkelse i forhold til den øverste streg
          så de to streger animerer sig lidt forskudt — en subtil detalje. */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-(--color-brand) origin-left"
        style={{ width: "100%" }}
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      />

    </motion.div>
  );
}
```

---

## EventsCalender.jsx

```jsx
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
                order-1 på mobil: billedet vises først (øverst).
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
```

---

## DeleteButton.jsx

```jsx
// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Vi har brug for localStorage og events — det kræver en browser.
"use client";

// Henter to React-værktøjer:
//   useEffect — kører kode på bestemte tidspunkter (her: når komponenten vises)
//   useState  — gemmer og ændrer information (her: om brugeren ejer denne kommentar)
import { useEffect, useState } from "react";

// Henter useRouter fra Next.js — bruges til at genindlæse siden efter sletning.
import { useRouter } from "next/navigation";

// Henter deleteContactMessage fra vores API-bibliotek.
// Denne funktion sender en DELETE-anmodning til backend for at fjerne en besked.
import { deleteContactMessage } from "@/lib/api";

// getMyComments er en hjælpefunktion der henter brugerens egne kommentar-IDs fra localStorage.
// localStorage.getItem("myComments") henter den gemte JSON-tekst — eller null hvis intet er gemt.
// || "[]" er en fallback: giv en tom liste-streng hvis intet er gemt.
// JSON.parse(...) konverterer JSON-teksten til et rigtigt JavaScript-array, f.eks. [3, 7, 12].
const getMyComments = () => JSON.parse(localStorage.getItem("myComments") || "[]");

// AI hjalp med at vise delete-knappen kun på kommentarer man selv har oprettet,
// ved at tjekke localStorage mod kommentarens id.

// DeleteButton modtager ét prop: id — det unikke ID på den kommentar knappen tilhører.
// Komponenten viser KUN knappen hvis den aktuelle bruger er den der oprettede kommentaren.
const DeleteButton = ({ id }) => {

  // isOwn er en tilstand der starter som false (vi ved endnu ikke om brugeren ejer kommentaren).
  // setIsOwn bruges til at opdatere den.
  const [isOwn, setIsOwn] = useState(false);

  // router bruges til at genindlæse siden efter sletning.
  const router = useRouter();

  // useEffect kører kode efter komponenten er vist i browseren.
  // Vi tjekker localStorage her og ikke direkte i komponenten,
  // fordi localStorage ikke findes på serveren — kun i browseren.
  useEffect(() => {
    // getMyComments() henter arrayet af brugerens egne IDs fra localStorage.
    // .includes(id) tjekker om det aktuelle kommentar-ID er i listen.
    // Resultatet (true/false) gemmes i isOwn-tilstanden.
    setIsOwn(getMyComments().includes(id));
  // [id] betyder: kør effekten igen hvis id-prop'en ændrer sig.
  }, [id]);

  // Tidlig retur: hvis brugeren IKKE ejer denne kommentar, vis ingenting (null = intet HTML).
  // Det er det der gør at DELETE-knappen er usynlig for alle andre end ejeren.
  if (!isOwn) return null;

  // handleDelete kører når brugeren klikker DELETE.
  // async fordi vi bruger await til at vente på API-kaldet.
  const handleDelete = async () => {

    // Sender en sletningsanmodning til backend med kommentarens ID.
    // await venter på at sletningen er bekræftet af serveren.
    await deleteContactMessage(id);

    // Opdaterer brugerens localStorage-liste: fjerner det slettede ID.
    // getMyComments() henter den nuværende liste.
    // .filter((i) => i !== id) laver en ny liste UDEN det slettede ID.
    //   filter() løber igennem hvert element i og beholder kun dem der IKKE er lig id.
    // JSON.stringify(...) konverterer listen tilbage til JSON-tekst.
    // localStorage.setItem(...) gemmer den opdaterede liste.
    localStorage.setItem("myComments", JSON.stringify(getMyComments().filter((i) => i !== id)));

    // Genindlæser server-data så den slettede kommentar forsvinder fra listen.
    router.refresh();
  };

  return (
    // En simpel knap — kun synlig for ejeren (se "if (!isOwn) return null" ovenfor).
    //   mt-2              — lille luft over knappen
    //   text-xs uppercase — lille tekst med store bogstaver
    //   tracking-widest   — bogstaverne er spredt ud
    //   text-white/70     — hvid tekst med 70% gennemsigtighed (dæmpet)
    //   hover:text-(--color-brand) — ved hover: skift til brandfarven
    //   transition-colors — farveændringen sker blødt (med CSS transition)
    //   cursor-pointer    — viser en hånd-cursor ved hover
    <button
      onClick={handleDelete}
      className="mt-2 text-xs uppercase tracking-widest text-white/70 hover:text-(--color-brand) transition-colors cursor-pointer"
    >
      DELETE
    </button>
  );
};

// Gør DeleteButton tilgængeligt for andre filer — bruges af Comments.jsx.
export default DeleteButton;
```

---

## Comments.jsx

```jsx
// Henter CommentForm — formularen brugeren skriver en kommentar i (nederst på siden).
import CommentForm from "./CommentForm";

// Henter DeleteButton — en knap til at slette beskeder (kun vist for brugerens egne).
import DeleteButton from "./DeleteButton";

// Henter to API-funktioner fra vores eget bibliotek:
//   getComments        — henter kommentarer fra backend
//   getContactMessages — henter kontaktbeskeder fra backend
import { getComments, getContactMessages } from "@/lib/api";

// formatDate er en hjælpefunktion der konverterer en ISO-dato til en læsbar dansk dato.
// iso er en datostreng i formatet "2024-03-15T10:30:00Z" (standard maskinformat).
const formatDate = (iso) =>
  // new Date(iso) laver et JavaScript Date-objekt ud fra ISO-strengen.
  // .toLocaleDateString("da-DK", {...}) formaterer det til dansk, f.eks. "15. marts 2024".
  new Date(iso).toLocaleDateString("da-DK", {
    // day: "numeric" → vis dagen som et tal (f.eks. 15)
    day: "numeric",
    // month: "long" → vis måneden som fuldt navn (f.eks. "marts")
    month: "long",
    // year: "numeric" → vis årstallet som et tal (f.eks. 2024)
    year: "numeric",
  });

// AI hjalp med at kombinere kommentarer og beskeder til ét samlet feed med Promise.all

// Comments er en async server-komponent — den henter data fra serveren FØR siden vises.
// async tillader os at bruge await inde i funktionen.
const Comments = async () => {

  // Promise.all([...]) henter BEGGE datasæt SAMTIDIGT (parallelt) — hurtigere end én ad gangen.
  // await venter på at begge er færdige inden vi fortsætter.
  // Array destructuring [ , ] pakker resultatet ud: første svar → rawComments, andet → rawMessages.
  const [rawComments, rawMessages] = await Promise.all([getComments(), getContactMessages()]);

  // Bygger én kombineret og sorteret liste af alle kommentarer og beskeder.
  const comments = [
    // Spread-operatoren ... "hælder" alle elementer fra rawComments ind i den nye liste.
    // .map() løber igennem hvert element og laver en kopi med to ekstra egenskaber:
    //   ...c         — behold alle eksisterende data fra kommentaren
    //   _key         — et unikt ID vi bygger selv (bruges af React til at holde styr på elementer)
    //   deletable    — false = denne kommentar kan IKKE slettes (den tilhører ikke brugeren)
    ...rawComments.map((c) => ({ ...c, _key: `comment-${c.id}`, deletable: false })),

    // Samme for beskeder — men deletable: true, fordi kontaktbeskeder tilhører brugeren selv.
    ...rawMessages.map((m) => ({ ...m, _key: `message-${m.id}`, deletable: true })),

  // .sort() sorterer den samlede liste efter dato — ældste kommentarer øverst.
  // (a, b) => new Date(a.date) - new Date(b.date):
  //   Negativt tal → a er ældre → a kommer først
  //   Positivt tal → b er ældre → b kommer først
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    // <section> er et semantisk HTML-element der markerer en tematisk sektion af siden.
    <section>

      {/* Overskrift der viser det samlede antal kommentarer + beskeder */}
      <h2 className="mb-10 text-2xl">{comments.length} Comments</h2>

      {/* relative på denne div er nødvendigt for at fade-overlayets absolute-position virker */}
      <div className="relative">

        {/* Scrollbar liste over alle kommentarer.
            max-h-105 begrænser højden — overflow-y-scroll tilføjer en lodret scrollbar.
            flex flex-col gap-6 stiller elementerne lodret med mellemrum. */}
        <ul className="comments-scroll flex flex-col gap-6 list-none m-0 p-0 max-h-105 overflow-y-scroll pr-4">

          {/* .map() løber igennem hvert kommentar-objekt og laver et listeelement */}
          {comments.map((comment) => (

            // key giver hvert listeelement et unikt ID — React kræver dette i lister
            <li key={comment._key} className="pb-6">

              {/* Øverste række: navn, "posted" og dato ved siden af hinanden */}
              <div className="flex items-center gap-2 mb-2">

                {/* Afsenderens navn — uppercase og med bogstavmellemrum (tracking-widest) */}
                <span className="font-bold uppercase tracking-widest text-sm">{comment.name}</span>

                {/* Statisk tekst "posted" i brandfarven */}
                <span className="text-sm font-medium text-(--color-brand)">posted</span>

                {/* <time> er et semantisk HTML-element til datoer.
                    dateTime={comment.date} er den maskinlæsbare ISO-dato (til søgemaskiner og skærmlæsere).
                    Inde i tagget vises den menneskelæsbare version fra formatDate(). */}
                <time dateTime={comment.date} className="text-sm font-medium text-(--color-brand)">
                  {formatDate(comment.date)}
                </time>

                {/* Vis kun slette-knappen hvis comment.deletable er true.
                    && er "short-circuit": højre side vises kun hvis venstre side er sand.
                    ml-auto skubber knappen helt til højre. */}
                {comment.deletable && <div className="ml-auto"><DeleteButton id={comment.id} /></div>}

              </div>

              {/* Kommentarens tekst — hvid med 70% gennemsigtighed.
                  line-clamp-3 afskærer teksten efter 3 linjer og viser "..." */}
              <p className="text-white/70 text-sm leading-relaxed m-0 line-clamp-3">{comment.content}</p>

            </li>
          ))}
        </ul>

        {/* Fade-overlay i bunden af listen — et visuelt hint om at der er mere at scrolle.
            pointer-events-none betyder at man KAN klikke igennem den (den blokerer ikke interaktion).
            absolute bottom-0: placeret i bunden af forælderelementet.
            bg-linear-to-t from-black to-transparent: sort i bunden, gennemsigtig øverst → gradienteffekt. */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black to-transparent" />

        {/* Lille tekst under listen der opfordrer til at scrolle */}
        <p className="mt-2 text-xs text-white/30 uppercase tracking-widest text-center">scroll for more</p>

      </div>

      {/* Gengiver kommentarformularen nedenunder listen */}
      <CommentForm />

    </section>
  );
};

// Gør Comments tilgængeligt for andre filer.
export default Comments;
```

---

## CommentForm.jsx

```jsx
// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Vi bruger useState, events og localStorage — alt det kræver en browser.
"use client";

// Henter to React-værktøjer:
//   useRef   — giver direkte adgang til et HTML-element (her: <form>)
//   useState — lader os gemme og opdatere formulardata
import { useRef, useState } from "react";

// Henter useRouter fra Next.js — lader os styre navigation og genindlæse siden programmatisk.
import { useRouter } from "next/navigation";

// Henter vores custom knap-komponent BtnNormal.
import BtnNormal from "./BtnNormal";

// Henter postContactMessage fra vores API-bibliotek.
// Denne funktion sender formulardata til backend og gemmer det som en ny besked.
import { postContactMessage } from "@/lib/api";

// inputClass er en variabel der gemmer en lang CSS-klasse-streng.
// Vi bruger den på begge inputfelter for at undgå at gentage den lange streng to gange.
//   bg-transparent          — ingen baggrundfarve (gennemsigtig)
//   border border-white/30  — tynd hvid kant med 30% gennemsigtighed
//   px-4 py-3               — indre luft (padding) vandret og lodret
//   text-sm                 — lille skriftstørrelse
//   placeholder:text-white/40 — placeholder-teksten er hvid med 40% gennemsigtighed
//   focus:outline-none      — fjern browserens standard blå fokus-ring
//   focus:border-(--color-brand) — ved fokus: kant skifter til brandfarven
const inputClass = "flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand)";

// AI hjalp med at bruge router.refresh() til at genindlæse server-data efter submit og
// localStorage til at holde styr på hvilke kommentarer der tilhører brugeren.

// CommentForm er komponenten med hele formularen — navn, email, kommentar og send-knap.
const CommentForm = () => {

  // form er et objekt der indeholder de tre formularfelters værdier.
  // useState starter dem alle som tomme strenge "".
  // setForm er funktionen vi kalder for at opdatere dem.
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  // formRef er en direkte reference til <form>-HTML-elementet.
  // Vi bruger den til at kalde .requestSubmit() på formularen (se BtnNormal-knappen).
  const formRef = useRef(null);

  // router giver os adgang til Next.js routeren.
  // Vi bruger router.refresh() til at hente friske data fra serveren efter submit.
  const router = useRouter();

  // handleChange kører hver gang brugeren skriver i et inputfelt.
  // e er input-eventet som browseren sender automatisk.
  const handleChange = (e) => setForm({
    // ...form beholder alle eksisterende feltværdier (spread-operator).
    ...form,
    // [e.target.name] er "computed property name":
    //   e.target.name er inputfeltets name-attribut, f.eks. "name", "email" eller "content".
    //   Vi bruger det som nøgle i objektet, så kun det ene felt opdateres.
    // e.target.value er den tekst brugeren har skrevet i feltet.
    [e.target.name]: e.target.value
  });

  // handleSubmit kører når formularen sendes.
  // async fordi vi bruger await til at vente på API-kaldet.
  const handleSubmit = async (e) => {

    // e.preventDefault() forhindrer browserens standard formular-adfærd,
    // som ellers ville genindlæse hele siden ved submit.
    e.preventDefault();

    // Sender formulardataen til backend via postContactMessage.
    // ...form spreder alle tre felter (name, email, content) ind i objektet.
    // date: new Date().toISOString() tilføjer den aktuelle dato i ISO-format.
    // await venter på at API-kaldet er færdigt og gemmer svaret i res.
    const res = await postContactMessage({ ...form, date: new Date().toISOString() });

    // res er et HTTP-response-objekt. .json() læser kroppen og konverterer den
    // fra JSON-tekst til et JavaScript-objekt. await venter på det.
    const data = await res.json();

    // localStorage er browserens indbyggede nøgle-værdi-lager — gemmer data mellem sidebesøg.
    // localStorage.getItem("myComments") henter den gemte liste (som JSON-tekst) eller null.
    // || "[]" er en fallback: hvis intet er gemt, brug en tom liste-streng.
    // JSON.parse(...) konverterer JSON-teksten til et rigtigt JavaScript-array.
    const mine = JSON.parse(localStorage.getItem("myComments") || "[]");

    // Tilføjer den nye kommentars ID til brugerens liste og gemmer den opdaterede liste.
    // [...mine, data.id] laver et nyt array med alle tidligere IDs + det nye.
    // JSON.stringify(...) konverterer arrayet tilbage til JSON-tekst (localStorage gemmer kun tekst).
    localStorage.setItem("myComments", JSON.stringify([...mine, data.id]));

    // Nulstil formularen ved at sætte alle felter til tomme strenge igen.
    setForm({ name: "", email: "", content: "" });

    // router.refresh() beder Next.js om at genhente server-data og gengive siden.
    // Det gør at den nye kommentar dukker op i listen uden en fuld side-genindlæsning.
    router.refresh();
  };

  return (
    // <form> er HTML-formularelementet.
    // ref={formRef} tilknytter vores ref så vi kan tilgå elementet direkte.
    // onSubmit={handleSubmit} kører handleSubmit når formularen sendes.
    // mt-16 giver luft (margin-top) ovenfor formularen.
    <form ref={formRef} onSubmit={handleSubmit} className="mt-16">

      {/* Overskrift over formularen — uppercase og med bogstavmellemrum */}
      <h3 className="text-xl font-bold tracking-widest uppercase mb-6">Leave a Comment</h3>

      {/* Række med navn og email side om side.
          flex-col på mobil (lodret) → sm:flex-row på større skærme (vandret). */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">

        {/* Navnefelt */}
        <input
          // type="text" = almindeligt tekstfelt
          type="text"
          // name="name" bruges af handleChange til at vide hvilket felt der opdateres
          name="name"
          placeholder="Your Name"
          // value={form.name} gør feltet "kontrolleret" — React styrer hvad der vises
          value={form.name}
          // onChange={handleChange} kører ved hvert tastetryk
          onChange={handleChange}
          // required betyder at feltet SKAL udfyldes — browseren tjekker det ved submit
          required
          className={inputClass}
        />

        {/* Email-felt — type="email" giver browseren lov til at validere email-formatet */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Kommentarfelt — <textarea> er et stort fritekst-inputfelt (til modsætning fra <input>).
          rows={8} sætter starthøjden til 8 linjer.
          resize-y tillader kun lodret størrelsesjustering (brugeren kan trække det højere). */}
      <textarea
        name="content"
        placeholder="Your Comment"
        value={form.content}
        onChange={handleChange}
        required
        rows={8}
        className="w-full bg-transparent border border-white/30 px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-(--color-brand) resize-y mb-4"
      />

      {/* Højrestiller send-knappen med flex justify-end */}
      <div className="flex justify-end">
        {/* BtnNormal er vores custom knap-komponent.
            title="Submit" er teksten på knappen.
            onClick kalder formRef.current?.requestSubmit():
              formRef.current er <form>-elementet.
              requestSubmit() udløser formularens onSubmit-event (inkl. browser-validering).
              Det er bedre end at kalde handleSubmit direkte fordi det tjekker "required"-felterne. */}
        <BtnNormal title="Submit" onClick={() => formRef.current?.requestSubmit()} />
      </div>

    </form>
  );
};

// Gør CommentForm tilgængeligt for andre filer — bruges af Comments.jsx.
export default CommentForm;
```

---

## Gallery.jsx

```jsx
// Henter GalleryClient-komponenten fra samme mappe.
// GalleryClient håndterer al den interaktive logik (klik, swipe, modal).
// Vi deler det op i to filer fordi Gallery henter data fra serveren,
// mens GalleryClient kører i browseren og håndterer brugerinteraktion.
import GalleryClient from "./GalleryClient";

// Henter funktionen getGallery fra vores eget api-bibliotek.
// @/ er en genvej til projektets src-mappe (en "path alias").
// getGallery henter billeder fra vores backend/CMS (f.eks. Sanity eller et REST API).
import { getGallery } from "@/lib/api";

// Gallery er en "async" komponent — den kan hente data fra serveren FØR den vises.
// async betyder at funktionen kan bruge "await" og vente på at data er klar.
// Den kører KUN på serveren (ingen "use client" øverst).
const Gallery = async () => {

  // await stopper og venter på at getGallery() er færdig med at hente data fra API'et.
  // Resultatet (billedlisten) gemmes i variablen "data".
  const data = await getGallery();

  // Gengiver GalleryClient og sender billederne med som en prop kaldet "images".
  // data.data ?? data er en "nullish coalescing"-operator:
  //   Hvis data.data eksisterer (API'et returnerede { data: [...] }) → brug data.data
  //   Ellers (API'et returnerede listen direkte) → brug data som det er
  // Det håndterer to forskellige API-svarformater på én gang.
  return <GalleryClient images={data.data ?? data} />;
};

// Gør Gallery tilgængeligt for andre filer så de kan importere det.
export default Gallery;
```

---

## GalleryClient.jsx

```jsx
// Fortæller Next.js: kør denne fil i browseren, ikke på serveren.
// Nødvendigt fordi vi bruger useState og touch/klik-events.
"use client";

// Henter useState fra React — lader os gemme og ændre information.
import { useState } from "react";

// Henter Image fra Next.js — en optimeret billedkomponent der automatisk
// skalerer, komprimerer og lazy-loader billeder for bedre performance.
import Image from "next/image";

// Henter motion fra Framer Motion — bruges til flydende animationer.
import { motion } from "framer-motion";

// Henter imageUrl fra vores eget api-bibliotek.
// imageUrl er en hjælpefunktion der bygger den fulde URL til et billede
// ud fra den relative URL vi får fra API'et.
import { imageUrl } from "@/lib/api";

// GalleryClient er komponenten der viser billedgalleriet og håndterer:
//   - Klik på billede → åbner modal
//   - Pile-knapper → næste/forrige billede
//   - Swipe på touchskærm → næste/forrige billede
// images = [] er en default-værdi: hvis ingen billeder sendes med, bruges en tom liste.
const GalleryClient = ({ images = [] }) => {

  // currentIndex holder styr på HVILKET billede der er åbent i modalen.
  // null = ingen modal åben | et tal (f.eks. 2) = det 3. billede er åbent.
  const [currentIndex, setCurrentIndex] = useState(null);

  // touchStart gemmer X-positionen (vandret) hvor brugerens finger landede på skærmen.
  // Bruges til at beregne swipe-retningen bagefter.
  const [touchStart, setTouchStart] = useState(null);

  // touchEnd gemmer X-positionen hvor brugerens finger løftede sig fra skærmen.
  const [touchEnd, setTouchEnd] = useState(null);

  // selectedImage er det billede der skal vises i modalen.
  // Ternær operator: hvis currentIndex IKKE er null → hent billedet på den plads i arrayet.
  // Ellers → null (ingen modal vises).
  const selectedImage = currentIndex !== null ? images[currentIndex] : null;

  // Lukker modalen ved at sætte currentIndex tilbage til null.
  const closeModal = () => setCurrentIndex(null);

  // Går til næste billede i listen.
  // e er klik-eventet — stopPropagation() forhindrer klikket i at "boble op"
  // til forælderelementet (der ville lukke modalen hvis det nåede derop).
  const nextImage = (e) => {
    e.stopPropagation();
    // prev er den nuværende currentIndex-værdi.
    // Hvis vi IKKE er på det sidste billede (prev < images.length - 1) → gå én frem.
    // Ellers → bliv på det samme billede (ingen overflytning).
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  // Går til forrige billede i listen.
  const prevImage = (e) => {
    e.stopPropagation();
    // Hvis vi IKKE er på det første billede (prev > 0) → gå én tilbage.
    // Ellers → bliv på det samme billede.
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Minimum antal pixels en finger skal bevæge sig for at tælle som et swipe.
  // Forhindrer at et lille utilsigtet tap registreres som swipe.
  const minSwipeDistance = 50;

  // Kører når fingeren rører skærmen.
  // Nulstiller touchEnd (fra evt. forrige swipe) og gemmer startpositionen.
  const onTouchStart = (e) => {
    setTouchEnd(null);
    // e.targetTouches[0] er den første finger der rører skærmen.
    // .clientX er dens vandrette position i pixels fra venstre side af vinduet.
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Kører løbende mens fingeren glider hen over skærmen.
  // Opdaterer touchEnd med den aktuelle fingerposition.
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  // Kører når fingeren løftes fra skærmen — her afgøres swipe-retningen.
  const onTouchEnd = () => {
    // Hvis vi ikke har en start- eller slutposition, kan vi ikke beregne noget — stop.
    if (!touchStart || !touchEnd) return;

    // Beregner den vandrette afstand fingeren har bevæget sig.
    // Positivt tal = fingeren gik til VENSTRE | Negativt tal = fingeren gik til HØJRE.
    const distance = touchStart - touchEnd;

    // Swipe til venstre: distance er større end minSwipeDistance (finger gik venstrepå).
    const isLeftSwipe = distance > minSwipeDistance;
    // Swipe til højre: distance er mere negativ end -minSwipeDistance (finger gik højrepå).
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe til venstre → vis næste billede.
    // Vi sender et falsk event-objekt med en tom stopPropagation-funktion
    // fordi nextImage forventer at e.stopPropagation() kan kaldes.
    if (isLeftSwipe) {
      nextImage({ stopPropagation: () => {} });
    }
    // Swipe til højre → vis forrige billede.
    if (isRightSwipe) {
      prevImage({ stopPropagation: () => {} });
    }
  };

  return (
    // React Fragment — samler flere elementer uden ekstra HTML
    <>

      {/* BILLEDGITTER — viser op til 7 billeder i et responsivt grid */}
      {/* motion.div gør at vi kan animere grid-containeren hvis ønsket */}
      <motion.div className="grid grid-cols-1 md:grid-cols-12 gap-0">

        {/* .slice(0, 7) viser kun de første 7 billeder (index 0–6) */}
        {/* .map() løber igennem hvert billede og laver et element for det */}
        {images.slice(0, 7).map((image, index) => (

          <motion.div
            // key giver hvert element et unikt ID — React kræver dette i lister
            key={image.id}
            className={`relative overflow-hidden image-corners ${
              // De første 4 billeder (index 0-3) fylder 3 kolonner ud af 12.
              // De sidste 3 billeder (index 4-6) fylder 4 kolonner — lidt bredere.
              // På mobil (col-span-3/4 uden md:) fylder alle billeder hele bredden.
              index < 4 ? "col-span-3 md:col-span-3" : "col-span-4 md:col-span-4"
            }`}
            // initial: billedet starter som usynligt (opacity: 0) og 100px til venstre (x: -100)
            initial={{ opacity: 0, x: -100 }}
            // whileInView: når billedet ruller ind i skærmen, animer det til synligt og på plads
            whileInView={{ opacity: 1, x: 0 }}
            // once: false = animer igen hver gang billedet ruller ind i syne (ikke kun første gang)
            viewport={{ once: false }}
            transition={{
              // Animationen tager 0.4 sekunder
              duration: 0.4,
              // Hvert billede starter lidt senere end det forrige → kaskade-effekt
              delay: index * 0.07,
              // Easing-kurve: [x1, y1, x2, y2] definerer en cubic-bezier kurve.
              // Denne starter hurtigt og sænker farten mod slutningen.
              ease: [0.12, 0, 0.39, 0],
            }}
            // Når billedet klikkes: åbn modalen med dette billedes index
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              // imageUrl() bygger den fulde URL ud fra den relative URL fra API'et
              src={imageUrl(image.asset.url)}
              // alt-tekst beskriver billedet for skærmlæsere og ved fejl
              alt={image.asset.alt}
              // width og height hjælper Next.js med at reservere plads til billedet
              width={800}
              height={800}
              // w-full h-full: fylder forælderelementet helt ud
              // object-cover: billedet beskæres og fylder pladsen uden at blive skævt
              // cursor-pointer: viser en hånd-cursor ved hover
              className="w-full h-full object-cover block cursor-pointer"
            />
          </motion.div>

        ))}
      </motion.div>

      {/* MODAL — vises kun når selectedImage ikke er null (et billede er klikket) */}
      {/* && er "short-circuit evaluation": venstre side skal være truthy for at højre side vises */}
      {selectedImage && (

        // Mørkt overlay der dækker hele siden.
        // fixed inset-0: dækker hele skærmen fra hjørne til hjørne.
        // bg-black/70: sort baggrund med 70% gennemsigtighed.
        // z-50: vises ovenpå alt andet indhold.
        // Klik på overlayets baggrund → luk modalen.
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeModal}
          // Touch-events på overlayets baggrund er også aktive for swipe
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          {/* Inderste container med billedet og pile-knapperne.
              e.stopPropagation() forhindrer klik inde i boksen i at lukke modalen */}
          <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>

            {/* VENSTRE PIL — kun synlig på desktop (hidden md:block) */}
            <button
              onClick={prevImage}
              className="hidden md:block absolute -left-4 md:-left-20 text-white text-2xl md:text-xl border py-1 px-3 md:py-0 md:px-2 bg-black/50 md:bg-transparent"
            >
              {/* ‹ er HTML-entiteten for det franske venstre guillemet-tegn (‹) */}
              ‹
            </button>

            {/* Billedboks med sort baggrund */}
            <div className="bg-black w-fit mx-auto">
              <Image
                src={imageUrl(selectedImage.asset.url)}
                alt={selectedImage.asset.alt}
                // Bruger billedets faktiske bredde og højde fra API-data
                width={selectedImage.asset.width}
                height={selectedImage.asset.height}
                // max-h-[85vh]: billedet må max fylde 85% af skærmens højde
                // w-auto: bredden tilpasser sig automatisk så billedet ikke strækkes
                // object-contain: hele billedet vises uden beskæring
                className="max-h-[85vh] w-auto object-contain"
              />

              {/* Tekstinfo under det åbne billede */}
              <div className="max-w-120">
                {/* Viser billedets beskrivelse fra API'et */}
                <h3 className="text-white px-6 py-2 text-xl">{selectedImage.description}</h3>
                {/* Placeholder-tekst (Lorem ipsum) — ikke rigtig indhold endnu */}
                <p className="text-white px-6 py-2 text-sm leading-loose">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum, quisquam nam quis
                  aperiam nisi dolor beatae incidunt animi, sed eveniet, eligendi quos neque harum
                  laborum?
                </p>
              </div>
            </div>

            {/* HØJRE PIL — kun synlig på desktop */}
            <button
              onClick={nextImage}
              className="hidden md:block absolute -right-4 md:-right-20 text-white text-2xl md:text-xl border py-1 px-3 md:py-0 md:px-2 bg-black/50 md:bg-transparent"
            >
              {/* › er HTML-entiteten for det franske højre guillemet-tegn (›) */}
              ›
            </button>

          </div>
        </div>
      )}

    </>
  );
};

// Gør GalleryClient tilgængeligt for andre filer — bruges af Gallery.jsx
export default GalleryClient;
```

---

## Header.jsx

```jsx
// Fortæller Next.js: kør denne fil i browseren (på klientens computer), IKKE på serveren.
// Uden dette ville Next.js prøve at køre filen på serveren, og ting som musklik ville ikke virke.
"use client";

// Henter Link fra Next.js.
// Link fungerer som et normalt <a>-link men er smartere: skifter side uden at genindlæse browseren.
import Link from "next/link";

// Henter usePathname fra Next.js navigation.
// Det er et værktøj der fortæller os hvilken URL vi er på, f.eks. "/events".
// Krølparenteserne {} bruges til at hente et bestemt navngivet element fra pakken.
import { usePathname } from "next/navigation";

// Henter tre React-værktøjer på én gang:
//   useState  — lader os gemme og ændre information (f.eks. "er menuen åben?")
//   useRef    — giver os direkte adgang til et rigtigt HTML-element i browseren
//   useEffect — lader os køre kode på bestemte tidspunkter (f.eks. når siden loader)
import { useState, useRef, useEffect } from "react";

// Henter "motion" fra animationsbiblioteket Framer Motion.
// motion lader os tilføje flydende animationer til HTML-elementer.
import { motion } from "framer-motion";

// En fast talværdi: animationens varighed i sekunder (0.25s per bogstav).
// "const" = konstant, kan ikke ændres bagefter.
// Vi bruger et navn i stedet for at skrive 0.25 mange steder — så er det let at ændre ét sted.
const DURATION = 0.25;

// En fast talværdi: forsinkelsen mellem hvert bogstavs animation.
// Bogstav 0 starter straks, bogstav 1 venter 0.025s, bogstav 2 venter 0.05s osv. → bølgeeffekt.
const STAGGER = 0.025;

// Opretter en liste (array) kaldet "links" med alle navigationspunkter.
// En liste i JavaScript skrives med kantede parenteser [].
const links = [
  // Hvert punkt er et objekt {} med to egenskaber:
  //   label — den tekst brugeren ser
  //   href  — den URL-sti linket fører til
  { label: "HOME",       href: "/" },
  { label: "EVENTS",     href: "/events" },
  { label: "BOOK TABLE", href: "/BookTable" },
  { label: "CONTACT US", href: "/contact" },
// ] lukker listen, ; afslutter sætningen
];

// AI hjalp med at lave bogstav-for-bogstav flip-animationen med framer-motion.

// FlipLink er en genanvendelig komponent der viser et link med flip-animation per bogstav.
// Den modtager tre props (oplysninger udefra):
//   children — teksten inde i den (f.eks. "HOME")
//   href     — URL-stien den skal linke til
//   isActive — true/false: om dette er den aktuelle side
// Krølparenteserne ved parametrene kallas "destructuring" — pakker tre værdier ud fra ét objekt.
const FlipLink = ({ children, href, isActive }) => {

  // return() starter hvad komponenten viser på skærmen.
  // Parentesen ( giver lov til at skrive HTML over flere linjer.
  return (

    // Link navigerer til href uden fuld side-genindlæsning.
    <Link href={href}>

      {/* motion.span er et animeret tekstcontainer-element.
          initial="initial"    — start i normal tilstand
          whileHover="hovered" — skift til hover-tilstand når musen er over det
          overflow-hidden er vigtigt: gemmer bogstaverne når de glider ud over kanten.
          isActive bestemmer farven: brandfarve hvis aktiv, ellers normal tekstfarve. */}
      <motion.span
        initial="initial"
        whileHover="hovered"
        className={`relative block overflow-hidden whitespace-nowrap cursor-pointer ${
          isActive ? "text-(--color-brand)" : "text-(--color-text)"
        }`}
        // lineHeight 1 fjerner ekstra luft over/under — nødvendigt for at flip-effekten passer
        style={{ lineHeight: 1 }}
      >

        {/* ØVERSTE LAG: den tekst du normalt ser — glider OP og forsvinder ved hover */}
        <div>
          {/* children er teksten (f.eks. "HOME").
              .split("") deler den op i bogstaver: ["H","O","M","E"].
              .map() løber igennem hvert bogstav og laver et element for det.
              l = det aktuelle bogstav | i = dets position (0, 1, 2...) */}
          {children.split("").map((l, i) => (

            // motion.span er et animeret element for ét enkelt bogstav
            <motion.span
              // key giver hvert bogstav et unikt ID — React kræver dette for at holde styr på dem
              key={i}
              // inline-block gør bogstavet animerbart (rene inline-elementer kan ikke flyttes)
              className="inline-block"
              variants={{
                // Normal tilstand: bogstavet sidder på plads (y: 0 = ingen lodret flytning)
                initial: { y: 0 },
                // Hover: bogstavet glider OP sin egen højde og forsvinder ud over kanten
                hovered: { y: "-100%" },
              }}
              transition={{
                // Animationen tager 0.25 sekunder
                duration: DURATION,
                // Starter langsomt → accelererer → sænker farten — naturlig fornemmelse
                ease: "easeInOut",
                // Hvert bogstav starter lidt senere end det forrige → bølgeeffekt
                delay: STAGGER * i,
              }}
            >
              {/* Viser selve bogstavet på skærmen */}
              {l}
            </motion.span>

          ))}
        </div>

        {/* BUNDLAG: brandfarvet kopi af teksten — skjult nedenunder, glider OP ved hover.
            absolute + inset-0 placerer denne div præcis oven på det øverste lag. */}
        <div className="absolute inset-0 text-(--color-brand)">
          {children.split("").map((l, i) => (

            <motion.span
              key={i}
              className="inline-block"
              variants={{
                // Normal tilstand: bogstavet er skjult NEDENUNDER (100% nede = usynligt)
                initial: { y: "100%" },
                // Hover: glider op til sin normale position og bliver synligt
                hovered: { y: 0 },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                // Samme forsinkelse som øverste lag — de to lag bevæger sig synkront
                delay: STAGGER * i,
              }}
            >
              {l}
            </motion.span>

          ))}
        </div>

      </motion.span>
    </Link>
  );
};

// AI hjalp med at implementere burger-menuen ved hjælp af den native Popover API.

// BurgerMenu er komponenten for hamburger-ikonet og mobilnavigationspanelet.
const BurgerMenu = () => {

  // Henter den aktuelle URL-sti (f.eks. "/events")
  const pathname = usePathname();

  // Ref til mobilmenu-elementet — giver direkte adgang til showPopover()/hidePopover().
  // Starter som null (intet endnu) og sættes til elementet når det vises på siden.
  const popoverRef = useRef(null);

  // isOpen holder styr på om menuen er åben (true) eller lukket (false).
  // setIsOpen er funktionen vi kalder for at ændre værdien.
  // useState(false) = start som lukket.
  const [isOpen, setIsOpen] = useState(false);

  // openMenu kører når hamburger-knappen klikkes
  const openMenu = () => {
    // ?. = "optional chaining": kør kun hvis popoverRef.current ikke er null
    // showPopover() er en browser-indbygget funktion der viser popover-elementet
    popoverRef.current?.showPopover();
    // Opdater React-tilstanden så komponenten gengives med isOpen = true
    setIsOpen(true);
  };

  // closeMenu kører når menuen skal lukkes
  const closeMenu = () => {
    // try/catch: forsøg at køre koden, og hvis den fejler — ignorer fejlen
    try {
      // hidePopover() skjuler elementet — kan kaste en fejl hvis popoveret ikke er åbent
      popoverRef.current?.hidePopover();
    } catch {}
    // Sæt isOpen til false uanset om hidePopover() fejlede eller ej
    setIsOpen(false);
  };

  // Kører én gang når komponenten vises første gang.
  // [] = tomt array = kør kun denne effekt én gang.
  useEffect(() => {
    // Sætter HTML-attributten "popover=auto" på menuelementet.
    // "auto" fortæller browseren: luk automatisk ved klik udenfor.
    popoverRef.current?.setAttribute("popover", "auto");
  }, []);

  // Synkroniserer isOpen-tilstanden med browserens native toggle-event på popoveret.
  useEffect(() => {
    const popover = popoverRef.current;
    // Forlad effekten tidligt hvis elementet ikke eksisterer endnu
    if (!popover) return;
    // handleToggle kører når popoveret åbner/lukker.
    // e.newState er "open" eller "closed" — vi gemmer true/false i isOpen.
    const handleToggle = (e) => setIsOpen(e.newState === "open");
    // Tilknyt lytteren til popoveret
    popover.addEventListener("toggle", handleToggle);
    // Cleanup: fjern lytteren når komponenten fjernes fra siden (forhindrer hukommelseslækager)
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  // Lukker menuen automatisk hver gang URL-stien ændrer sig.
  // [pathname] = kør effekten igen når pathname skifter.
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    // <> </> er et React Fragment — en usynlig wrapper der samler to elementer uden ekstra HTML
    <>

      {/* Hamburger-knappen — tre vandrette streger der danner ☰-ikonet */}
      <button
        onClick={openMenu}
        className="burger-btn"
        // aria-label forklarer knappens funktion til skærmlæsere (ingen synlig tekst på knappen)
        aria-label="Open navigation menu"
        // Fortæller skærmlæsere om menuen er åben eller lukket
        aria-expanded={isOpen}
        // Linker knappen til det element den styrer
        aria-controls="mobile-menu"
      >
        {/* Tre spans = tre linjer i ☰-ikonet.
            CSS tilføjer "is-open" klassen og animerer dem til et X når menuen er åben. */}
        <span className={`burger-line burger-line--1${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--2${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--3${isOpen ? " is-open" : ""}`} />
      </button>

      {/* Mobilmenu-panelet — vises som et native browser-popover */}
      <div
        id="mobile-menu"
        // ref tilknytter popoverRef til dette element
        ref={popoverRef}
        popover="auto"
        className="mobile-nav"
        // Tilgængeligheds-attributter til skærmlæsere
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >

        {/* Øverste sektion: logo og luk-knap */}
        <div className="mobile-nav__topbar">
          <div className="mobile-nav__logo">
            <p>
              {/* "CLUB" er i et span så CSS kan give det en anden farve */}
              NIGHT<span>CLUB</span>
            </p>
            <span>HAVE A GOOD TIME</span>
          </div>
          <button
            onClick={closeMenu}
            className="mobile-nav__close"
            aria-label="Close navigation menu"
          >
            {/* aria-hidden skjuler ✕ fra skærmlæsere — aria-label beskriver det allerede */}
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* <nav> fortæller browsere semantisk: her er navigationlinks */}
        <nav>
          <ul className="mobile-nav__links">
            {/* Løber igennem links-arrayet og laver et listeelement for hvert punkt */}
            {links.map((link, i) => {
              // true hvis dette links href matcher den aktuelle URL
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className="mobile-nav__item"
                  // --i er en CSS custom property med indeksnummeret — bruges til animationsforsinkelse
                  style={{ "--i": i }}
                >
                  <Link
                    href={link.href}
                    // Tilføjer "--active" klassen hvis dette er den aktuelle side
                    className={`mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`}
                    // Luk menuen når brugeren klikker et link
                    onClick={closeMenu}
                  >
                    {/* Viser link-teksten, f.eks. "HOME" */}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bunden af mobilmenuen */}
        <div className="mobile-nav__footer">
          <span>EST. 2024</span>
        </div>

      </div>
    </>
  );
};

// Header er den primære komponent — den store navigationslinje øverst på alle sider.
const Header = () => {

  // Henter den aktuelle URL-sti
  const pathname = usePathname();

  // Tilstand til den animerede understregning under navigationslinkene.
  //   left  = afstand fra venstre kant af listen (i pixels)
  //   width = bredde af understregningen (i pixels)
  // Starter med { left: 0, width: 0 } — ingen synlig understregning.
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Finder indeksnummeret for det aktive link.
  // findIndex() returnerer indekset for det første element der opfylder betingelsen.
  // Returnerer -1 hvis ingen link matcher den aktuelle URL.
  const activeIndex = links.findIndex((l) => l.href === pathname);

  // moveUnderline kører når musen bevæger sig ind over et navigationspunkt.
  // e er mouse-eventet som browseren automatisk sender med.
  const moveUnderline = (e) => {
    // getBoundingClientRect() returnerer elementets position og størrelse relativt til viewport
    const rect = e.currentTarget.getBoundingClientRect();
    // Vi henter også forælderens position for at beregne en relativ (ikke viewport) position
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    setUnderline({
      // Trækker forælderens venstre offset fra → relativ position inden i listen
      left: rect.left - parentRect.left,
      // Understregningens bredde matcher det hoverede links bredde præcist
      width: rect.width,
    });
  };

  // resetUnderline kører når musen forlader et navigationspunkt.
  // Sætter understregningen tilbage under det aktive link.
  const resetUnderline = () => {
    // Søger i siden efter elementet med data-index lig med activeIndex
    const activeEl = document.querySelector(`[data-index="${activeIndex}"]`);
    // Kør kun hvis vi er på en af de listede sider (activeEl er null hvis ingen match)
    if (activeEl) {
      const rect = activeEl.getBoundingClientRect();
      const parentRect = activeEl.parentElement.getBoundingClientRect();
      setUnderline({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  };

  return (
    // <header> er et semantisk HTML-element der fortæller browsere: dette er sidens header.
    // sticky top-0  — klistrer til toppen af skærmen når man scroller
    // z-50          — vises ovenpå alle andre elementer (stablingsorden 50)
    // bg-black      — sort baggrund
    // flex          — børneelementer arrangeres i en vandret række (flexbox)
    // justify-between / md:justify-around — afstandsfordeling på mobil vs. desktop
    // items-center  — centrerer børnene lodret
    // border-b border-t — streger øverst og nederst i brandfarven
    // py-6 px-6     — luft (padding) inden i headeren
    // md:px-0       — ingen vandret padding på desktop
    // overflow-hidden — gemmer indhold der stikker udenfor (f.eks. hjørnedekorationer)
    // header-corners  — custom CSS-klasse, tilføjer sandsynligvis dekorative hjørner
    <header className="sticky top-0 z-50 bg-black flex justify-between md:justify-around items-center border-b border-t border-(--color-brand) py-6 px-6 md:px-0 overflow-hidden header-corners">

      {/* Logo-området */}
      <div>
        {/* text-3xl = stor skrift | font-bold = fed */}
        <p className="text-(--color-text) text-3xl font-bold">
          {/* "CLUB" i et span så CSS kan give det brandfarven */}
          NIGHT<span className="text-(--color-brand)">CLUB</span>
        </p>
        {/* tracking-[4px] spreder bogstaverne ud med 4px mellemrum — stilfuldt look */}
        <span className="text-(--color-text) text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>

      {/* Desktop-navigation.
          hidden    — usynlig på mobil
          md:block  — synlig på medium+ skærme */}
      <nav className="hidden md:block">
        {/* relative på ul er nødvendigt: understregningen positionerer sig relativt til denne liste */}
        <ul className="relative flex gap-10 font-bold text-xl pb-2">

          {/* Løber igennem links og laver et listeelement for hvert navigationspunkt */}
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                // data-index gemmer indekset som HTML-attribut — bruges af resetUnderline()
                data-index={i}
                // Flyt understregningen hertil når musen kommer ind
                onMouseEnter={moveUnderline}
                // Sæt understregningen tilbage til det aktive link når musen forlader
                onMouseLeave={resetUnderline}
              >
                <FlipLink href={link.href} isActive={isActive}>
                  {link.label}
                </FlipLink>
              </li>
            );
          })}

          {/* Den animerede understregningslinje.
              animate={{ left, width }} — Framer Motion animerer disse værdier når de ændrer sig.
              type:"spring" — bevæger sig som en fysisk fjeder (organisk, ikke lineær).
              stiffness: 400 — høj = hurtig og snappy fjeder.
              damping: 35    — høj = lidt bounce, stopper hurtigt. */}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-(--color-brand)"
            animate={{
              left: underline.left,
              width: underline.width,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />

        </ul>
      </nav>

      {/* Burger-menu — kun synlig på mobil.
          md:hidden = skjult på medium+ skærme (desktop bruger den normale nav ovenfor) */}
      <div className="md:hidden">
        <BurgerMenu />
      </div>

    </header>
  );
};

// export default gør Header tilgængeligt for andre filer.
// Andre filer kan nu skrive: import Header from "./Header"
export default Header;
```
