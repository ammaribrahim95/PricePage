# PricePage AI Chatbot — Complete Setup Guide

> **All tools used are FREE.** No paid subscriptions required.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Phase 1 — Gemini API Key](#2-phase-1--gemini-api-key)
3. [Phase 2 — Telegram Bot Setup](#3-phase-2--telegram-bot-setup)
4. [Phase 3 — Google Sheets Setup](#4-phase-3--google-sheets-setup)
5. [Phase 4 — Environment Variables](#5-phase-4--environment-variables)
6. [Phase 5 — Vercel Deployment](#6-phase-5--vercel-deployment)
7. [Phase 6 — n8n Workflow (Optional)](#7-phase-6--n8n-workflow-optional)
8. [Phase 7 — Testing](#8-phase-7--testing)
9. [Data Backup Plan](#9-data-backup-plan)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Architecture Overview

```
User visits PricePage → Clicks chat bubble → Types question
                                                    ↓
                                           /api/chat (Next.js)
                                                    ↓
                                          ┌─────────┴─────────┐
                                          ↓                   ↓
                                    Gemini 2.0 Flash    Lead Detection
                                    (AI Response)             ↓
                                          ↓            ┌──────┴──────┐
                                    Reply to user      ↓             ↓
                                                 Google Sheets   Telegram
                                                 (Append Row)   (Notify)
```

**Primary Backend (Recommended):** Everything runs in the Next.js API route on Vercel — zero additional infrastructure needed.

**Optional:** n8n can be installed locally for visual workflow editing and additional automation.

---

## 2. Phase 1 — Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key
6. Save it — you'll need it for `.env.local`

> **Free Tier Limits (Gemini 2.0 Flash):**
> - 15 requests per minute
> - 1,500 requests per day
> - 1 million tokens per minute
>
> This is more than enough for a business chatbot.

---

## 3. Phase 2 — Telegram Bot Setup

### Create the Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name: `PricePage Lead Bot`
4. Choose a username: `pricepage_lead_bot` (must end in `bot`)
5. BotFather will give you a **Bot Token** like: `7123456789:AAF...`
6. Save this token

### Get Your Chat ID

1. Start a chat with your new bot (click the link BotFather gives you)
2. Send any message to the bot (e.g., "hello")
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Find `"chat":{"id":YOUR_CHAT_ID}` in the JSON response
5. Save this Chat ID number

> **Tip:** For group notifications, add the bot to a group, send a message in the group, then check `getUpdates` again. The chat ID will be negative (e.g., `-123456789`).

---

## 4. Phase 3 — Google Sheets Setup

### Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it: **"PricePage Chatbot Leads"**
3. In Row 1, add these headers:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Date | Name | Company | Phone | Email | Project | Budget | Timeline | Source |

### Create the Apps Script Webhook

1. In the spreadsheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.company || '',
      data.phone || '',
      data.email || '',
      data.project || '',
      data.budget || '',
      data.timeline || '',
      data.source || 'chatbot'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Deploy → New deployment**
4. Select **Web app**
5. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and **Authorize** when prompted
7. Copy the **Web app URL** — this is your `CHATBOT_SHEETS_WEBHOOK`

---

## 5. Phase 4 — Environment Variables

### Local Development

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
CHATBOT_SHEETS_WEBHOOK=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Vercel Production

Add the same variables in Vercel Dashboard:

1. Go to your project on [Vercel](https://vercel.com)
2. **Settings → Environment Variables**
3. Add each variable listed above
4. For `ALLOWED_ORIGINS`, use your production domain: `https://your-domain.vercel.app`
5. Click **Save** and **redeploy**

---

## 6. Phase 5 — Vercel Deployment

If PricePage is already on Vercel:

1. Push the new code to your Git repository
2. Vercel will auto-deploy
3. Add environment variables in Settings (see Phase 4)
4. Verify the chat widget appears at your production URL

If deploying fresh:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add CHATBOT_SHEETS_WEBHOOK
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add ALLOWED_ORIGINS

# Redeploy with env vars
vercel --prod
```

---

## 7. Phase 6 — n8n Workflow (Optional)

n8n provides a visual workflow editor. It's useful for:
- Adding additional automation (e.g., email follow-ups)
- Testing webhook flows visually
- Future CRM integrations

### Install n8n Locally (No Docker Required)

```bash
# Run n8n directly (installs temporarily)
npx n8n

# Or install globally
npm install -g n8n
n8n start
```

n8n will open at `http://localhost:5678`

### Import the Workflow

1. Open n8n at `http://localhost:5678`
2. Click **"Add workflow"** → **"Import from file"**
3. Select `docs/n8n-lead-capture.json`
4. Configure credentials:
   - **Google Gemini API:** Add your API key
   - **Google Sheets OAuth2:** Connect your Google account
   - **Telegram Bot API:** Add your bot token
5. Update the Google Sheets node with your spreadsheet ID
6. Update the Telegram node with your chat ID
7. **Activate** the workflow

### n8n Hosting Options (Free/Cheap)

| Option | Cost | Always On? |
|--------|------|------------|
| `npx n8n` locally | Free | No (only when PC is on) |
| [n8n Cloud](https://n8n.io/cloud) | Free tier available | Yes |
| [Railway.app](https://railway.app) | $5 free credits/month | Yes |
| Self-hosted VPS (Oracle Cloud) | Free tier available | Yes |

> **Note:** The primary chatbot works via the Next.js API route on Vercel (always on, free). n8n is optional additional automation.

---

## 8. Phase 7 — Testing

### Quick Test (Local)

```bash
# Start dev server
npm run dev

# Test the API route directly
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"messages":[{"role":"user","content":"How much for a website?"}]}'
```

### Full Flow Test

1. Open `http://localhost:3000`
2. Click the blue chat bubble (bottom-left)
3. Check the privacy consent checkbox → click "Start Chatting"
4. Ask: *"How much for a single page website?"*
5. Verify you get pricing response (RM 2,500)
6. Provide your name and email in conversation
7. Check Google Sheets for new row
8. Check Telegram for notification

### Test Telegram Notification Directly

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"YOUR_CHAT_ID","text":"Test notification from PricePage","parse_mode":"Markdown"}'
```

---

## 9. Data Backup Plan

### Option A: Automatic Google Drive Backup (Recommended)

1. In Google Sheets, go to **File → Make a copy** weekly
2. Or use Google Apps Script to auto-backup:

```javascript
// Add this to your Apps Script (set a weekly trigger)
function weeklyBackup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var folder = DriveApp.getFolderById('YOUR_BACKUP_FOLDER_ID');
  var date = Utilities.formatDate(new Date(), 'Asia/Kuala_Lumpur', 'yyyy-MM-dd');
  ss.copy('PricePage Leads Backup - ' + date);
}
```

3. Set up a time trigger: **Extensions → Apps Script → Triggers → Add Trigger**
   - Function: `weeklyBackup`
   - Event source: Time-driven
   - Type: Week timer
   - Day: Monday

### Option B: Manual Export

- **File → Download → CSV** monthly
- Store in a secure local/cloud folder

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Chat widget not showing | Check browser console for errors. Ensure layout.tsx includes `<ChatWidget />` |
| "Chatbot unavailable" | `GEMINI_API_KEY` not set. Add to `.env.local` and restart dev server |
| No Telegram notification | Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Test with curl first |
| Google Sheets not updating | Check Apps Script deployment. Re-deploy if URL changed |
| CORS errors | Update `ALLOWED_ORIGINS` to include your domain |
| Rate limit hit | Wait 1 minute. Free tier: 15 requests/min |
| n8n won't start | Ensure Node.js 18+ installed. Try `npx n8n@latest` |
