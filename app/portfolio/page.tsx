"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import CTASection from "@/components/CTASection";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const projects = [
  {
    title: "Skyline Aesthetics Clinic",
    category: "Premium Healthcare & Booking",
    location: "Kuala Lumpur, MY",
    tags: ["UI/UX", "React"],
    desc: "Complete redesign of the clinic's online presence. Implemented a booking system with WhatsApp confirmation, resulting in a 3x increase in online appointments.",
    stats: [{ label: "Traffic", value: "+180%" }, { label: "Bookings", value: "3x" }, { label: "Load Time", value: "2.1s" }],
  },
  {
    title: "Titan Builders & Co",
    category: "Industrial Portfolio & Lead Gen",
    location: "Selangor, MY",
    tags: ["Strategy", "Next.js"],
    desc: "Multi-page portfolio with project galleries and Google Maps integration. WhatsApp routing for instant contractor quotes.",
    stats: [{ label: "Traffic", value: "+142%" }, { label: "Enquiries", value: "5x" }, { label: "Load Time", value: "1.8s" }],
  },
  {
    title: "KL Retail Hub",
    category: "E-commerce Dashboard & Analytics",
    location: "Kuala Lumpur, MY",
    tags: ["E-commerce", "Vue"],
    desc: "Custom analytics dashboard with real-time sales tracking. Migrated from an outdated legacy system to a modern stack.",
    stats: [{ label: "Uptime", value: "+95%" }, { label: "Conversion", value: "2x" }, { label: "Load Time", value: "2.4s" }],
  },
  {
    title: "Workshop Pro",
    category: "Automotive Service Landing Page",
    location: "Penang, MY",
    tags: ["Landing", "SEO"],
    desc: "High-converting single page for an automotive workshop. WhatsApp booking integration increased daily appointments by 200%.",
    stats: [{ label: "Bookings", value: "+200%" }, { label: "Google Rank", value: "#1" }, { label: "Load Time", value: "1.5s" }],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Hero
        eyebrow="Our Work"
        headline="Trusted by Local Businesses"
        gradientWord="Local Businesses"
        subtext="We take pride in every project. Here's a showcase of real results delivered for Malaysian SMEs."
      >
        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "50+", label: "Projects Completed" },
            { value: "35+", label: "Happy Clients" },
            { value: "142%", label: "Avg Traffic Growth" },
            { value: "98%", label: "Client Retention" },
          ].map((stat, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: 0.3 + i * 0.1 }} className="text-center">
              <p className="font-heading text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Hero>

      {/* Portfolio Grid */}
      <section className="bg-slate-50 py-20 dark:bg-midnight-light">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((p, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                {/* Image placeholder */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06]">
                  <div className="aspect-[16/10] bg-gradient-to-br from-royal/10 via-teal/5 to-gold/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-royal/20">image</span>
                  </div>
                  <div className="portfolio-overlay">
                    <p className="text-xs text-slate-300">{p.location}</p>
                    <h4 className="text-lg font-bold text-white">{p.title}</h4>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{p.title}</h4>
                    <p className="text-sm text-slate-500">{p.category}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className="rounded-lg bg-royal/10 px-2.5 py-1 text-xs font-semibold text-royal">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card mt-3 p-5">
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{p.desc}</p>
                  <div className="mt-4 flex gap-8">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <p className="font-heading text-lg font-black gradient-text">{s.value}</p>
                        <p className="text-xs text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Want Results Like These?"
        gradientWord="These?"
        subtext="Let us build a website that works as hard as you do. Start with a free strategy session."
        primaryCta={{ label: "Start Your Project", href: "/contact" }}
        secondaryCta={{ label: "View Pricing", href: "/pricing" }}
      />
    </>
  );
}
