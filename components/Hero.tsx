"use client";

import { motion } from "framer-motion";

interface HeroProps {
  eyebrow: string;
  headline: string;
  gradientWord: string;
  subtext: string | React.ReactNode;
  children?: React.ReactNode;
  center?: boolean;
}

export default function Hero({
  eyebrow,
  headline,
  gradientWord,
  subtext,
  children,
  center = true,
}: HeroProps) {
  const parts = headline.split(gradientWord);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-white pb-12 pt-16 dark:from-midnight dark:to-midnight-light">
      <div className={`mx-auto max-w-7xl px-6 ${center ? "text-center" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal ${center ? "mx-auto" : ""}`}
        >
          <span className="h-2 w-2 rounded-full bg-teal" />
          {eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`font-heading text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white ${center ? "mx-auto max-w-4xl" : "max-w-3xl"}`}
        >
          {parts[0]}
          <span className="gradient-text">{gradientWord}</span>
          {parts[1] || ""}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400 ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`}
        >
          {subtext}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
