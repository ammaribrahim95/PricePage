"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  icon?: string;
  iconColor?: string;
  title?: string;
}

export default function FAQAccordion({ items, icon, iconColor, title }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
          {icon && (
            <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 22 }}>
              {icon}
            </span>
          )}
          {title}
        </h3>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="glass-card overflow-hidden"
            style={{ borderRadius: 16 }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="pr-4 text-sm font-semibold text-slate-800 dark:text-white">
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  expand_more
                </span>
              </motion.span>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
