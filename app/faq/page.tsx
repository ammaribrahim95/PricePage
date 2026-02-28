"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";

const pricingFAQ = [
  { question: "Does the price include domain and hosting?", answer: "No, we separate development from hosting to give you 100% ownership and flexibility. We can recommend and set up local providers like Exabytes or Shinjiru, usually costing RM 300–500 annually for domain and hosting combined." },
  { question: "What is the payment structure?", answer: "We follow a standard 50/50 model: 50% upfront to secure your project slot and initiate research, and 50% upon User Acceptance Testing (UAT) approval before the site goes live. Invoices are payable within 7 business days." },
  { question: "Are there any hidden fees?", answer: "Never. Our pricing is fully transparent. The only costs outside the quoted project fee are: domain registration, hosting fees, and any third-party API/service costs (if applicable). We always clarify these upfront before you commit." },
  { question: "What is the subscription model?", answer: "Our subscription plans (RM 280/mo for Single Page, RM 450/mo for Multi-Page) require a minimum 12-month commitment. This covers the initial design & build, ongoing support, monthly content updates, security patching, and performance monitoring." },
];

const servicesFAQ = [
  { question: "What's the difference between Starter and Growth?", answer: "The Starter plan (RM 2,500) is a single page landing page — perfect for new businesses. The Growth plan (RM 4,800) is a full multi-page website (up to 5 pages) with CMS integration, advanced SEO, and a fully custom design — ideal for established businesses." },
  { question: "Can I upgrade from Starter to Growth later?", answer: "Absolutely. We build our Starter sites on the same clean foundations as our Growth sites, making scalability seamless. When you're ready to expand, we'll provide a discounted upgrade cost based on what's already been built." },
  { question: "Do you design from scratch or use templates?", answer: "Our Growth plan is 100% custom designed — no templates. For the Starter plan, we use professional design frameworks but customize typography, colors, layout, and imagery to match your brand." },
  { question: "What industries do you serve?", answer: "We specialize in Malaysian SMEs across all sectors: clinics, workshops, retail, F&B, professional services, contractors, education, and more. Our deep understanding of local consumer behavior means your website is optimized for the Malaysian market." },
];

const supportFAQ = [
  { question: "What does the free 3-month support cover?", answer: "Critical bug fixes from original development, technical errors, browser compatibility issues, and minor text/content corrections. It does not include new feature requests, major redesigns, or issues caused by modifying the source code yourself." },
  { question: "How do the maintenance costs work after 3 months?", answer: "Maintenance plans cover core updates, security patches, monthly backups, and performance monitoring. Starter sites: RM 200/month. Growth sites: RM 350/month. Optional but highly recommended." },
  { question: "What does RM 900/man-day mean?", answer: "A man-day is approximately 8 working hours. This rate applies to change requests — any work outside the original scope. This includes: adding new features, structural layout changes, new API integrations, or significant design modifications." },
  { question: "Do you offer emergency support?", answer: "Yes. Emergency after-hours support is available at RM 1,350/man-day (1.5x standard rate). This covers critical issues like site downtime or security breaches outside of regular business hours." },
];

const processFAQ = [
  { question: "How long does it take to build my website?", answer: "Single Page sites: 7–10 working days. Multi-Page sites: 15–20 working days. Timelines start once we receive the 50% deposit and all required project materials." },
  { question: "How many revisions do I get?", answer: "Each project phase includes 2 rounds of minor revisions. Major structural changes after design approval are considered change requests and billed at the man-day rate." },
  { question: "Who owns the website after it's built?", answer: "You do — 100%. Upon receipt of full and final payment, all deliverables become your property. You'll receive full access to all source code and assets." },
];

export default function FAQPage() {
  return (
    <>
      <Hero
        eyebrow="Got Questions?"
        headline="Frequently Asked Questions"
        gradientWord="Questions"
        subtext={
          <>Everything you need to know about our services, pricing, and processes. Can&apos;t find an answer?{" "}<Link href="/contact" className="font-semibold text-royal hover:underline">Contact us.</Link></>
        }
      />

      <section className="py-10">
        <div className="mx-auto max-w-2xl px-6 space-y-12">
          <FAQAccordion items={pricingFAQ} title="Pricing & Payment" icon="payments" iconColor="#2563EB" />
          <FAQAccordion items={servicesFAQ} title="Services & Scope" icon="design_services" iconColor="#14B8A6" />
          <FAQAccordion items={supportFAQ} title="Support & Maintenance" icon="support_agent" iconColor="#C8A951" />
          <FAQAccordion items={processFAQ} title="Process & Timeline" icon="schedule" iconColor="#2563EB" />
        </div>
      </section>

      <CTASection
        headline="Still Have Questions?"
        gradientWord="Questions?"
        subtext="Our team is ready to help. Get in touch and we'll respond within 24 hours."
        primaryCta={{ label: "Contact Us", href: "/contact" }}
        secondaryCta={{ label: "WhatsApp Us", href: "https://wa.me/60127953577" }}
        showScarcity={false}
      />
    </>
  );
}
