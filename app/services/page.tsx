"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const steps = [
  { num: "1", title: "Discovery & Strategy", desc: "We learn your business, target audience, and goals. This includes competitor analysis and a content strategy session." },
  { num: "2", title: "Design & Prototyping", desc: "We create wireframes and visual mockups for your review. You get 2 rounds of design revisions." },
  { num: "3", title: "Development & Testing", desc: "Clean code, responsive design, speed optimization, and thorough cross-browser/device testing." },
  { num: "4", title: "Launch & Support", desc: "We handle deployment, DNS setup, and SSL. Then provide 3 months of free support." },
];

const singleFeatures = [
  "Google Maps integration with business profile",
  "WhatsApp direct routing button",
  "Mobile responsive design (all devices)",
  "Contact form with email notification",
  "Basic SEO setup & meta optimization",
  "SSL certificate & domain pointing",
];

const multiFeatures = [
  "Home, About, Services, Contact, Gallery (up to 5 pages)",
  "CMS-ready structure for easy content management",
  "Advanced SEO optimization & content strategy",
  "Google Maps & WhatsApp integration",
  "Basic performance optimization & analytics",
  "100% custom design — no templates",
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="What We Build"
        headline="Web Solutions That Drive Revenue"
        gradientWord="Drive Revenue"
        subtext="From high-converting landing pages to comprehensive multi-page platforms — every pixel is engineered for Malaysian business growth."
      />

      {/* Single Page Service */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal">
                <span className="h-2 w-2 rounded-full bg-teal" /> Service 01
              </span>
              <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
                Single Page <span className="gradient-text">Website</span>
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Perfect for startups, freelancers, and clinics that need a fast, high-converting online presence.
              </p>
              <ul className="mt-6 space-y-3">
                {singleFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-teal" style={{ fontSize: 18 }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-6">
                <span className="text-2xl font-black"><span className="gradient-text">From RM 2,500</span></span>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-royal px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-royal/25 hover:bg-royal-dark transition-all">View Pricing</Link>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-white/[0.06]">
              <div className="aspect-[4/3] bg-gradient-to-br from-royal/10 to-teal/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-royal/30">web</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Multi-Page Service */}
      <section className="bg-slate-50 py-20 dark:bg-midnight-light">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp} className="order-2 lg:order-2">
              <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal">
                <span className="h-2 w-2 rounded-full bg-teal" /> Service 02
              </span>
              <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
                Multi-Page <span className="gradient-text">Enterprise</span>
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Comprehensive web solutions for growing businesses. Up to 5 fully custom pages with CMS integration.
              </p>
              <ul className="mt-6 space-y-3">
                {multiFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-teal" style={{ fontSize: 18 }}>verified</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-6">
                <span className="text-2xl font-black"><span className="gradient-text">From RM 4,800</span></span>
                <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-royal px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-royal/25 hover:bg-royal-dark transition-all">View Pricing</Link>
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="order-1 overflow-hidden rounded-2xl border border-slate-200 shadow-xl dark:border-white/[0.06]">
              <div className="aspect-[4/3] bg-gradient-to-br from-teal/10 to-gold/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-teal/30">devices</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <span className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal">
              <span className="h-2 w-2 rounded-full bg-teal" /> How We Work
            </span>
            <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              Our Proven <span className="gradient-text">Process</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
              From discovery to launch, we follow a structured methodology that ensures predictable timelines and premium results.
            </p>
          </motion.div>
          <div className="mx-auto max-w-xl">
            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="process-step">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-royal to-teal text-sm font-black text-white shadow-lg">
                  {s.num}
                </div>
                <div>
                  <h4 className="mb-1 font-heading text-lg font-bold text-slate-900 dark:text-white">{s.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Let's Build Something Amazing"
        gradientWord="Amazing"
        subtext="Tell us about your project and we'll get back to you with a detailed proposal within 24 hours."
        primaryCta={{ label: "Start Your Project", href: "/contact" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
        showScarcity={false}
      />
    </>
  );
}
