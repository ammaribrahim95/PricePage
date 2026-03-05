"use client";

import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ActionButton {
  label: string;
  href: string;
  icon: string;
}

const GREET =
  "Hi! 👋 I'm the Pawstrophe Digital assistant. I can help you explore our website packages and pricing. What kind of website are you looking for?";

const SESSION_KEY = "pawstrophe-chat-state";

/* ═══════════════════════════════════════════════════
   MESSAGE CONTENT RENDERER — clickable links
   ═══════════════════════════════════════════════════ */
function renderMessageContent(text: string) {
  // Split text by URLs and render them as clickable links
  const urlRegex = /(https?:\/\/[^\s),]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      // Reset regex lastIndex after test
      urlRegex.lastIndex = 0;

      // Determine link label and icon
      const isWhatsApp = part.includes("wa.me") || part.includes("whatsapp");
      const label = isWhatsApp ? "WhatsApp Us" : part;
      const icon = isWhatsApp ? "chat" : "open_in_new";

      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-widget-link"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{icon}</span>
          {label}
        </a>
      );
    }
    // Reset regex lastIndex for the split
    urlRegex.lastIndex = 0;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/* ═══════════════════════════════════════════════════
   ACTION BUTTONS — detect keywords → show nav buttons
   ═══════════════════════════════════════════════════ */
function getActionButtons(text: string): ActionButton[] {
  const buttons: ActionButton[] = [];
  const lower = text.toLowerCase();

  // Only show buttons for assistant messages with relevant content
  const hasPricing = /rm\s*[\d,]+|rm\s*2[,.]?500|rm\s*4[,.]?800|rm\s*280|rm\s*450|starter|growth/i.test(text);
  const hasPackage = /(package|plan|single page|multi.?page|subscription|one.?off|maintenance)/i.test(text);
  const hasService = /(web design|website|seo|cms|landing page|responsive)/i.test(text);
  const hasContact = /(contact|reach out|get in touch|book|schedule|consult)/i.test(text);
  const hasPortfolio = /(portfolio|previous work|examples|projects|showcase)/i.test(text);
  const hasFaq = /(faq|frequently|revision|ownership|upgrade)/i.test(text);

  if (hasPricing || hasPackage) {
    buttons.push({ label: "View Pricing", href: "/pricing", icon: "payments" });
  }
  if (hasService && !hasPricing) {
    buttons.push({ label: "Our Services", href: "/services", icon: "design_services" });
  }
  if (hasPortfolio) {
    buttons.push({ label: "View Portfolio", href: "/portfolio", icon: "photo_library" });
  }
  if (hasContact && !lower.includes("whatsapp")) {
    buttons.push({ label: "Contact Us", href: "/contact", icon: "mail" });
  }
  if (hasFaq) {
    buttons.push({ label: "View FAQ", href: "/faq", icon: "help" });
  }

  // Max 2 buttons per message to avoid clutter
  return buttons.slice(0, 2);
}

/* ═══════════════════════════════════════════════════
   SESSION STORAGE HELPERS
   ═══════════════════════════════════════════════════ */
function saveState(data: {
  messages: Message[];
  consented: boolean;
  open: boolean;
  leadSubmitted: boolean;
}) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage might not be available
  }
}

function loadState(): {
  messages: Message[];
  consented: boolean;
  open: boolean;
  leadSubmitted: boolean;
} | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════
   CHAT WIDGET COMPONENT
   ═══════════════════════════════════════════════════ */
export default function ChatWidget() {
  const router = useRouter();

  /* ── State ── */
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

  // Lead capture state
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  /* ── Refs ── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Restore session state on mount ── */
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setMessages(saved.messages);
      setConsented(saved.consented);
      setOpen(saved.open);
      setLeadSubmitted(saved.leadSubmitted);
      if (saved.consented) setConsentChecked(true);
    }
  }, []);

  /* ── Persist state on changes ── */
  useEffect(() => {
    saveState({ messages, consented, open, leadSubmitted });
  }, [messages, consented, open, leadSubmitted]);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /* ── Focus input when chat opens ── */
  useEffect(() => {
    if (open && consented) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, consented]);

  /* ── Auto-focus after loading completes ── */
  useEffect(() => {
    if (!loading && open && consented) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, open, consented]);

  /* ═══════════════════════════════════════════════════
     NAVIGATE WITHOUT LOSING CHAT
     ═══════════════════════════════════════════════════ */
  const navigateTo = (href: string) => {
    // State is already persisted via useEffect above
    // Use Next.js router for client-side navigation (no full page reload)
    router.push(href);
  };

  /* ═══════════════════════════════════════════════════
     SEND MESSAGE
     ═══════════════════════════════════════════════════ */
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Client-side rate limit: 2 seconds between messages
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
      const reply = data.reply || "Sorry, something went wrong. Please try again.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      // Auto-submit lead silently (user already consented to PDPA at chat start)
      if (data.leadCaptured && data.leadData && !leadSubmitted) {
        autoSubmitLead(data.leadData);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting. Please try again or WhatsApp us: https://wa.me/60127953577",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, lastSent, honeypot, leadSubmitted]);

  /* ═══════════════════════════════════════════════════
     AUTO-SUBMIT LEAD (silent, no UI confirmation needed)
     ═══════════════════════════════════════════════════ */
  const autoSubmitLead = async (data: Record<string, string>) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setLeadSubmitted(true);
        console.log("[Chat] ✅ Lead auto-submitted successfully");
      } else {
        console.warn("[Chat] Lead submission returned errors:", result.errors || result.error);
      }
    } catch (err) {
      console.error("[Chat] Lead auto-submit failed:", err);
    }
  };

  /* ── Keyboard Handler ── */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── Consent Gate ── */
  const handleConsent = () => {
    if (!consentChecked) return;
    setConsented(true);
  };

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
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
                    This chat may collect your name, email, and phone number to assist you. Your data is
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
                  {messages.map((msg, i) => {
                    const actionButtons = msg.role === "assistant" ? getActionButtons(msg.content) : [];

                    return (
                      <div key={i}>
                        <div
                          className={`chat-widget-msg ${msg.role === "user" ? "chat-widget-msg-user" : "chat-widget-msg-bot"}`}
                        >
                          {msg.role === "assistant" && (
                            <div className="chat-widget-msg-avatar">
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
                            </div>
                          )}
                          <div className={`chat-widget-bubble ${msg.role === "user" ? "chat-widget-bubble-user" : "chat-widget-bubble-bot"}`}>
                            {renderMessageContent(msg.content)}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {actionButtons.length > 0 && (
                          <div className="chat-widget-actions">
                            {actionButtons.map((btn, j) => (
                              <button
                                key={j}
                                onClick={() => navigateTo(btn.href)}
                                className="chat-widget-action-btn"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{btn.icon}</span>
                                {btn.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

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
