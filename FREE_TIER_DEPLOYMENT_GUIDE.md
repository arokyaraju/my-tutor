# 💸 100% Free Architecture & Deployment Guide: Zero Financial Investment

This guide details how your **AI Personal Tutor** runs completely free at **$0.00 / month** using modern free-tier platforms, open-source browser capabilities, and free AI models.

---

## 🏛️ The 100% Free Architecture Stack

| Layer | Paid / Enterprise ($/mo) | **100% Free Alternative** | Why it Works for $0 |
|---|---|---|---|
| **Hosting & CDN** | AWS / Azure ($20+/mo) | **Vercel Hobby Tier** | Free hosting for Vite/React SPA + SSL certificate on `.vercel.app`. |
| **Database & Auth** | Firebase / Auth0 ($25+/mo) | **Supabase Free Tier** | Free PostgreSQL instance (500 MB), Auth (50,000 MAU), and file storage. |
| **Talking Avatar & Lipsync** | HeyGen / D-ID ($49+/mo) | **Native Browser Web Speech API + SVG Lipsync** | Uses local browser TTS (`window.speechSynthesis`) + CSS animated avatar with audio-reactive mouth/eye blinks. |
| **AI Text Brain** | OpenAI GPT-4o ($0.015/1k tok) | **Google Gemini 1.5 Flash** | Google AI Studio offers a free perpetual tier (15 RPM, 1M token context window, native PDF/table analysis). |
| **Interactive Whiteboard** | Proprietary Whiteboard SaaS | **HTML5 Custom 2D Canvas Engine** | Hardware-accelerated canvas with zero SaaS overhead or subscription fees. |
| **Video Lecture Player** | Enterprise Streaming Servers | **Verified YouTube Academic CDN** | Embeds university masterclasses with zero storage or bandwidth costs. |

---

## 🛠️ Step-by-Step Setup Plan ($0 Investment)

### Step 1: Set Up Free Supabase Database & Auth
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** (select the free tier).
3. Open the **SQL Editor** on the left menu.
4. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql) and paste it into the editor, then click **Run**.
   - This creates `profiles`, `courses`, `enrollments`, `exam_submissions`, `video_quiz_results`, and `audit_logs` with security policies.
5. In **Project Settings > API**, copy:
   - **Project URL** &rarr; Put in `.env` as `VITE_SUPABASE_URL`
   - **anon / public key** &rarr; Put in `.env` as `VITE_SUPABASE_ANON_KEY`

---

### Step 2: Get Free Google Gemini 1.5 Flash API Key
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **Create API key** (free, no billing setup required).
3. In your `.env` file, set:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Gemini 1.5 Flash natively processes student PDF uploads, multi-section lesson plans, whiteboard command lists, and descriptive answer rubrics.

---

### Step 3: Talking Avatar & Whiteboard (Zero HeyGen Fees)
- **Visual Avatar**: The teacher avatar (`Dr. Nova`) is rendered via modular SVG with real-time CSS animations (`speaking`, `happy`, `attentive`, `thinking`).
- **Voice Engine**: Uses the browser's native `window.speechSynthesis`. Supported out-of-the-box on Chrome, Edge, Safari, and Firefox with zero audio generation costs.
- **Speech-to-Text**: Uses the browser's native `window.webkitSpeechRecognition` for student voice interruptions.

---

### Step 4: Deploy Live to Vercel for Free
1. Push your code to a free GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Free Tier AI Personal Tutor"
   git branch -M main
   git remote add origin https://github.com/your-username/my-tutor.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub.
3. Click **Add New > Project**, select your `my-tutor` repository.
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically build the app and give you a live HTTPS URL (e.g., `https://my-tutor-yourname.vercel.app`)!

---

## 🔒 Secret Admin Portal
To check student exam logs, telemetry, and sincerity checks secretly:
- **Admin Password**: `3791552`
- Access via the secret button in the UI or `POST /api/admin/verify-and-logs`.
