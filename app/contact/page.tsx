"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Hero from "@/components/Hero";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SHEETS_WEBHOOK = "YOUR_GOOGLE_APPS_SCRIPT_URL";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", business: "", service: "", budget: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Submit to Google Sheets via Apps Script webhook
      if (GOOGLE_SHEETS_WEBHOOK !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString(),
          }),
        });
      }
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", business: "", service: "", budget: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Hero
        eyebrow="Let's Talk"
        headline="Start Your Digital Transformation"
        gradientWord="Digital Transformation"
        subtext="Book a free strategy session. We'll respond within 24 hours with a tailored project roadmap."
      />

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

            {/* Contact Form */}
            <motion.div {...fadeUp}>
              <div className="glass-card p-8 lg:p-10">
                <h2 className="mb-1 font-heading text-2xl font-bold text-slate-900 dark:text-white">Send Us a Message</h2>
                <p className="mb-8 text-sm text-slate-500">Fill in the form below and we&apos;ll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name *</label>
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Ahmad Razali" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Phone *</label>
                      <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="012-795 3577" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email *</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@company.com" required />
                  </div>

                  <div>
                    <label htmlFor="business" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Business Name</label>
                    <input type="text" name="business" id="business" value={formData.business} onChange={handleChange} className="form-input" placeholder="Your Company Sdn Bhd" />
                  </div>

                  <div>
                    <label htmlFor="service" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Service Interested In *</label>
                    <select name="service" id="service" value={formData.service} onChange={handleChange} className="form-input" required>
                      <option value="">Select a service…</option>
                      <option value="single">Single Page Website (From RM 2,500)</option>
                      <option value="multi">Multi-Page Website (From RM 4,800)</option>
                      <option value="sub-single">Subscription – Single Page (RM 280/mo)</option>
                      <option value="sub-multi">Subscription – Multi-Page (RM 450/mo)</option>
                      <option value="maintenance">Maintenance Plan</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Budget (MYR)</label>
                    <select name="budget" id="budget" value={formData.budget} onChange={handleChange} className="form-input">
                      <option value="">Select range…</option>
                      <option value="<3000">Below RM 3,000</option>
                      <option value="3000-5000">RM 3,000 – RM 5,000</option>
                      <option value="5000-10000">RM 5,000 – RM 10,000</option>
                      <option value=">10000">Above RM 10,000</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Project Details *</label>
                    <textarea name="message" id="message" value={formData.message} onChange={handleChange} className="form-textarea" placeholder="Tell us about your project, goals, and timeline…" required />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-royal px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-royal/30 transition-all hover:bg-royal-dark hover:shadow-xl disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <>Sending...</>
                    ) : (
                      <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span> Send Enquiry</>
                    )}
                  </button>

                  {status === "success" && (
                    <div className="rounded-xl bg-teal/10 border border-teal/20 p-4 text-center text-sm font-semibold text-teal">
                      ✓ Message sent successfully! We&apos;ll respond within 24 hours.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm font-semibold text-red-500">
                      Something went wrong. Please try WhatsApp instead.
                    </div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Contact Sidebar */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="space-y-6">
              {/* Quick Contact */}
              <div className="glass-card p-8">
                <h3 className="mb-6 font-heading text-xl font-bold text-slate-900 dark:text-white">Quick Contact</h3>
                <a
                  href="https://wa.me/60127953577"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#1DA851]"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chat</span>
                  WhatsApp Us Directly
                </a>
                <div className="space-y-5">
                  {[
                    { icon: "mail", label: "EMAIL", value: "theapawstrophe@gmail.com", color: "text-royal" },
                    { icon: "phone", label: "PHONE", value: "012-795 3577", color: "text-teal" },
                    { icon: "location_on", label: "LOCATION", value: "Kuala Lumpur, Malaysia", color: "text-gold" },
                    { icon: "schedule", label: "BUSINESS HOURS", value: "Mon–Fri, 9AM – 6PM (GMT+8)", color: "text-royal" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${c.color}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{c.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{c.label}</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scarcity */}
              <div className="rounded-2xl bg-gradient-to-br from-midnight via-slate-900 to-midnight-light p-8 shadow-xl">
                <div className="scarcity-badge mb-4 w-fit" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "white" }}>
                  <span className="relative h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />
                    <span className="relative block h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  Limited Slots
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-white">Only 4 Clients Per Month</h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  We limit our intake to ensure premium quality. Currently <strong className="text-teal">2 slots remaining</strong> this month.
                </p>
              </div>

              {/* Google Maps */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.753862280126!2d101.6958!3d3.1390!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeaa7%3A0xf4d98e5b2f1c287d!2sKuala%20Lumpur%20City%20Centre!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
                  width="100%"
                  height="250"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pawstrophe Digital Office"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
