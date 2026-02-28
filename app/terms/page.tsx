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
    title: "Scope of Work",
    content: "Scope is defined in the signed quotation. Work outside scope is considered a change request and will be assessed and billed separately at the agreed man-day rate.",
  },
  {
    num: "02",
    title: "Payment Terms",
    content: "50% upfront deposit required to secure project slot and initiate research. 50% balance due before project launch. Subscription plans require a minimum 12-month commitment. All invoices payable within 7 business days. Late payments may result in project suspension and a 5% weekly penalty fee.",
  },
  {
    num: "03",
    title: "Revisions",
    content: "Up to 2 major revisions included during the development phase. A 'major revision' is defined as changes that alter the fundamental structure, layout, or architecture of the deliverable. Additional revisions beyond the included rounds will be billed separately at the man-day rate.",
  },
  {
    num: "04",
    title: "Support",
    content: null,
    lists: {
      included: ["Minor bug fixes from original development", "Technical adjustments and compatibility issues", "Minor text/content corrections"],
      excluded: ["New features or functionality", "Major redesign or structural changes", "Content restructuring or rewriting"],
    },
  },
  {
    num: "05",
    title: "Change Requests",
    content: "All additional work beyond the agreed scope of work will be billed at RM 900 per man-day (approximately 8 working hours), depending on complexity. Emergency after-hours support is available at RM 1,350/man-day.",
  },
  {
    num: "06",
    title: "Intellectual Property",
    content: "Full ownership of all final deliverables is transferred to the client upon receipt of full and final payment. Pawstrophe Digital retains the right to display project assets in our portfolio and marketing materials unless a non-disclosure agreement (NDA) specifies otherwise.",
  },
  {
    num: "07",
    title: "Timeline",
    content: "Timeline begins after deposit confirmation and content/materials submission. Single Page: 7–10 working days. Multi-Page: 15–20 working days. Delays caused by the Client in providing materials may extend the delivery timeline accordingly.",
  },
  {
    num: "08",
    title: "Termination",
    content: "Deposit is non-refundable once development begins. Either party may terminate with 30 days written notice. Pawstrophe Digital shall be entitled to payment for all work completed up to the date of termination. A 15% cancellation fee of the remaining contract value applies.",
  },
  {
    num: "09",
    title: "Liability Limitation",
    content: "Pawstrophe Digital is not liable for: hosting downtime, third-party API failures, or external service interruptions. Total aggregate liability shall not exceed the total fees paid for the specific project in question.",
  },
  {
    num: "10",
    title: "Exclusions",
    content: null,
    exclusionItems: ["Domain registration", "Hosting services", "Third-party integrations / API fees", "Operational costs (email hosting, CDN, SSL if not free-tier, SaaS subscriptions)"],
  },
];

export default function TermsPage() {
  return (
    <>
      <Hero
        eyebrow="Legal"
        headline="Terms of Engagement"
        gradientWord="Engagement"
        subtext="Last updated: February 2026. These terms define the professional relationship between Pawstrophe Digital and our valued partners."
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

                  {s.lists && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal">Free support covers:</p>
                        <ul className="space-y-2">
                          {s.lists.included.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <span className="material-symbols-outlined text-teal mt-0.5" style={{ fontSize: 16 }}>check</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-400">Does NOT cover:</p>
                        <ul className="space-y-2">
                          {s.lists.excluded.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <span className="material-symbols-outlined text-red-400 mt-0.5" style={{ fontSize: 16 }}>close</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {s.exclusionItems && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {s.exclusionItems.map((item, j) => (
                        <div key={j} className="glass-card flex items-center gap-3 px-4 py-3">
                          <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 18 }}>block</span>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item}</span>
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
                  <h4 className="mb-2 text-lg font-bold">Need Clarification?</h4>
                  <p className="mb-6 text-sm opacity-85">Our team is available to walk you through any clauses.</p>
                  <Link href="/contact" className="flex items-center justify-center rounded-xl bg-midnight px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-midnight-light">
                    Schedule a Call
                  </Link>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3">
                    <span className="relative h-3 w-3">
                      <span className="absolute inset-0 rounded-full bg-teal animate-ping opacity-40" />
                      <span className="relative block h-3 w-3 rounded-full bg-teal" />
                    </span>
                    <span className="text-xs font-bold text-teal">Standard Terms Active</span>
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
