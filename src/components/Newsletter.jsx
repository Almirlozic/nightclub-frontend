"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BtnNormal from "./BtnNormal";
import { postNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await postNewsletter(email);
      if (res.status === 409) {
        setError("This email is already subscribed.");
        return;
      }
      if (!res.ok) throw new Error("Subscription failed");
      setEmail("");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 px-4 flex flex-col items-center text-center bg-black">
      <h2 className="uppercase tracking-widest text-white font-bold text-2xl mb-4">
        Want the latest Night Club News
      </h2>
      <p className="text-white mb-10">
        Subscribe to our newsletter and never miss an{" "}
        <span style={{ color: "var(--color-brand)" }}>Event</span>
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl">
        <div className="flex-1 w-full border-b border-white">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            placeholder="Enter Your Email"
            className="w-full bg-transparent text-white placeholder-white/50 py-2 outline-none"
          />
        </div>
        <BtnNormal title={loading ? "SUBSCRIBING..." : "SUBSCRIBE"} onClick={handleSubscribe} disabled={loading} />
      </div>

      {error && (
        <p className="mt-4 text-sm" style={{ color: "var(--color-brand)" }}>
          {error}
        </p>
      )}

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-8 py-4 tracking-widest uppercase text-sm font-semibold shadow-lg"
          >
            You&apos;re signed up! Welcome to the list.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
