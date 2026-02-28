"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  cta?: { label: string; href: string };
  badge?: string;
  promo?: string;
  note?: string;
}

export default function PricingCard({
  title,
  subtitle,
  price,
  period,
  features,
  featured = false,
  cta = { label: "Get Started", href: "/contact" },
  badge,
  promo,
  note,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col rounded-2xl p-8 transition-all ${
        featured
          ? "pricing-card-featured shadow-2xl shadow-royal/20"
          : "glass-card"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-royal to-teal px-4 py-1 text-xs font-bold text-white shadow-lg">
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className={`text-xl font-bold ${featured ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {title}
        </h3>
        <p className={`text-sm mt-1 ${featured ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
          {subtitle}
        </p>
      </div>

      <div className="mb-1">
        <span className={`text-sm font-medium ${featured ? "text-slate-300" : "text-slate-500"}`}>RM</span>{" "}
        <span className={`text-4xl font-black ${featured ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {price}
        </span>{" "}
        <span className={`text-sm ${featured ? "text-slate-500" : "text-slate-400"}`}>{period}</span>
      </div>

      {note && <p className={`text-xs mb-4 ${featured ? "text-slate-500" : "text-slate-400"}`}>{note}</p>}

      {promo && (
        <div className="promo-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>card_giftcard</span>
          {promo}
        </div>
      )}

      <ul className="mb-8 flex-grow space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`material-symbols-outlined mt-0.5 ${featured ? "text-teal" : "text-teal"}`} style={{ fontSize: 18 }}>
              {featured ? "verified" : "check_circle"}
            </span>
            <span className={`text-sm leading-snug ${featured ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={cta.href}
        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
          featured
            ? "bg-royal text-white shadow-lg shadow-royal/30 hover:bg-royal-dark"
            : "border border-slate-200 text-slate-700 hover:border-royal hover:text-royal dark:border-slate-700 dark:text-slate-300 dark:hover:border-royal dark:hover:text-royal"
        }`}
      >
        {cta.label}
      </Link>
    </motion.div>
  );
}
