"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREET =
  "Hi! 👋 I'm the Pawstrophe Digital assistant. I can help you with our pricing, services, and get you started on your project. What would you like to know?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [consented, setConsented] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREET },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [lastSent, setLastSent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && consented) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, consented]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Client-side rate limit (2 seconds)
    if (Date.now() - lastSent < 2000) return;
    setLastSent(Date.now());

    const userMsg: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
          honeypot,
        }),
      });

      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again or WhatsApp us at +60127953577.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, lastSent, honeypot]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleConsent = () => {
    if (!consentChecked) return;
    setConsented(true);
  };

  return (
    <div className="chat-widget-container">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className="chat-widget-toggle"
        aria-label={open ? "Close chat" : "Open chat"}
        id="chat-toggle-btn"
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="chat-widget-toggle-icon"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-6 w-6">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              <circle cx="12" cy="10" r="1.2" />
              <circle cx="8" cy="10" r="1.2" />
              <circle cx="16" cy="10" r="1.2" />
            </svg>
          )}
        </motion.span>

        {/* Notification dot */}
        {!open && (
          <span className="chat-widget-dot">
            <span className="chat-widget-dot-ping" />
            <span className="chat-widget-dot-solid" />
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="chat-widget-panel"
            id="chat-panel"
          >
            {/* Header */}
            <div className="chat-widget-header">
              <div className="flex items-center gap-3">
                <div className="chat-widget-avatar">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>smart_toy</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Pawstrophe Assistant</p>
                  <p className="text-[10px] text-white/60">Powered by AI · Replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Consent Gate */}
            {!consented ? (
              <div className="chat-widget-consent">
                <div className="chat-widget-consent-inner">
                  <span className="material-symbols-outlined chat-widget-consent-icon">shield</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Privacy Notice</h4>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    This chat may collect your name, email, and phone number to assist you better. Your data is
                    protected under Malaysia&apos;s PDPA 2010.
                  </p>
                  <label className="mt-4 flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-royal"
                      id="consent-checkbox"
                    />
                    <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      I agree to the{" "}
                      <Link href="/privacy" className="font-semibold text-royal hover:underline" target="_blank">
                        Privacy Policy
                      </Link>{" "}
                      and consent to data collection.
                    </span>
                  </label>
                  <button
                    onClick={handleConsent}
                    disabled={!consentChecked}
                    className="mt-4 w-full rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-royal/20 transition-all hover:bg-royal-dark disabled:opacity-40 disabled:cursor-not-allowed"
                    id="consent-proceed-btn"
                  >
                    Start Chatting
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="chat-widget-messages" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`chat-widget-msg ${msg.role === "user" ? "chat-widget-msg-user" : "chat-widget-msg-bot"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="chat-widget-msg-avatar">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
                        </div>
                      )}
                      <div className={`chat-widget-bubble ${msg.role === "user" ? "chat-widget-bubble-user" : "chat-widget-bubble-bot"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="chat-widget-msg chat-widget-msg-bot">
                      <div className="chat-widget-msg-avatar">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
                      </div>
                      <div className="chat-widget-bubble chat-widget-bubble-bot">
                        <div className="chat-widget-typing">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Honeypot (hidden from humans) */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Input */}
                <div className="chat-widget-input-area">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about our pricing..."
                    className="chat-widget-input"
                    maxLength={500}
                    disabled={loading}
                    id="chat-input"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="chat-widget-send"
                    aria-label="Send message"
                    id="chat-send-btn"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
                  </button>
                </div>

                {/* PDPA Footer */}
                <div className="chat-widget-footer">
                  <span className="material-symbols-outlined" style={{ fontSize: 10 }}>lock</span>
                  Protected under PDPA 2010 ·{" "}
                  <Link href="/privacy" target="_blank" className="hover:underline">
                    Privacy
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
