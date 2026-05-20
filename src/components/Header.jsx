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

const FlipLink = ({ children, href, isActive }) => {
  return (
    <Link href={href}>
      <motion.span
        initial="initial"
        whileHover="hovered"
        className={`relative block overflow-hidden whitespace-nowrap cursor-pointer ${
          isActive ? "text-(--color-brand)" : "text-(--color-text)"
        }`}
        style={{ lineHeight: 1 }}
      >
        <div>
          {children.split("").map((l, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
            >
              {l}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0 text-(--color-brand)">
          {children.split("").map((l, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
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

const BurgerMenu = () => {
  const pathname = usePathname();
  const popoverRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => {
    popoverRef.current?.showPopover();
    setIsOpen(true);
  };

  const closeMenu = () => {
    try {
      popoverRef.current?.hidePopover();
    } catch {}
    setIsOpen(false);
  };

  useEffect(() => {
    popoverRef.current?.setAttribute("popover", "auto");
  }, []);

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    const handleToggle = (e) => setIsOpen(e.newState === "open");
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  return (
    <>
      <button
        onClick={openMenu}
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
            onClick={closeMenu}
            className="mobile-nav__close"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <nav>
          <ul className="mobile-nav__links">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="mobile-nav__item" style={{ "--i": i }}>
                  <Link
                    href={link.href}
                    className={`mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mobile-nav__footer">
          <span>EST. 2024</span>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const pathname = usePathname();
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const activeIndex = links.findIndex((l) => l.href === pathname);

  const moveUnderline = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
    setUnderline({
      left: rect.left - parentRect.left,
      width: rect.width,
    });
  };

  const resetUnderline = () => {
    const activeEl = document.querySelector(`[data-index="${activeIndex}"]`);
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
    <header className="sticky top-0 z-50 bg-black flex justify-between md:justify-around items-center border-b border-t border-(--color-brand) py-6 px-6 md:px-0 overflow-hidden header-corners">
      <div>
        <p className="text-(--color-text) text-3xl font-bold">
          NIGHT<span className="text-(--color-brand)">CLUB</span>
        </p>
        <span className="text-(--color-text) text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>
      <nav className="hidden md:block">
        <ul className="relative flex gap-10 font-bold text-xl pb-2">
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
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
      <div className="md:hidden">
        <BurgerMenu />
      </div>
    </header>
  );
};

export default Header;
