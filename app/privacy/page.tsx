"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "@/components/Hero";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const sections = [
  {
    num: "01",
    title: "Information We Collect",
    content:
      "When you interact with our AI chatbot or contact forms, we may collect: your full name, company name, mobile phone number, email address, project type preference, estimated budget range, and project timeline. We only collect information you voluntarily provide during conversation.",
  },
  {
    num: "02",
    title: "How We Use Your Information",
    content:
      "Your information is used solely to: respond to your enquiries, provide project quotations, send relevant follow-up communications, and improve our services. We do not sell, rent, or share your personal data with any third party for marketing purposes.",
  },
  {
    num: "03",
    title: "Data Storage & Security",
    content:
      "Your data is stored securely in Google Sheets (Google Workspace) with access restricted to authorized Pawstrophe Digital team members only. Data is transmitted over encrypted HTTPS connections. We implement reasonable security measures to protect against unauthorized access, alteration, or destruction.",
  },
  {
    num: "04",
    title: "AI Chatbot Disclosure",
    content:
      "Our website features an AI-powered chatbot using Google Gemini technology. The chatbot provides information based on our approved pricing and services only. Conversations may be reviewed to improve service quality. The chatbot does not make binding commitments — all quotations and agreements require human confirmation.",
  },
  {
    num: "05",
    title: "Third-Party Services",
    content: null,
    serviceItems: [
      "Google Gemini — AI conversation processing",
      "Google Sheets — Lead data storage",
      "Telegram Bot API — Internal team notifications",
      "Vercel — Website hosting",
    ],
  },
  {
    num: "06",
    title: "Your Rights Under PDPA 2010",
    content: null,
    rights: [
      "Access your personal data held by us",
      "Correct any inaccurate or incomplete data",
      "Withdraw consent for data processing",
      "Request deletion of your personal data",
      "Limit or prevent processing of your data",
    ],
  },
  {
    num: "07",
    title: "Data Retention",
    content:
      "We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy, or as required by applicable law. Lead data is typically retained for 24 months. Upon request, we will delete your data within 14 business days.",
  },
  {
    num: "08",
    title: "Cookies & Tracking",
    content:
      "Our website uses essential cookies for site functionality only. We do not use tracking cookies for advertising purposes. The AI chatbot stores conversation context in your browser session only — it is not saved permanently on our servers.",
  },
  {
    num: "09",
    title: "Contact Us",
    content:
      "For any privacy-related enquiries, data access requests, or concerns, please contact our Data Protection Officer:",
    contact: {
      email: "theapawstrophe@gmail.com",
      phone: "+60127953577",
      address: "Kuala Lumpur, Malaysia",
    },
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Hero
        eyebrow="Legal"
        headline="Privacy Policy"
        gradientWord="Privacy"
        subtext="Last updated: March 2026. This policy explains how Pawstrophe Digital collects, uses, and protects your personal data in compliance with Malaysia's Personal Data Protection Act 2010 (PDPA)."
        center={false}
      />

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-12">
            {/* Main Content */}
            <div className="min-w-0 flex-1 max-w-3xl">
              {sections.map((s, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="legal-section">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-xs font-black tracking-widest text-slate-300 dark:text-slate-600">{s.num}/</span>
                    <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{s.title}</h2>
                  </div>

                  {s.content && (
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.content}</p>
                  )}

                  {s.serviceItems && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {s.serviceItems.map((item, j) => (
                        <div key={j} className="glass-card flex items-center gap-3 px-4 py-3">
                          <span className="material-symbols-outlined text-royal" style={{ fontSize: 18 }}>cloud</span>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.rights && (
                    <ul className="mt-4 space-y-2">
                      {s.rights.map((right, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-teal mt-0.5" style={{ fontSize: 16 }}>check_circle</span>
                          {right}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.contact && (
                    <div className="mt-4 space-y-3">
                      {[
                        { icon: "mail", label: s.contact.email, color: "text-royal" },
                        { icon: "phone", label: s.contact.phone, color: "text-teal" },
                        { icon: "location_on", label: s.contact.address, color: "text-gold" },
                      ].map((c, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${c.color}`} style={{ fontSize: 18 }}>{c.icon}</span>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl bg-gradient-to-br from-royal to-royal-dark p-8 text-white shadow-xl">
                  <h4 className="mb-2 text-lg font-bold">Data Request?</h4>
                  <p className="mb-6 text-sm opacity-85">Want to access, correct, or delete your data? We&apos;ll respond within 14 business days.</p>
                  <Link href="/contact" className="flex items-center justify-center rounded-xl bg-midnight px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-midnight-light">
                    Submit Request
                  </Link>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-teal" style={{ fontSize: 20 }}>verified_user</span>
                    <div>
                      <p className="text-xs font-bold text-teal">PDPA Compliant</p>
                      <p className="text-[10px] text-slate-400">Malaysia PDPA 2010</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
