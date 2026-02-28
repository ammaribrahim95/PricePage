"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import PricingCard from "@/components/PricingCard";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const pricingFAQ = [
  { question: "Does the price include Domain and Hosting?", answer: "No, we separate development from hosting to give you 100% ownership. We can recommend and set up local providers like Exabytes or Shinjiru, usually costing RM 300–500 annually for domain and hosting." },
  { question: "How do the maintenance costs work?", answer: "Maintenance covers core updates, security patches, and monthly backups. RM 200 is for Starter sites, while RM 350 covers Growth sites with CMS and frequent traffic monitoring needs." },
  { question: "Can I upgrade from Starter to Growth later?", answer: "Absolutely. We build our Starter sites on the same clean foundations as our Growth sites, making scalability seamless when you're ready to expand. The upgrade cost will be adjusted accordingly." },
  { question: "What does the RM 900/man-day rate cover?", answer: "The man-day rate applies to change requests and additional features outside the original scope of work. This covers design changes, new page additions, API integrations, or any structural modifications." },
];

export default function PricingPage() {
  const [plan, setPlan] = useState<"onetime" | "subscription">("onetime");

  return (
    <>
      <Hero
        eyebrow="Localized Digital Growth"
        headline="Simple, Transparent Pricing for Local Growth"
        gradientWord="Local Growth"
        subtext="Tailored web solutions for Malaysian SMEs to scale effectively. No hidden fees, just pure performance and local expertise."
      />

      <section className="py-6">
        <div className="mx-auto max-w-7xl px-6">
          {/* Toggle */}
          <motion.div {...fadeUp} className="mx-auto mb-4 flex w-fit rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setPlan("onetime")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${plan === "onetime" ? "bg-white text-royal shadow-md dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              One-Time Project
            </button>
            <button
              onClick={() => setPlan("subscription")}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${plan === "subscription" ? "bg-white text-royal shadow-md dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly Subscription
            </button>
          </motion.div>

          <p className="mb-10 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
            All pricing in MYR. Excludes domain, hosting & third-party API costs.
          </p>

          {/* One-Time Cards */}
          {plan === "onetime" && (
            <div className="grid gap-6 lg:grid-cols-3" style={{ alignItems: "stretch" }}>
              <PricingCard
                title="Starter"
                subtitle="Single page landing page for rapid conversion."
                price="2,500"
                period="/one-time"
                promo="FREE 3 MONTHS SUPPORT"
                features={["WhatsApp Integration", "Google Maps & Business Setup", "Mobile Responsive Design", "Contact Form", "Basic Local SEO Optimization", "SSL & Domain Pointing"]}
              />
              <PricingCard
                title="Growth"
                subtitle="Full multi-page experience for scaling brands."
                price="4,800"
                period="/one-time"
                featured
                badge="✦ Best Value"
                promo="FREE 3 MONTHS SUPPORT"
                features={["Up to 5 Pages (Home, About, Services, Contact, Gallery)", "CMS-Ready Structure", "Advanced SEO Optimization", "High Performance & Page Speed", "WhatsApp & Google Maps Integration", "Custom Design (No Templates)", "Priority Technical Support"]}
                cta={{ label: "Choose Growth", href: "/contact" }}
              />
              <PricingCard
                title="Ongoing Care"
                subtitle="Post-launch maintenance & support plans."
                price="200"
                period="–350/month"
                note="Depends on plan tier (Starter/Growth)"
                features={["Monthly Security Patching", "Content Updates (Minor)", "Uptime Monitoring (24/7)", "Monthly Performance Reports", "Priority Bug Fixes"]}
                cta={{ label: "Contact Us", href: "/contact" }}
              />
            </div>
          )}

          {/* Subscription Cards */}
          {plan === "subscription" && (
            <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2" style={{ alignItems: "stretch" }}>
              <PricingCard
                title="Single Page"
                subtitle="Monthly subscription for a landing page."
                price="280"
                period="/month"
                note="Minimum 12-month commitment"
                features={["Full Single Page Design & Dev", "WhatsApp + Google Maps", "Basic SEO & Mobile Responsive", "Ongoing Support Included", "Monthly Content Updates"]}
                cta={{ label: "Subscribe Now", href: "/contact" }}
              />
              <PricingCard
                title="Multi-Page"
                subtitle="Full website on a monthly plan."
                price="450"
                period="/month"
                featured
                badge="✦ Best Value"
                note="Minimum 12-month commitment"
                features={["Up to 5 Pages", "CMS Integration", "Advanced SEO & Analytics", "Priority Support Included", "Quarterly Design Refreshes", "Performance Monitoring"]}
                cta={{ label: "Subscribe Now", href: "/contact" }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Maintenance Rates */}
      <section className="bg-slate-50 py-20 dark:bg-midnight-light">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeUp}>
              <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
                Built to Last, <span className="gradient-text">Managed with Care</span>
              </h2>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Beyond the initial build, we offer transparent rates for long-term sustainability.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { label: "Standard Maintenance", value: "RM 200 – 350 /mo", color: "text-royal" },
                  { label: "Technical Man-Day Rate", value: "RM 900", color: "text-royal" },
                  { label: "Emergency Support (After Hours)", value: "RM 1,350", color: "text-gold" },
                ].map((r, i) => (
                  <div key={i} className="glass-card flex items-center justify-between px-6 py-4">
                    <span className="font-semibold text-slate-800 dark:text-white">{r.label}</span>
                    <span className={`text-sm font-extrabold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <div className="glass-card p-8">
                <p className="mb-6 text-sm italic leading-relaxed text-slate-600 dark:text-slate-400">
                  &ldquo;Pawstrophe Digital reduced our site downtime by 98% in the first month. Their maintenance plan is non-negotiable for our growth.&rdquo;
                </p>
                <p className="font-heading font-bold text-slate-900 dark:text-white">Ahmad Razali</p>
                <p className="text-xs text-slate-500">Founder, KL Retail Hub</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2 {...fadeUp} className="mb-10 text-center font-heading text-3xl font-black text-slate-900 dark:text-white">
            Deep Dive <span className="gradient-text">Comparison</span>
          </motion.h2>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 shadow-lg dark:border-white/[0.06]">
            <table className="comparison-table">
              <thead>
                <tr className="bg-slate-50 dark:bg-midnight-light">
                  <th>Feature</th>
                  <th>Starter (RM 2,500)</th>
                  <th>Growth (RM 4,800)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Design System", "Professional Template-based", "100% Bespoke Design"],
                  ["Pages", "1 Landing Page", "Up to 5 Custom Pages"],
                  ["Content Management", "Static (Managed by us)", "Included CMS Dashboard"],
                  ["SEO Audit", "Baseline Setup", "Advanced Strategy + Copy"],
                  ["WhatsApp & Maps", "✓ Included", "✓ Included + Analytics"],
                  ["Turnaround Time", "7–10 Working Days", "15–20 Working Days"],
                  ["Free Support", "3 Months", "3 Months (Priority)"],
                  ["Post-Support Maintenance", "RM 200/month", "RM 350/month"],
                ].map(([feature, starter, growth], i) => (
                  <tr key={i}>
                    <td className="font-semibold">{feature}</td>
                    <td>{starter}</td>
                    <td className="text-royal font-semibold">{growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 dark:bg-midnight-light">
        <div className="mx-auto max-w-2xl px-6">
          <motion.h2 {...fadeUp} className="mb-10 text-center font-heading text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
          <FAQAccordion items={pricingFAQ} />
        </div>
      </section>

      <CTASection
        headline="Secure Your Slot Today"
        gradientWord="Today"
        subtext="To maintain high quality for every project, we strictly limit our monthly intake. We currently have 2 slots remaining this month."
      />
    </>
  );
}
