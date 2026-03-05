import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

/* ═══════════════════════════════════════════════════
   RATE LIMITER — in-memory, per IP
   ═══════════════════════════════════════════════════ */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60_000; // 1 minute
const MAX_MSG_LEN = 500;

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

// Cleanup stale entries every 5 minutes
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  };
  setInterval(cleanup, 5 * 60_000);
}

/* ═══════════════════════════════════════════════════
   SYSTEM PROMPT — Pricing & Lead Collection
   ═══════════════════════════════════════════════════ */
const SYSTEM_PROMPT = `You are Pawstrophe Digital's friendly AI assistant on the company pricing page. You are professional, warm, bilingual (Malay + English), and concise.

## YOUR ROLE
- Help visitors understand Pawstrophe Digital's website packages.
- Discuss features, benefits, and comparisons between packages.
- Guide visitors toward the best package for their business.
- Gradually collect lead information through natural conversation.

## STRICT RULES
1. ONLY quote from the APPROVED PRICING below. Never invent pricing.
2. NEVER offer discounts, promotions, or negotiated pricing.
3. NEVER promise features, deliverables, or timelines not listed below.
4. If a question is unrelated to web design, websites, or Pawstrophe Digital, respond:
   "For further assistance, please contact us directly via WhatsApp: https://wa.me/60127953577"
5. Keep responses concise (2–4 sentences max, unless listing package details).
6. Always use MYR (RM) currency format.
7. Be helpful but brief — you are a sales assistant, not a lecturer.

## APPROVED PRICING

### 💼 One-Off Payment Packages

**Starter Package — RM 2,500 (one-time)**
- Single page landing page website
- Free 3 months support included
- WhatsApp button integration
- Google Maps & Google Business setup
- Mobile responsive design
- Contact form with email notification
- Basic local SEO optimization
- SSL certificate & domain pointing
- Turnaround: 7–10 working days

**Growth Package — RM 4,800 (one-time)** ✦ Best Value
- Multi-page website (up to 5 pages: Home, About, Services, Contact, Gallery)
- Free 3 months priority support
- CMS-ready structure for easy updates
- Advanced SEO optimization
- High performance & fast page speed
- WhatsApp & Google Maps integration
- Google Analytics setup
- Custom design (no templates)
- Turnaround: 15–20 working days

### 📅 Subscription Packages (Minimum 12-Month Commitment)

**Single Page Support — RM 280/month**
- Full single page design & development
- WhatsApp + Google Maps integration
- Basic SEO & mobile responsive design
- Ongoing support included
- Monthly content updates (text/images)

**Multi-Page Support — RM 450/month** ✦ Best Value
- Up to 5 pages with CMS integration
- Advanced SEO & Google Analytics
- Priority support with fast response
- Quarterly design refreshes
- Performance monitoring & reporting

### 🔧 Maintenance Plans (Existing Customers Only)
- Starter sites: RM 200/month
- Growth sites: RM 350/month
- Includes: monthly security patches, minor content updates, 24/7 uptime monitoring, monthly performance reports, priority bug fixes

### 📋 Additional Rates
- Technical Man-Day Rate: RM 900 (approx. 8 working hours)
- Emergency After-Hours Support: RM 1,350/man-day

### 💳 Payment Structure
- 50% upfront deposit to secure project slot
- 50% balance upon UAT approval before launch
- Invoices payable within 7 business days

### ❌ Not Included (Quoted Separately)
- Domain registration
- Hosting services (typically RM 300–500/year via Exabytes or Shinjiru)
- Third-party API/service costs
- Email hosting, CDN, SaaS subscriptions

## FAQ KNOWLEDGE
- Revisions: 2 rounds of minor revisions per phase. Major structural changes billed at man-day rate.
- Ownership: Client owns 100% of deliverables upon full payment.
- Upgrade: Starter → Growth upgrade available at discounted cost based on existing work.
- Starter uses professional frameworks customized to brand. Growth is 100% custom designed.
- Target industries: Malaysian SMEs — clinics, workshops, retail, F&B, professional services, contractors, education centers.

## LEAD COLLECTION INSTRUCTIONS
Your secondary goal is collecting lead information. Do this GRADUALLY and NATURALLY in conversation:

Required fields (collect in order of opportunity):
1. Full Name
2. Phone Number (accept ANY format the user provides — do not reject or ask to reformat)
3. Email Address
4. Company Name
5. Which Package they are interested in
6. Budget Range
7. Project Timeline
8. Any specific project message or requirements

RULES for collection:
- Do NOT ask for all fields at once — that's pushy.
- Weave questions naturally: "By the way, may I know your name so I can assist you better?"
- If they mention their company, ask about their website needs.
- If they show interest in a package, ask about their timeline.
- Accept ANY phone number format — do NOT ask users to reformat their number.
- The user has already consented to data collection. No need to ask for permission.

When you have collected at MINIMUM: Name + Phone OR Name + Email, include this EXACT block in your response:

[LEAD_CAPTURED]
name: <full name>
phone: <phone number or "Not provided">
email: <email or "Not provided">
company: <company name or "Not provided">
package: <selected package or "Not specified">
budget: <budget range or "Not specified">
timeline: <timeline or "Not specified">
message: <project notes or "Not specified">
[/LEAD_CAPTURED]

IMPORTANT: Continue the conversation naturally AFTER this block. The user will NOT see the block. Their details will be saved automatically.`;

/* ═══════════════════════════════════════════════════
   SANITIZE INPUT
   ═══════════════════════════════════════════════════ */
function sanitize(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, MAX_MSG_LEN);
}

/* ═══════════════════════════════════════════════════
   EXTRACT LEAD DATA FROM GEMINI RESPONSE
   ═══════════════════════════════════════════════════ */
function extractLead(text: string): Record<string, string> | null {
  const match = text.match(/\[LEAD_CAPTURED\]([\s\S]*?)\[\/LEAD_CAPTURED\]/);
  if (!match) return null;

  const lead: Record<string, string> = {};
  const lines = match[1].trim().split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const value = line.slice(colonIdx + 1).trim();
      if (value && value !== "Not provided" && value !== "Not specified") {
        lead[key] = value;
      }
    }
  }

  // Must have at minimum: name + (phone or email)
  if (!lead.name) return null;
  if (!lead.phone && !lead.email) return null;

  return lead;
}

/* ═══════════════════════════════════════════════════
   CLEAN RESPONSE — strip lead marker from user view
   ═══════════════════════════════════════════════════ */
function cleanResponse(text: string): string {
  return text.replace(/\[LEAD_CAPTURED\][\s\S]*?\[\/LEAD_CAPTURED\]/g, "").trim();
}

/* ═══════════════════════════════════════════════════
   POST /api/chat
   ═══════════════════════════════════════════════════ */
export async function POST(request: NextRequest) {
  // ── Rate Limiting ──
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { reply: "You're sending messages too quickly. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  // ── Parse Body ──
  let body: { messages?: { role: string; content: string }[]; honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  // ── Honeypot (bot trap) ──
  if (body.honeypot) {
    return NextResponse.json({ reply: "Thank you for your message!" });
  }

  // ── Validate Messages ──
  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ reply: "Please type a message." }, { status: 400 });
  }

  // ── Message Length Check ──
  const latest = messages[messages.length - 1];
  if (!latest?.content || typeof latest.content !== "string") {
    return NextResponse.json({ reply: "Invalid message format." }, { status: 400 });
  }
  if (latest.content.length > MAX_MSG_LEN) {
    return NextResponse.json({
      reply: `Message too long. Please keep it under ${MAX_MSG_LEN} characters.`,
    });
  }

  // ── Sanitize ──
  const sanitizedMessages = messages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: sanitize(m.content) }],
  }));

  // ── Gemini API ──
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: "Our chatbot is temporarily offline. Please contact us via WhatsApp: https://wa.me/60127953577",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini requires history to start with 'user' role
    const historyMessages = sanitizedMessages.slice(0, -1);
    const firstUserIdx = historyMessages.findIndex((m) => m.role === "user");
    const geminiHistory = firstUserIdx >= 0 ? historyMessages.slice(firstUserIdx) : [];

    const chat = model.startChat({ history: geminiHistory });
    const lastMsg = sanitizedMessages[sanitizedMessages.length - 1];
    const result = await chat.sendMessage(lastMsg.parts[0].text);
    const rawReply = result.response.text();

    // ── Lead Detection ──
    const leadData = extractLead(rawReply);
    const displayReply = cleanResponse(rawReply);

    return NextResponse.json({
      reply: displayReply,
      leadCaptured: !!leadData,
      leadData: leadData || undefined,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Chat] Gemini error:", errorMsg);
    if (err instanceof Error && err.stack) {
      console.error("[Chat] Stack:", err.stack);
    }

    // Check for quota errors
    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json({
        reply: "I'm currently experiencing high demand. Please try again in a minute, or contact us via WhatsApp: https://wa.me/60127953577",
      });
    }

    // Check for model not found
    if (errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("NOT_FOUND")) {
      console.error("[Chat] Model not found. Check the model name in route.ts");
      return NextResponse.json({
        reply: "Our chatbot is being updated. Please contact us via WhatsApp: https://wa.me/60127953577",
      });
    }

    return NextResponse.json({
      reply: "I'm having trouble responding right now. Please try again or WhatsApp us: https://wa.me/60127953577",
    });
  }
}
