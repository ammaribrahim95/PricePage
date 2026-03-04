import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ─── Rate Limiter (in-memory, per IP) ─── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/* ─── System Prompt with Pricing Knowledge Base ─── */
const SYSTEM_PROMPT = `You are Pawstrophe Digital's AI assistant on their pricing website. You are friendly, professional, and concise.

## STRICT RULES
- Only answer based on the APPROVED PRICING and FAQ below.
- Do NOT generate custom pricing, discounts, or promotions.
- Do NOT promise features, deliverables, or timelines not listed below.
- If a question is outside your knowledge, respond: "For more specific requirements, please contact Pawstrophe Digital directly at +60127953577 or WhatsApp us."
- Keep responses concise (2-4 sentences unless listing pricing).
- Use MYR (RM) currency.

## APPROVED PRICING

### One-Off Payment Packages
1. **Starter — RM 2,500 (one-time)**
   - Single page landing page
   - Free 3 months support
   - WhatsApp integration, Google Maps & Business setup
   - Mobile responsive design, contact form
   - Basic local SEO optimization, SSL & domain pointing
   - Turnaround: 7–10 working days

2. **Growth — RM 4,800 (one-time)** ✦ Best Value
   - Multi-page website (up to 5 pages: Home, About, Services, Contact, Gallery)
   - Free 3 months support (priority)
   - CMS-ready structure, advanced SEO optimization
   - High performance & page speed
   - WhatsApp & Google Maps integration + analytics
   - Custom design (no templates)
   - Turnaround: 15–20 working days

### Subscription Packages (Minimum 12-Month Commitment)
1. **Single Page — RM 280/month**
   - Full single page design & development
   - WhatsApp + Google Maps, basic SEO & mobile responsive
   - Ongoing support included, monthly content updates

2. **Multi-Page — RM 450/month** ✦ Best Value
   - Up to 5 pages, CMS integration
   - Advanced SEO & analytics, priority support
   - Quarterly design refreshes, performance monitoring

### Maintenance Plans (Post-launch, for existing customers)
- Starter sites: RM 200/month
- Growth sites: RM 350/month
- Covers: monthly security patching, content updates (minor), uptime monitoring 24/7, monthly performance reports, priority bug fixes

### Additional Rates
- Technical Man-Day Rate: RM 900 (approx. 8 working hours)
- Emergency After-Hours Support: RM 1,350/man-day

### Payment Structure
- 50% upfront deposit to secure project slot
- 50% balance upon UAT approval before launch
- Invoices payable within 7 business days

### What's NOT Included (Quoted Separately)
- Domain registration
- Hosting services (typically RM 300–500/year via Exabytes or Shinjiru)
- Third-party API/service costs
- Operational costs (email hosting, CDN, SaaS subscriptions)

## FAQ KNOWLEDGE
- Revisions: 2 rounds of minor revisions included per phase. Major structural changes billed at man-day rate.
- Ownership: Client owns 100% of deliverables upon full payment.
- Upgrade: Starter can be upgraded to Growth — discounted upgrade cost based on existing work.
- Starter uses professional design frameworks customized to brand. Growth is 100% custom designed.
- Industries: Malaysian SMEs — clinics, workshops, retail, F&B, professional services, contractors, education.

## LEAD COLLECTION
When the conversation feels natural, try to collect the following information (DO NOT ask all at once, gather progressively):
- Full Name
- Company Name
- Mobile Number
- Email
- Project Type (Single Page / Multi-Page / Subscription / Not Sure)
- Budget Range
- Timeline

When you have collected at least Name + Email OR Name + Phone, include this EXACT marker in your response (hidden from user display):
[LEAD_CAPTURED]
name: <name>
company: <company or "Not provided">
phone: <phone or "Not provided">
email: <email or "Not provided">
project: <project type or "Not specified">
budget: <budget or "Not specified">
timeline: <timeline or "Not specified">
[/LEAD_CAPTURED]

Continue the conversation naturally after the marker.`;

/* ─── Sanitize Input ─── */
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[<>]/g, "")    // strip remaining angle brackets
    .trim()
    .slice(0, 500);          // max 500 characters
}

/* ─── Google Sheets Append ─── */
async function appendToSheet(lead: Record<string, string>) {
  const webhookUrl = process.env.CHATBOT_SHEETS_WEBHOOK;
  if (!webhookUrl) {
    console.warn("[Chat] CHATBOT_SHEETS_WEBHOOK not configured — skipping Sheets append");
    return;
  }

  try {
    const payload = new URLSearchParams();
    payload.append("timestamp", new Date().toISOString());
    payload.append("name", lead.name || "");
    payload.append("company", lead.company || "");
    payload.append("phone", lead.phone || "");
    payload.append("email", lead.email || "");
    payload.append("project", lead.project || "");
    payload.append("budget", lead.budget || "");
    payload.append("timeline", lead.timeline || "");
    payload.append("source", "chatbot");

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });
    console.log("[Chat] Lead appended to Google Sheets");
  } catch (err) {
    console.error("[Chat] Sheets append failed:", err);
  }
}

/* ─── Telegram Notification ─── */
async function sendTelegramNotification(lead: Record<string, string>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn("[Chat] Telegram credentials not configured — skipping notification");
    return;
  }

  const message = `🔥 *New Lead from PricePage Chatbot*

👤 *Name:* ${lead.name || "—"}
🏢 *Company:* ${lead.company || "—"}
📱 *Phone:* ${lead.phone || "—"}
📧 *Email:* ${lead.email || "—"}
📋 *Project:* ${lead.project || "—"}
💰 *Budget:* ${lead.budget || "—"}
⏰ *Timeline:* ${lead.timeline || "—"}
📅 *Date:* ${new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });
    console.log("[Chat] Telegram notification sent");
  } catch (err) {
    console.error("[Chat] Telegram notification failed:", err);
  }
}

/* ─── Parse Lead Data from Gemini Response ─── */
function extractLead(text: string): Record<string, string> | null {
  const match = text.match(/\[LEAD_CAPTURED\]([\s\S]*?)\[\/LEAD_CAPTURED\]/);
  if (!match) return null;

  const lead: Record<string, string> = {};
  const lines = match[1].trim().split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      lead[key] = value;
    }
  }
  return lead;
}

/* ─── Strip Lead Marker from User-Visible Response ─── */
function cleanResponse(text: string): string {
  return text.replace(/\[LEAD_CAPTURED\][\s\S]*?\[\/LEAD_CAPTURED\]/g, "").trim();
}

/* ─── Main POST Handler ─── */
export async function POST(request: NextRequest) {
  // ── Origin Validation ──
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");
  if (!allowedOrigins.some((o) => origin.startsWith(o.trim()))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Rate Limiting ──
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // ── Parse Body ──
  let body: { messages?: { role: string; content: string }[]; honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Honeypot Check ──
  if (body.honeypot) {
    // Bot detected — return fake success
    return NextResponse.json({ reply: "Thank you for your message! We'll get back to you soon." });
  }

  // ── Validate Messages ──
  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages required" }, { status: 400 });
  }

  // ── Sanitize Messages ──
  const sanitizedMessages = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: sanitize(m.content) }],
  }));

  // ── Gemini API Call ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chatbot is temporarily unavailable. Please contact us at +60127953577." },
      { status: 503 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // ── Build Gemini-compatible history ──
    // Gemini requires history to start with 'user' role.
    // Strip any leading 'model' messages (e.g., the initial greeting).
    const historyMessages = sanitizedMessages.slice(0, -1);
    const firstUserIdx = historyMessages.findIndex((m) => m.role === "user");
    const geminiHistory = firstUserIdx >= 0 ? historyMessages.slice(firstUserIdx) : [];

    const chat = model.startChat({
      history: geminiHistory,
    });

    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const rawReply = result.response.text();

    // ── Lead Detection ──
    const lead = extractLead(rawReply);
    if (lead) {
      // Fire-and-forget: append to Sheets + Telegram
      appendToSheet(lead);
      sendTelegramNotification(lead);
    }

    const cleanReply = cleanResponse(rawReply);

    return NextResponse.json(
      { reply: cleanReply, leadCaptured: !!lead },
      {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    console.error("[Chat] Gemini API error:", err);
    return NextResponse.json(
      { error: "I'm having trouble responding right now. Please try again or contact us at +60127953577." },
      { status: 500 }
    );
  }
}

/* ─── OPTIONS Handler (CORS Preflight) ─── */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
