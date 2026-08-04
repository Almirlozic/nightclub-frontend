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

// Henter Comments-komponenten.
import Comments from "@/components/Comments";

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
          <Comments eventId={event.id} />
        </div>

      </div>
    </>
  );
}
