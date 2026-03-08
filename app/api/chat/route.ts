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
   STATE MACHINE DEFINITIONS
   ═══════════════════════════════════════════════════ */
export type ChatStep =
  | "GREETING"
  | "ASK_BUSINESS_TYPE"
  | "ASK_WEBSITE_GOAL"
  | "ASK_EXISTING_WEBSITE"
  | "ASK_PACKAGE"
  | "ASK_TIMELINE"
  | "ASK_NAME"
  | "ASK_PHONE"
  | "ASK_EMAIL"
  | "ASK_COMPANY"
  | "ASK_MESSAGE"
  | "GENERATE_RECOMMENDATION"
  | "COMPLETE";

export interface ChatSession {
  step: ChatStep;
  lead: {
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
    timestamp: string;
  };
}

const STEP_ORDER: ChatStep[] = [
  "GREETING",
  "ASK_BUSINESS_TYPE",
  "ASK_WEBSITE_GOAL",
  "ASK_EXISTING_WEBSITE",
  "ASK_PACKAGE",
  "ASK_TIMELINE",
  "ASK_NAME",
  "ASK_PHONE",
  "ASK_EMAIL",
  "ASK_COMPANY",
  "ASK_MESSAGE",
  "GENERATE_RECOMMENDATION",
  "COMPLETE"
];

function getNextStep(current: ChatStep): ChatStep {
  const idx = STEP_ORDER.indexOf(current);
  if (idx === -1 || idx === STEP_ORDER.length - 1) return "COMPLETE";
  return STEP_ORDER[idx + 1];
}

/* ═══════════════════════════════════════════════════
   DYNAMIC SYSTEM PROMPT
   ═══════════════════════════════════════════════════ */
function generateSystemPrompt(session: ChatSession): string {
  const basePrompt = `You are a friendly, professional consultant for Pawstrophe Digital, helping visitors plan the right website.
Tone MUST be:
- Friendly, professional, natural, helpful.
- NOT robotic. Like a consultant chatting on WhatsApp.
- Short conversational messages. Avoid long paragraphs.
- Ask ONE question at a time. Never ask multiple questions.
- Occasionally use expressions like: Great 👍, Got it!, Nice!, Thanks for sharing.

You are currently guiding the user through a consultation flow.
Current Step: ${session.step}

`;

  let stepPrompt = "";

  switch (session.step) {
    case "ASK_BUSINESS_TYPE":
      stepPrompt = `Acknowledge the user's previous message naturally if needed.
Then, ask: "First, what kind of business do you run?" (or a natural variation).
You can give examples: Restaurant, Clinic, Construction, Online store, Others.
IMPORTANT: You MUST append this exact block at the very end of your response, capturing their PREVIOUS intent if any, otherwise leave it blank:
[DATA_CAPTURED]
business_type: 
[/DATA_CAPTURED]
Do NOT fill the block with what you are asking for, the block is for extracting the answer to the PREVIOUS question.`;
      break;

    case "ASK_WEBSITE_GOAL":
      stepPrompt = `Acknowledge the user's business type naturally (e.g., "Nice! A [business type]...").
Then ask what the main goal of their website is.
Provide numbered options:
1 Get more customers
2 Show business information
3 Online booking or appointments
4 Sell products online
5 Others (please specify)
Wait for their reply.
IMPORTANT: You MUST append this block to extract their business type from their PREVIOUS message:
[DATA_CAPTURED]
business_type: <extract their business type here>
[/DATA_CAPTURED]`;
      break;

    case "ASK_EXISTING_WEBSITE":
      stepPrompt = `Acknowledge their goal naturally.
Then ask: "Do you currently have a website?"
Options: 1 Yes, 2 No, 3 Not sure.
IMPORTANT: You MUST append this block to extract their website goal from their PREVIOUS message:
[DATA_CAPTURED]
website_goal: <extract their website goal here based on the option they chose>
[/DATA_CAPTURED]`;
      break;

    case "ASK_PACKAGE":
      stepPrompt = `Acknowledge their answer naturally.
Then ask: "What type of website are you looking for?"
Options:
1 Simple business website (Single page) - RM 2,500
2 Multi-page company website (Up to 5 pages) - RM 4,800
3 Website redesign
4 Not sure yet
5 Others (please specify)
IMPORTANT: You MUST append this block to extract their existing website status from their PREVIOUS message:
[DATA_CAPTURED]
existing_website: <Yes/No/Not sure>
[/DATA_CAPTURED]`;
      break;

    case "ASK_TIMELINE":
      stepPrompt = `Acknowledge their choice naturally.
Then ask: "When are you planning to launch your website?"
Options: 1 ASAP, 2 Within 1 month, 3 Within 3 months, 4 Just exploring.
IMPORTANT: You MUST append this block to extract their package choice from their PREVIOUS message:
[DATA_CAPTURED]
package: <extract their package choice>
[/DATA_CAPTURED]`;
      break;

    case "ASK_NAME":
      stepPrompt = `Acknowledge their timeline naturally.
Then say: "Great 👍 To prepare a recommendation for you, may I know your name?"
IMPORTANT: You MUST append this block to extract their timeline from their PREVIOUS message:
[DATA_CAPTURED]
timeline: <extract their timeline: ASAP/1 month/3 months/exploring>
[/DATA_CAPTURED]`;
      break;

    case "ASK_PHONE":
      stepPrompt = `Say: "Nice to meet you [Name extracted from their message]."
Then ask: "What is your mobile number so our team can easily reach you?"
IMPORTANT: You MUST append this block to extract their name from their PREVIOUS message:
[DATA_CAPTURED]
name: <extract their name>
[/DATA_CAPTURED]`;
      break;

    case "ASK_EMAIL":
      stepPrompt = `Say: "Thanks!"
Then ask: "What is the best email address to send your website plan?"
IMPORTANT: You MUST append this block to extract their phone number from their PREVIOUS message:
[DATA_CAPTURED]
phone: <extract their phone number>
[/DATA_CAPTURED]`;
      break;

    case "ASK_COMPANY":
      stepPrompt = `Say: "Thanks!"
Then ask: "What is your company or business name?"
IMPORTANT: You MUST append this block to extract their email from their PREVIOUS message:
[DATA_CAPTURED]
email: <extract their email>
[/DATA_CAPTURED]`;
      break;

    case "ASK_MESSAGE":
      stepPrompt = `Acknowledge their company name.
Then ask: "Is there anything specific you would like your website to include? For example: Booking system, Online menu, Product catalog, Contact form."
IMPORTANT: You MUST append this block to extract their company name from their PREVIOUS message:
[DATA_CAPTURED]
company: <extract their company name>
[/DATA_CAPTURED]`;
      break;

    case "GENERATE_RECOMMENDATION":
      stepPrompt = `First, acknowledge their specific feature request.
IMPORTANT: You MUST append this block to extract their additional message from their PREVIOUS message:
[DATA_CAPTURED]
message: <extract their specific features/message>
[/DATA_CAPTURED]

THEN, immediately generate a mini consultation based on what they shared so far:
Business Type: ${session.lead.business_type}
Goal: ${session.lead.website_goal}

Format the recommendation nicely. Example:
"Thanks [Name]! Based on what you shared:
Business Type: [Type]
Goal: [Goal]
We would recommend a modern mobile-friendly website with:
• [Feature 1]
• [Feature 2]
• [Feature 3]
This will help customers easily find your [business type] and contact you."

Immediately after the recommendation, send the closing message:
"Thanks again for sharing your details.
If you'd like, we can discuss the full website plan with you.
You can reach us directly here:
https://wa.me/+60127953577

Looking forward to helping your business grow online 🚀"
`;
      break;

    default:
      stepPrompt = "Conversation complete. Just say thanks and goodbye.";
  }

  return basePrompt + stepPrompt;
}

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
   EXTRACT DATA FROM GEMINI RESPONSE
   ═══════════════════════════════════════════════════ */
function extractDataFromResponse(text: string): Record<string, string> {
  const match = text.match(/\[DATA_CAPTURED\]([\s\S]*?)\[\/DATA_CAPTURED\]/);
  if (!match) return {};

  const data: Record<string, string> = {};
  const lines = match[1].trim().split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const value = line.slice(colonIdx + 1).trim();
      if (value) {
        data[key] = value;
      }
    }
  }
  return data;
}

/* ═══════════════════════════════════════════════════
   CLEAN RESPONSE — strip data marker from user view
   ═══════════════════════════════════════════════════ */
function cleanResponse(text: string): string {
  return text.replace(/\[DATA_CAPTURED\][\s\S]*?\[\/DATA_CAPTURED\]/g, "").trim();
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
  let body: { 
    messages?: { role: string; content: string }[]; 
    session?: ChatSession;
    honeypot?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request." }, { status: 400 });
  }

  // ── Honeypot (bot trap) ──
  if (body.honeypot) {
    return NextResponse.json({ reply: "Thank you for your message!" });
  }

  // ── Validation ──
  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ reply: "Please type a message." }, { status: 400 });
  }
  const session = body.session || { 
    step: "ASK_BUSINESS_TYPE" as ChatStep, 
    lead: { name: "", phone: "", email: "", company: "", business_type: "", website_goal: "", existing_website: "", package: "", timeline: "", message: "", lead_score: 0, timestamp: "" } 
  };

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
      systemInstruction: generateSystemPrompt(session),
    });

    // Gemini requires history to start with 'user' role
    const historyMessages = sanitizedMessages.slice(0, -1);
    const firstUserIdx = historyMessages.findIndex((m) => m.role === "user");
    const geminiHistory = firstUserIdx >= 0 ? historyMessages.slice(firstUserIdx) : [];

    const chat = model.startChat({ history: geminiHistory });
    const lastMsg = sanitizedMessages[sanitizedMessages.length - 1];
    const result = await chat.sendMessage(lastMsg.parts[0].text);
    const rawReply = result.response.text();

    // ── Update State and Lead Data ──
    const extracted = extractDataFromResponse(rawReply);
    const displayReply = cleanResponse(rawReply);

    let nextStep = session.step;

    // Apply extracted data to lead and adjust score
    if (Object.keys(extracted).length > 0) {
      nextStep = getNextStep(session.step);

      for (const [key, value] of Object.entries(extracted)) {
        if (key in session.lead && value && value.toLowerCase() !== "null" && value.toLowerCase() !== "undefined") {
          (session.lead as any)[key] = value;
          
          // Apply Scoring rules
          if (key === "timeline" && value.toLowerCase().includes("asap")) {
            session.lead.lead_score += 5;
          }
          if (key === "company") {
            session.lead.lead_score += 3;
          }
          if (key === "message" && value.length > 5) {
            session.lead.lead_score += 2;
          }
          if (key === "business_type") {
            session.lead.lead_score += 2;
          }
        }
      }
    } else if (session.step === "GENERATE_RECOMMENDATION") {
      // Special case: recommendation generated, move to COMPLETE
      nextStep = getNextStep(session.step);
    }

    session.step = nextStep;
    session.lead.timestamp = new Date().toISOString();

    return NextResponse.json({
      reply: displayReply,
      session,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[Chat] Gemini error:", errorMsg);

    if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json({
        reply: "I'm currently experiencing high demand. Please try again in a minute, or contact us via WhatsApp: https://wa.me/60127953577",
      });
    }

    return NextResponse.json({
      reply: "I'm having trouble responding right now. Please try again or WhatsApp us: https://wa.me/60127953577",
    });
  }
}
