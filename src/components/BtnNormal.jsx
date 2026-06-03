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
