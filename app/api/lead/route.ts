import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface LeadData {
  name: string;
  phone: string;
  email: string;
  company: string;
  business_type: string;
  website_goal: string;
  existing_website: string;
  package: string;
  timeline: string;
  message: string;
  lead_score: number;
  source: string;
}

/* ═══════════════════════════════════════════════════
   RATE LIMITER — per IP, 5 submissions/hour
   ═══════════════════════════════════════════════════ */
const leadRateMap = new Map<string, { count: number; resetAt: number }>();
const LEAD_RATE_LIMIT = 5;
const LEAD_RATE_WINDOW = 60 * 60_000; // 1 hour

function isLeadRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = leadRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    leadRateMap.set(ip, { count: 1, resetAt: now + LEAD_RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > LEAD_RATE_LIMIT;
}

/* ═══════════════════════════════════════════════════
   DUPLICATE PREVENTION — by email/phone, 24h window
   ═══════════════════════════════════════════════════ */
const recentLeads = new Map<string, number>();
const DEDUP_WINDOW = 24 * 60 * 60_000; // 24 hours

function isDuplicate(email: string, phone: string): boolean {
  const now = Date.now();
  // Clean old entries
  for (const [key, ts] of recentLeads) {
    if (now - ts > DEDUP_WINDOW) recentLeads.delete(key);
  }

  const emailKey = email ? `email:${email.toLowerCase()}` : null;
  const phoneKey = phone ? `phone:${phone.replace(/\D/g, "")}` : null;

  if (emailKey && recentLeads.has(emailKey)) return true;
  if (phoneKey && recentLeads.has(phoneKey)) return true;

  if (emailKey) recentLeads.set(emailKey, now);
  if (phoneKey) recentLeads.set(phoneKey, now);

  return false;
}

/* ═══════════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════════ */
function sanitize(str: string): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
}

function validateLead(data: Partial<LeadData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name is required (minimum 2 characters).");
  }
  if (!data.phone && !data.email) {
    errors.push("Either phone number or email is required.");
  }

  return { valid: errors.length === 0, errors };
}

/* ═══════════════════════════════════════════════════
   GOOGLE SHEETS APPEND
   ═══════════════════════════════════════════════════ */
async function appendToSheet(lead: LeadData): Promise<boolean> {
  const webhookUrl = process.env.CHATBOT_SHEETS_WEBHOOK;
  if (!webhookUrl) {
    console.warn("[Lead] CHATBOT_SHEETS_WEBHOOK not configured");
    return false;
  }

  try {
    const payload = new URLSearchParams();
    payload.append("timestamp", new Date().toISOString());
    payload.append("name", lead.name);
    payload.append("phone", lead.phone || "");
    payload.append("email", lead.email || "");
    payload.append("company", lead.company || "");
    payload.append("business_type", lead.business_type || "");
    payload.append("website_goal", lead.website_goal || "");
    payload.append("existing_website", lead.existing_website || "");
    payload.append("package", lead.package || "Not specified");
    payload.append("timeline", lead.timeline || "Not specified");
    payload.append("message", lead.message || "");
    payload.append("lead_score", lead.lead_score.toString());
    payload.append("source", lead.source || "website_chatbot");

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });

    if (!res.ok) {
      console.error("[Lead] Sheets HTTP error:", res.status);
      return false;
    }
    console.log("[Lead] ✅ Appended to Google Sheets");
    return true;
  } catch (err) {
    console.error("[Lead] Sheets append failed:", err);
    return false;
  }
}

/* ═══════════════════════════════════════════════════
   TELEGRAM NOTIFICATION
   ═══════════════════════════════════════════════════ */
async function sendTelegramNotification(lead: LeadData): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn("[Lead] Telegram credentials not configured");
    return false;
  }

  const isHotLead = lead.lead_score > 8;

  const text = [
    isHotLead ? "🔥 *HOT LEAD*" : "🚨 *New Website Lead*",
    "",
    `👤 *Name:* ${lead.name}`,
    `📧 *Email:* ${lead.email || "—"}`,
    `🏢 *Company:* ${lead.company || "—"}`,
    `🏭 *Business:* ${lead.business_type || "—"}`,
    `🎯 *Goal:* ${lead.website_goal || "—"}`,
    `🌐 *Existing Site:* ${lead.existing_website || "—"}`,
    `📦 *Package:* ${lead.package || "—"}`,
    `⏰ *Timeline:* ${lead.timeline || "—"}`,
    "",
    `⭐ *Lead Score:* ${lead.lead_score}`,
    "",
    `💬 *Message:*`,
    `${lead.message || "—"}`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[Lead] Telegram HTTP error:", res.status, errBody);
      return false;
    }
    console.log("[Lead] ✅ Telegram notification sent");
    return true;
  } catch (err) {
    console.error("[Lead] Telegram failed:", err);
    return false;
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/lead
   ═══════════════════════════════════════════════════ */
export async function POST(request: NextRequest) {
  // ── Rate Limiting ──
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isLeadRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  // ── Parse Body ──
  let data: Partial<LeadData>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  // ── Sanitize All Fields ──
  const lead: LeadData = {
    name: sanitize(data.name || ""),
    phone: sanitize(data.phone || ""),
    email: sanitize(data.email || "").toLowerCase(),
    company: sanitize(data.company || ""),
    business_type: sanitize(data.business_type || ""),
    website_goal: sanitize(data.website_goal || ""),
    existing_website: sanitize(data.existing_website || ""),
    package: sanitize(data.package || "Not specified"),
    timeline: sanitize(data.timeline || "Not specified"),
    message: sanitize(data.message || "").slice(0, 1000),
    lead_score: typeof data.lead_score === "number" ? data.lead_score : 0,
    source: sanitize(data.source || "website_chatbot")
  };

  // ── Validate ──
  const validation = validateLead(lead);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, errors: validation.errors },
      { status: 400 }
    );
  }

  // ── Duplicate Check ──
  if (isDuplicate(lead.email, lead.phone)) {
    return NextResponse.json({
      success: true,
      message: "Thank you! We already have your details and will be in touch soon.",
      duplicate: true,
    });
  }

  // ── Save to Google Sheets + Notify via Telegram ──
  const [sheetOk, telegramOk] = await Promise.all([
    appendToSheet(lead),
    sendTelegramNotification(lead),
  ]);

  if (!sheetOk && !telegramOk) {
    console.error("[Lead] Both Sheets and Telegram failed for:", lead.name);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't save your details right now. Please WhatsApp us directly: https://wa.me/60127953577",
      },
      { status: 500 }
    );
  }

  console.log(`[Lead] ✅ Lead saved: ${lead.name} (Sheets: ${sheetOk}, Telegram: ${telegramOk})`);

  return NextResponse.json({
    success: true,
    message: "Thank you! Our team will contact you within 24 hours.",
    saved: { sheets: sheetOk, telegram: telegramOk },
  });
}
