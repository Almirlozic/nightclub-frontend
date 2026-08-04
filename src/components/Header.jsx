"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

const links = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "BOOK TABLE", href: "/BookTable" },
  { label: "CONTACT US", href: "/contact" },
];

const LetterColumn = ({ letters, from, to, className = "" }) => (
  <span className={`block ${className}`}>
    {letters.map((letter, i) => (
      <motion.span
        key={i}
        className="inline-block"
        variants={{ initial: { y: from }, hovered: { y: to } }}
        transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
      >
        {letter}
      </motion.span>
    ))}
  </span>
);

// AI har hjulpet med at implementere flip-animationen
const FlipLink = ({ children, href, isActive }) => {
  const letters = children.split("");

  return (
    <Link href={href}>
      <motion.span
        initial="initial"
        whileHover="hovered"
        style={{ lineHeight: 1 }}
        className={`relative block overflow-hidden whitespace-nowrap cursor-pointer ${
          isActive ? "text-(--color-brand)" : "text-(--color-text)"
        }`}
      >
        <LetterColumn letters={letters} from={0} to="-100%" />
        <LetterColumn
          letters={letters}
          from="100%"
          to={0}
          className="absolute inset-0 text-(--color-brand)"
        />
      </motion.span>
    </Link>
  );
};

// AI har hjulpet med at implementere burgermenuen med Popover API'et
const BurgerMenu = () => {
  const pathname = usePathname();
  const popoverRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const popover = popoverRef.current;
    const handleToggle = (e) => setIsOpen(e.newState === "open");
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  useEffect(() => {
    popoverRef.current?.hidePopover();
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => popoverRef.current?.showPopover()}
        className="burger-btn"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className={`burger-line burger-line--1${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--2${isOpen ? " is-open" : ""}`} />
        <span className={`burger-line burger-line--3${isOpen ? " is-open" : ""}`} />
      </button>

      <div
        id="mobile-menu"
        ref={popoverRef}
        popover="auto"
        className="mobile-nav"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        <div className="mobile-nav__topbar">
          <div className="mobile-nav__logo">
            <p>
              NIGHT<span>CLUB</span>
            </p>
            <span>HAVE A GOOD TIME</span>
          </div>
          <button
            onClick={() => popoverRef.current?.hidePopover()}
            className="mobile-nav__close"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav>
          <ul className="mobile-nav__links">
            {links.map((link, i) => (
              <li key={link.href} className="mobile-nav__item" style={{ "--i": i }}>
                <Link
                  href={link.href}
                  className={`mobile-nav__link${pathname === link.href ? " mobile-nav__link--active" : ""}`}
                  onClick={() => popoverRef.current?.hidePopover()}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mobile-nav__footer">
          <span>EST. 2024</span>
        </div>
      </div>
    </>
  );
};

const rectFor = (el) => {
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentElement.getBoundingClientRect();
  return { left: rect.left - parentRect.left, width: rect.width };
};

// AI har hjulpet med at implementere den animerede streg under aktive/hoverede links
const Header = () => {
  const pathname = usePathname();
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const activeIndex = links.findIndex((l) => l.href === pathname);

  const moveUnderline = (e) => setUnderline(rectFor(e.currentTarget));

  const resetUnderline = () => {
    const activeEl = document.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) setUnderline(rectFor(activeEl));
  };

  return (
    <header className="sticky top-0 z-50 bg-black flex justify-between md:justify-around items-center border-b border-t border-(--color-brand) py-6 px-6 md:px-0 overflow-hidden header-corners">
      <div>
        <p className="text-(--color-text) text-3xl font-bold">
          NIGHT<span className="text-(--color-brand)">CLUB</span>
        </p>
        <span className="text-(--color-text) text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>

      <nav className="hidden md:block">
        <ul className="relative flex gap-10 font-bold text-xl pb-2">
          {links.map((link, i) => (
            <li key={link.href} data-index={i} onMouseEnter={moveUnderline} onMouseLeave={resetUnderline}>
              <FlipLink href={link.href} isActive={i === activeIndex}>
                {link.label}
              </FlipLink>
            </li>
          ))}

          <motion.div
            className="absolute bottom-0 h-0.5 bg-(--color-brand)"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        </ul>
      </nav>

      <div className="md:hidden">
        <BurgerMenu />
      </div>
    </header>
  );
};

export default Header;
