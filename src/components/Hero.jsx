"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BtnNormal from "./BtnNormal";
import H2Normal from "./H2Normal";

const rollIn = (delay = 0) => ({
  initial: { rotateX: -90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
})

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      <Image
        src="/assets/bg/header_bg_1.jpg"
        alt="Nightclub hero background"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 flex flex-col items-center gap-6 text-center px-4"
        style={{ perspective: "900px" }}
      >
        <motion.div
          className="flex flex-col items-center"
          style={{ transformOrigin: "top center" }}
          {...rollIn(0)}
        >
          <Image
            src="/assets/icon/Logo.svg"
            alt="Night Club"
            width={400}
            height={120}
            className="w-[clamp(200px,40vw,500px)] h-auto"
          />
        </motion.div>

        <motion.div
          style={{ transformOrigin: "top center" }}
          {...rollIn(0.2)}
        >
          <H2Normal title="Have a good time" />
        </motion.div>

        <motion.div
          className="flex gap-4 mt-2"
          style={{ transformOrigin: "top center" }}
          {...rollIn(0.4)}
        >
          <BtnNormal href="/events" title="VIEW EVENTS" className="text-sm font-bold tracking-widest" />
          <motion.div
            className="flex items-center"
            style={{
              background: "linear-gradient(to right, #e91e8c, #9b27af, #e91e8c)",
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 50%",
            }}
            whileHover={{ backgroundPosition: "100% 50%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
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
