"use client";

import Link from "next/link";

import { motion } from "framer-motion";

export default function BtnNormal({ href, title, className = "", onClick }) {
  return (
    <motion.div
      className={`relative inline-flex px-4 py-2 ${className}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <motion.span
        className="relative z-10"
        variants={{
          rest: { color: "var(--color-text)" },
          hover: { color: "var(--color-brand)" },
        }}
        transition={{ duration: 0.25 }}
      >
        {onClick ? (
          <button type="button" onClick={onClick} className="cursor-pointer">
            {title}
          </button>
        ) : (
          <Link href={href}>{title}</Link>
        )}
      </motion.span>

      <div className="absolute top-0 left-0 w-full h-0.5 bg-white" />

      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />

      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-(--color-brand) origin-right"
        style={{ width: "100%" }}
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

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
