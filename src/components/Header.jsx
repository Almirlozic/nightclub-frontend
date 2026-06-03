// Fortæller Next.js: kør denne fil i browseren, ikke på serveren
"use client";

// Henter Link fra Next.js — fungerer som <a>, men skifter side uden at genindlæse siden
import Link from "next/link";
// Henter usePathname — et værktøj der fortæller os hvilken URL vi er på (f.eks. "/events")
import { usePathname } from "next/navigation";
// Henter tre React-værktøjer:
//   useState  — gemmer og ændrer information (f.eks. "er menuen åben?")
//   useRef    — giver direkte adgang til et HTML-element i browseren
//   useEffect — kører kode på bestemte tidspunkter (f.eks. når siden loader)
import { useState, useRef, useEffect } from "react";
// Henter motion fra Framer Motion — bruges til at lave flydende animationer
import { motion } from "framer-motion";

// Varighed af hvert bogstavs flip-animation i sekunder
const DURATION = 0.25;
// Forsinkelse mellem hvert bogstavs animation — skaber en bølgeeffekt
const STAGGER = 0.025;

// Liste over alle navigationspunkter i headeren
// Hvert objekt har: label (synlig tekst) og href (URL-stien den fører til)
const links = [
  { label: "HOME",       href: "/" },
  { label: "EVENTS",     href: "/events" },
  { label: "BOOK TABLE", href: "/BookTable" },
  { label: "CONTACT US", href: "/contact" },
];

// AI hjalp med at lave bogstav-for-bogstav flip-animationen med framer-motion
// FlipLink er en komponent der viser et navigationlink med flip-animation per bogstav
// Den modtager: children (linkteksten), href (destination), isActive (om vi er på den side)
const FlipLink = ({ children, href, isActive }) => {
  return (
    // Link er en Next.js-komponent der navigerer til href uden fuld side-genindlæsning
    <Link href={href}>
      {/* motion.span er et animeret tekstcontainer-element
          initial="initial" — start i normal tilstand
          whileHover="hovered" — skift til hover-tilstand når musen er over det
          overflow-hidden er vigtigt: gemmer bogstaverne når de glider ud over kanten */}
      <motion.span
        initial="initial"
        whileHover="hovered"
        className={`relative block overflow-hidden whitespace-nowrap cursor-pointer ${
          // Hvis dette er den aktive side, brug brandfarven — ellers normal tekstfarve
          isActive ? "text-(--color-brand)" : "text-(--color-text)"
        }`}
        // lineHeight 1 fjerner ekstra luft over/under teksten — nødvendigt for flip-effekten
        style={{ lineHeight: 1 }}
      >
        {/* Øverste lag: den synlige tekst i normal tilstand — glider OP væk ved hover */}
        <div>
          {/* split("") deler teksten op i bogstaver, map() laver et element per bogstav */}
          {children.split("").map((l, i) => (
            <motion.span
              // key giver hvert bogstav et unikt ID så React kan holde styr på dem
              key={i}
              // inline-block gør bogstavet animerbart (rene inline-elementer kan ikke flyttes)
              className="inline-block"
              variants={{
                // Normal tilstand: bogstavet sidder på sin plads (y: 0 = ingen lodret flytning)
                initial: { y: 0 },
                // Hover: bogstavet glider OP og ud af syne (-100% = sin egen højde opad)
                hovered: { y: "-100%" },
              }}
              transition={{
                // Animationen tager 0.25 sekunder
                duration: DURATION,
                // Starter langsomt, accelererer, sænker farten igen — naturlig fornemmelse
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

        {/* Bundlag: brandfarvet kopi af teksten — skjult nedenunder, glider OP ved hover
            absolute + inset-0 placerer den præcis oven på det øverste lag */}
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
                // Samme forsinkelse som øverste lag — de bevæger sig synkront
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

// AI hjalp med at implementere burger-menuen ved hjælp af den native Popover API
// BurgerMenu viser hamburger-ikonet på mobil og det tilhørende navigationspanel
const BurgerMenu = () => {
  // Henter den aktuelle URL-sti så vi ved hvilken side vi er på
  const pathname = usePathname();
  // Ref til mobilmenu-elementet — giver os direkte adgang til at åbne/lukke det
  const popoverRef = useRef(null);
  // Tilstand der holder styr på om menuen er åben (true) eller lukket (false)
  const [isOpen, setIsOpen] = useState(false);

  // Åbner menuen: viser popover-panelet og opdaterer isOpen-tilstanden
  const openMenu = () => {
    // ?. er "optional chaining" — kør kun hvis popoverRef.current ikke er null
    popoverRef.current?.showPopover();
    setIsOpen(true);
  };

  // Lukker menuen: skjuler popover-panelet og sætter isOpen til false
  const closeMenu = () => {
    try {
      // Forsøger at skjule popoveret — kan kaste en fejl hvis det ikke er åbent
      popoverRef.current?.hidePopover();
    } catch {}
    // {} efter catch = ignorer fejlen stille — vi sætter isOpen til false uanset hvad
    setIsOpen(false);
  };

  // Kører én gang når komponenten vises: sætter "popover=auto" på elementet
  // "auto" fortæller browseren: luk popoveret automatisk ved klik udenfor
  useEffect(() => {
    popoverRef.current?.setAttribute("popover", "auto");
  }, []);

  // Lytter til browserens toggle-event på popoveret og synkroniserer isOpen-tilstanden
  useEffect(() => {
    const popover = popoverRef.current;
    // Forlad effekten tidligt hvis elementet ikke eksisterer endnu
    if (!popover) return;
    // e.newState er "open" eller "closed" — vi gemmer true/false i isOpen
    const handleToggle = (e) => setIsOpen(e.newState === "open");
    popover.addEventListener("toggle", handleToggle);
    // Cleanup-funktion: fjerner lytteren når komponenten fjernes fra siden
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  // Lukker automatisk menuen hver gang URL-stien ændrer sig (brugeren navigerer)
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    // React Fragment <> </> — usynlig wrapper der samler to elementer uden ekstra HTML
    <>
      {/* Hamburger-knappen — tre vandrette streger der danner ☰-ikonet */}
      <button
        onClick={openMenu}
        className="burger-btn"
        // aria-label forklarer knappens funktion til skærmlæsere (den har ingen synlig tekst)
        aria-label="Open navigation menu"
        // Fortæller skærmlæsere om menuen er åben eller lukket
        aria-expanded={isOpen}
        // Linker knappen til det element den styrer
        aria-controls="mobile-menu"
      >
        {/* Tre spans = tre linjer i hamburger-ikonet
            "is-open" klassen tilføjes når menuen er åben — CSS animerer dem til et X */}
        <span className={`burger-line burger-line--1${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--2${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--3${isOpen ? " is-open" : ""}`} />
      </button>

      {/* Mobilmenu-panelet — vises som et native browser-popover */}
      <div
        id="mobile-menu"
        // Tilknytter popoverRef så vi kan kalde showPopover()/hidePopover() på dette element
        ref={popoverRef}
        popover="auto"
        className="mobile-nav"
        // Semantiske tilgængeligheds-attributter til skærmlæsere
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* Øverste del af mobilmenuen: logo og luk-knap */}
        <div className="mobile-nav__topbar">
          <div className="mobile-nav__logo">
            <p>
              {/* "CLUB" er i et span så CSS kan give det brandfarven */}
              NIGHT<span>CLUB</span>
            </p>
            <span>HAVE A GOOD TIME</span>
          </div>
          <button
            onClick={closeMenu}
            className="mobile-nav__close"
            aria-label="Close navigation menu"
          >
            {/* aria-hidden skjuler X-tegnet fra skærmlæsere — aria-label beskriver det allerede */}
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* <nav> fortæller browsere og skærmlæsere semantisk: her er navigationlinks */}
        <nav>
          <ul className="mobile-nav__links">
            {/* Løber igennem links-arrayet og laver et listeelement for hvert navigationspunkt */}
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
                    // Luk menuen når brugeren klikker på et link
                    onClick={closeMenu}
                  >
                    {/* Viser link-teksten, f.eks. "HOME" eller "EVENTS" */}
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

// Den primære Header-komponent — den store navigationslinje øverst på alle sider
const Header = () => {
  // Henter den aktuelle URL-sti
  const pathname = usePathname();
  // Tilstand til den animerede understregning: left = afstand fra venstre, width = bredde
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Finder indekset på det aktive link (f.eks. 1 hvis vi er på "/events")
  // findIndex returnerer -1 hvis ingen link matcher den aktuelle sti
  const activeIndex = links.findIndex((l) => l.href === pathname);

  // Kaldes når musen bevæger sig ind over et navigationspunkt
  // Flytter understregningen til at ligge under det hoverede link
  const moveUnderline = (e) => {
    // getBoundingClientRect() returnerer elementets position og størrelse relativt til viewport
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    setUnderline({
      // Trækker forælderens offset fra for at få en relativ (ikke viewport) position
      left: rect.left - parentRect.left,
      // Understregningens bredde matcher præcis det hoverede links bredde
      width: rect.width,
    });
  };

  // Kaldes når musen forlader et navigationspunkt
  // Sætter understregningen tilbage under det aktive link
  const resetUnderline = () => {
    // Søger i siden efter et element med data-index lig med activeIndex
    const activeEl = document.querySelector(`[data-index="${activeIndex}"]`);
    // Kør kun hvis vi er på en side der er i links-listen
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
    // <header> er et semantisk HTML-element — fortæller browsere at dette er sidens header
    // sticky top-0: klistrer til toppen af skærmen når man scroller
    // z-50: vises ovenpå andre elementer
    // hidden md:block skjuler/viser elementer baseret på skærmstørrelse (responsive design)
    <header className="sticky top-0 z-50 bg-black flex justify-between md:justify-around items-center border-b border-t border-(--color-brand) py-6 px-6 md:px-0 overflow-hidden header-corners">

      {/* Logo-området: "NIGHT" i normal farve, "CLUB" i brandfarven */}
      <div>
        <p className="text-(--color-text) text-3xl font-bold">
          NIGHT<span className="text-(--color-brand)">CLUB</span>
        </p>
        {/* tracking-[4px] spreder bogstaverne ud for et stilfuldt look */}
        <span className="text-(--color-text) text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>

      {/* Desktop-navigation — hidden på mobil, synlig på medium+ skærme */}
      <nav className="hidden md:block">
        {/* relative på ul er nødvendigt for at understregningen kan positioneres relativt til listen */}
        <ul className="relative flex gap-10 font-bold text-xl pb-2">
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                // data-index bruges af resetUnderline() til at finde dette element via querySelector
                data-index={i}
                onMouseEnter={moveUnderline}
                onMouseLeave={resetUnderline}
              >
                <FlipLink href={link.href} isActive={isActive}>
                  {link.label}
                </FlipLink>
              </li>
            );
          })}

          {/* Den animerede understregningslinje — bevæger sig som en fjeder til det hoverede/aktive link
              type:"spring" giver en fysisk, organisk fjeder-bevægelse
              stiffness og damping styrer fjedrens snappiness og bounce */}
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

      {/* Burger-menu — kun synlig på mobil (md:hidden skjuler den på større skærme) */}
      <div className="md:hidden">
        <BurgerMenu />
      </div>
    </header>
  );
};

// Gør Header tilgængeligt for andre filer — de kan importere den med: import Header from "./Header"
export default Header;
