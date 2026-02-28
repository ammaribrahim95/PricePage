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

const services = [
  { icon: "web", title: "Single Page Websites", desc: "High-converting landing pages with WhatsApp integration, contact forms, and local SEO.", price: "From RM 2,500" },
  { icon: "devices", title: "Multi-Page Platforms", desc: "Comprehensive 5-page websites with CMS-ready architecture and advanced SEO.", price: "From RM 4,800" },
  { icon: "search", title: "Local SEO Strategy", desc: "Google Business setup, on-page optimization, and content strategy for local visibility.", price: "Included" },
  { icon: "build", title: "Ongoing Maintenance", desc: "Security patches, performance monitoring, content updates, and priority bug fixes.", price: "From RM 200/mo" },
];

const features = [
  { icon: "speed", title: "3s Load Time", desc: "Optimized for Malaysian networks (Maxis, TM, Celcom)." },
  { icon: "smartphone", title: "Mobile First", desc: "80%+ of local traffic is mobile. We ensure flawless UX." },
  { icon: "support_agent", title: "Local Support", desc: "Same timezone, same culture. We speak your language." },
  { icon: "trending_up", title: "Scalable Tech", desc: "Modern stacks that grow as your business grows." },
];

const testimonials = [
  { text: "Pawstrophe Digital transformed our online presence. Our enquiries increased by 300% in the first month.", author: "Sarah Lee", role: "Owner, Glow Aesthetics KL" },
  { text: "Professional, fast, and they truly understand the local market. Best investment for our workshop.", author: "Rizal Hakim", role: "Founder, Workshop Pro Penang" },
  { text: "Their maintenance plan saved us countless headaches. 98% uptime since day one.", author: "Ahmad Razali", role: "MD, KL Retail Hub" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Next-Gen Web Engineering"
        headline="Scale Your Malaysian Business with Premium Web Solutions"
        gradientWord="Malaysian Business"
        subtext="We engineer high-performance websites for Malaysian SMEs that convert visitors into customers. From RM 2,500."
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-royal px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-royal/30 transition-all hover:bg-royal-dark hover:shadow-xl">
            Book Free Strategy Session
          </Link>
          <Link href="/portfolio" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-7 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-royal hover:text-royal dark:border-slate-700 dark:text-slate-300">
            View Portfolio
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "3s", label: "Avg Load Time" },
            { value: "24h", label: "Response Time" },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: 0.3 + i * 0.1 }} className="text-center">
              <p className="font-heading text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Hero>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              What We <span className="gradient-text">Build</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
              End-to-end web solutions engineered for Malaysian business growth.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card p-6">
                <span className="material-symbols-outlined mb-4 text-3xl text-royal">{s.icon}</span>
                <h3 className="mb-2 font-heading text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
                <p className="text-sm font-bold text-royal">{s.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-20 dark:bg-midnight-light">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              Why Local SMEs <span className="gradient-text">Choose Us</span>
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                <span className="material-symbols-outlined mb-3 text-3xl text-teal">{f.icon}</span>
                <h4 className="mb-2 font-heading font-bold text-slate-900 dark:text-white">{f.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
              Trusted by <span className="gradient-text">Local Businesses</span>
            </h2>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }} className="glass-card p-8">
                <p className="mb-6 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">&ldquo;{t.text}&rdquo;</p>
                <p className="font-heading font-bold text-slate-900 dark:text-white">{t.author}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        headline="Ready to dominate the digital landscape?"
        gradientWord="digital landscape?"
        subtext="Get a free consultation and project roadmap within 24 hours. We currently have 2 slots remaining this month."
        primaryCta={{ label: "Book Free Strategy Session", href: "/contact" }}
        secondaryCta={{ label: "View Portfolio", href: "/portfolio" }}
      />
    </>
  );
}
