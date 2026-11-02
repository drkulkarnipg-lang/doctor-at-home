// Patient-facing AI is limited to website navigation and non-clinical service information.
// It must not diagnose, triage non-emergency symptoms, counsel on treatment, or prescribe.
const allowedOrigins = new Set([
  "https://home-visiting-icu-doctor.vercel.app",
  "https://drkulkarnipg.com",
  "https://www.drkulkarnipg.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://home-visiting-icu-doctor.vercel.app",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), "Content-Type": "application/json", "Cache-Control": "no-store" } });

const windows = new Map<string, { count: number; reset: number }>();
const emergencyPattern = /(chest pain|chest pressure|severe breathlessness|cannot breathe|can't breathe|unconscious|not waking|stroke|face droop|slurred speech|sudden weakness|seizure|fits|major bleeding|vomiting blood|severe allergic|anaphylaxis|छातीत दुख|छातीमध्ये दाब|तीव्र दम|श्वास घेता येत नाही|बेशुद्ध|शुद्धीवर नाही|चेहरा वाकडा|बोलता येत नाही|अचानक अशक्त|झटके|फिट्स|खूप रक्तस्राव|रक्ताची उलटी|तीव्र अॅलर्जी|आत्महत्या|स्वतःला इजा)/i;
const clinicalPattern = /(diagnos|differential|what disease|what is wrong|treatment|which medicine|medicine for|tablet|dose|dosage|insulin|antibiotic|steroid|prescribe|stop.*medicine|increase.*dose|decrease.*dose|interpret.*report|what does.*report|symptom|fever|pain|blood pressure|sugar level|oxygen level|creatinine|छातीत|ताप|दुखत|औषध|गोळी|डोस|उपचार|निदान|रिपोर्टचा अर्थ|साखर|बीपी|ऑक्सिजन|क्रिएटिनिन)/i;

const systemPrompt = `You are the website navigation assistant for HOME VISITING ICU DOCTOR, Pune, India.
Your permitted scope is strictly: explain website navigation; explain how to request a home visit or contact the clinic; explain the published service categories and fee information supplied in the prompt; help users find the Health Library, patient guides, calculators, language selector, PDF tools and contact options.
Do not provide medical counselling, diagnosis, differential diagnosis, symptom assessment, treatment advice, medicine names, dose advice, report interpretation, or a decision that a patient is safe. Do not recommend starting, stopping or changing any medicine. Indian telemedicine platform guidance does not permit AI/ML technology platforms to counsel patients or prescribe medicines; route clinical questions to the Registered Medical Practitioner.
For any medical/clinical question, briefly state that you cannot provide clinical advice and direct the person to contact Dr. Kulkarni for an appropriate consultation. If the person describes emergency warning signs, tell them not to wait for chat and to call India's emergency number 112 or go to the nearest emergency department immediately.
Never ask for patient name, phone, address, Aadhaar, reports, photographs, passwords or other identifiable health information in this chat. Do not claim that a booking is confirmed. Do not claim to be Dr. Kulkarni or a human. Be concise, kind, and use the language the visitor uses (Marathi, Hindi or English). If unsure about a website feature or fee, say so and direct them to the clinic contact option. Answer only within permitted scope.`;

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown").split(",")[0].trim();
  const now = Date.now();
  const entry = windows.get(ip);
  if (entry && entry.reset > now && entry.count >= 12) {
    return json({ error: "Too many requests. Please wait a few minutes or contact the clinic directly." }, 429, origin);
  }
  if (!entry || entry.reset <= now) windows.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
  else entry.count += 1;
  if (windows.size > 5000) for (const [key, value] of windows) if (value.reset <= now) windows.delete(key);

  let body: { message?: unknown };
  try {
    const raw = await req.text();
    if (raw.length > 5000) return json({ error: "Message is too long. Please shorten it." }, 413, origin);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400, origin);
  }
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1200) : "";
  if (!message) return json({ error: "Please enter a short question." }, 400, origin);

  if (emergencyPattern.test(message)) {
    return json({
      reply: "This may be an emergency. Do not wait for an online chat reply. Call 112 in India now or go to the nearest emergency department. If possible, have someone stay with the patient.",
      mode: "emergency_safety",
    }, 200, origin);
  }
  if (clinicalPattern.test(message)) {
    return json({
      reply: "I can help you navigate the website and find patient education, but I cannot assess symptoms, interpret a report, diagnose, recommend treatment or advise medicine doses. Please contact Dr. Kulkarni for a proper clinical consultation. If symptoms are severe or rapidly worsening, seek urgent in-person care.",
      mode: "clinician_required",
    }, 200, origin);
  }

  const apiKey = Deno.env.get("AI_API_KEY");
  if (!apiKey) {
    return json({
      error: "The AI service is not configured yet. Website guidance remains available through the existing Patient Help shortcuts. The clinic owner must add the AI provider key in Supabase Edge Function Secrets before AI replies can be enabled.",
      code: "AI_SETUP_REQUIRED",
    }, 503, origin);
  }
  const base = (Deno.env.get("AI_BASE_URL") || "https://openrouter.ai/api/v1").replace(/\/$/, "");
  const model = Deno.env.get("AI_MODEL") || "openrouter/free";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const upstream = await fetch(base + "/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://drkulkarnipg.com",
        "X-Title": "Home Visiting ICU Doctor — Patient Website Assistant",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 350,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });
    if (!upstream.ok) {
      // Do not return provider response bodies, which may contain account or request details.
      return json({ error: "The AI service is temporarily unavailable. Please use the Patient Help shortcuts or contact the clinic.", code: "AI_PROVIDER_ERROR" }, 502, origin);
    }
    const result = await upstream.json();
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return json({ error: "The AI service returned no usable answer. Please use the Patient Help shortcuts.", code: "AI_EMPTY_RESPONSE" }, 502, origin);
    }
    return json({ reply: reply.trim().slice(0, 2200), mode: "ai_navigation" }, 200, origin);
  } catch {
    return json({ error: "The AI service timed out or could not be reached. Please try again or contact the clinic.", code: "AI_NETWORK_ERROR" }, 502, origin);
  } finally {
    clearTimeout(timeout);
  }
});
