/**
 * Free-Tier Google Gemini 1.5 Flash AI Service
 * Utilizes Google AI Studio free tier (generative API key)
 * Free quota: 15 Requests Per Minute (RPM), 1 Million tokens context window
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

/**
 * Call Gemini 1.5 Flash with free Google AI Studio API Key
 * @param {string} prompt 
 * @param {string} systemInstruction 
 * @param {string} [customApiKey]
 * @returns {Promise<string|null>}
 */
export async function callGeminiFlash(prompt, systemInstruction = '', customApiKey = '') {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Signals caller to fall back to local rule-based engine
  }

  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Gemini Free Tier] API returned ${response.status}:`, errText);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.warn('[Gemini Free Tier] Request failed, falling back to local synthesizer:', err.message);
    return null;
  }
}

/**
 * Synthesize personalized tutoring step using Gemini 1.5 Flash
 */
export async function generateGeminiExplanation(topic, conceptTitle, studentLevel = 'basics', customApiKey = '') {
  const prompt = `You are Dr. Nova, an expert, enthusiastic personal AI tutor.
Topic: "${topic}"
Concept: "${conceptTitle}"
Target Tier: "${studentLevel}"

Generate a structured JSON lesson with:
1. "title": descriptive title
2. "speech_ssml": SSML string with <speak>, <emphasis>, and whiteboard sync markers like <mark name="step1"/>
3. "whiteboard_commands": array of drawing commands for interactive HTML5 canvas (actions: draw_rect, draw_circle, draw_curve, draw_axes, draw_array, draw_tree, draw_linked_nodes)
4. "notes_content": detailed academic notes
5. "key_takeaways": array of 3 key takeaways
6. "video_search_query": precise YouTube search query for university lecture

Respond ONLY with valid JSON.`;

  const rawJson = await callGeminiFlash(prompt, 'You are an advanced pedagogical AI tutor that outputs strictly valid JSON.', customApiKey);
  if (!rawJson) return null;

  try {
    return JSON.parse(rawJson);
  } catch (e) {
    console.warn('[Gemini Free Tier] Failed to parse JSON response:', e);
    return null;
  }
}
