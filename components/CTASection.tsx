"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CTASectionProps {
  headline: string;
  gradientWord: string;
  subtext: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showScarcity?: boolean;
}

export default function CTASection({
  headline,
  gradientWord,
  subtext,
  primaryCta = { label: "Book a Consultation", href: "/contact" },
  secondaryCta = { label: "View Portfolio", href: "/portfolio" },
  showScarcity = true,
}: CTASectionProps) {
  const parts = headline.split(gradientWord);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight via-slate-900 to-midnight-light p-12 text-center shadow-2xl sm:p-16"
        >
          {/* Decorative */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(37,99,235,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(20,184,166,0.1),transparent_50%)]" />

          <div className="relative z-10">
            {showScarcity && (
              <div className="scarcity-badge mx-auto mb-6 w-fit">
                <span className="relative h-2.5 w-2.5">
                  <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-40" />
                  <span className="relative block h-2.5 w-2.5 rounded-full bg-gold" />
                </span>
                Limited to 4 Clients per Month
              </div>
            )}

            <h2 className="font-heading text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              {parts[0]}
              <span className="gradient-text">{gradientWord}</span>
              {parts[1] || ""}
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              {subtext}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl bg-royal px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-royal/30 transition-all hover:bg-royal-dark hover:shadow-xl"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
