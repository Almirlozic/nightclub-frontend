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
