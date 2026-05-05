"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const DURATION = 0.25;
const STAGGER = 0.025;

const links = [
  { label: "HOME", href: "/" },
  { label: "EVENTS", href: "/events" },
  { label: "BOOK TABLE", href: "/book" },
  { label: "CONTACT US", href: "/contact" },
];

const FlipLink = ({ children, href, isActive }) => {
  return (
    <Link href={href}>
      <motion.span
        initial="initial"
        whileHover="hovered"
        className={`relative block overflow-hidden whitespace-nowrap cursor-pointer ${
          isActive ? "text-[var(--color-brand)]" : "text-[var(--color-text)]"
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
        <div className="absolute inset-0 text-[var(--color-brand)]">
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

const Header = () => {
  const pathname = usePathname();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const activeIndex = links.findIndex((l) => l.href === pathname);
  const currentIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  const moveUnderline = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

    setUnderline({
      left: rect.left - parentRect.left,
      width: rect.width,
    });
  };

  const resetUnderline = () => {
    setHoverIndex(null);

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
    <header className="relative flex justify-around items-center border-b border-t border-[var(--color-brand)] py-6 overflow-hidden header-corners">
      <div>
        <p className="text-[var(--color-text)] text-3xl font-bold">
          NIGHT<span className="text-[var(--color-brand)]">CLUB</span>
        </p>
        <span className="text-[var(--color-text)] text-xs tracking-[4px]">HAVE A GOOD TIME</span>
      </div>
      <nav>
        <ul className="relative flex gap-10 font-bold text-xl pb-2">
          {links.map((link, i) => {
            const isActive = pathname === link.href;

            return (
              <li
                key={link.href}
                data-index={i}
                onMouseEnter={(e) => {
                  setHoverIndex(i);
                  moveUnderline(e);
                }}
                onMouseLeave={resetUnderline}
              >
                <FlipLink href={link.href} isActive={isActive}>
                  {link.label}
                </FlipLink>
              </li>
            );
          })}
          <motion.div
            className="absolute bottom-0 h-[2px] bg-[var(--color-brand)]"
            animate={{
              left: underline.left,
              width: underline.width,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
