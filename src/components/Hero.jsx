"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BtnNormal from "./BtnNormal";

const BACKGROUNDS = [
  "/assets/bg/header_bg_1.jpg",
  "/assets/bg/header_bg_2.jpg",
]

export default function Hero() {
  const [bg] = useState(() => BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)])

  return (
    <section className="relative w-full h-screen flex flex-col">
      <Image
        src={bg}
        alt="Nightclub hero background"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">

        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
        >
          <Image
            src="/assets/icon/Logo.svg"
            alt="Night Club"
            width={400}
            height={120}
            className="w-[clamp(200px,40vw,500px)] h-auto"
          />
        </motion.div>

        <motion.p
          className="text-white tracking-[0.4em] uppercase text-sm"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        >
          HAVE A GOOD TIME
        </motion.p>

        <motion.div
          className="flex gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <BtnNormal href="/events" title="VIEW EVENTS" className="text-sm font-bold tracking-widest" />
          <motion.div
            className="flex items-center"
            initial={{ backgroundPosition: "0% 50%" }}
            whileHover={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(to right, var(--color-brand), oklch(45% 0.22 300), var(--color-brand))",
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 50%",
            }}
          >
            <Link
              href="/BookTable"
              className="flex items-center px-6 py-2 text-sm font-bold tracking-widest text-white uppercase"
            >
              BOOK TABLE
            </Link>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
