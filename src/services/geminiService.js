import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const languageMap = {
  en: { name: "English", native: "English" },
  es: { name: "Spanish", native: "Español" },
  fr: { name: "French", native: "Français" },
  ar: { name: "Arabic", native: "العربية" },
  hi: { name: "Hindi", native: "हिन्दी" },
  ur: { name: "Urdu", native: "اردو" },
  pa: { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  zh: { name: "Chinese", native: "中文" },
  vi: { name: "Vietnamese", native: "Tiếng Việt" },
  ko: { name: "Korean", native: "한국어" },
  ja: { name: "Japanese", native: "日本語" },
  ru: { name: "Russian", native: "Русский" },
  pt: { name: "Portuguese", native: "Português" },
  tr: { name: "Turkish", native: "Türkçe" },
  de: { name: "German", native: "Deutsch" },
  it: { name: "Italian", native: "Italiano" },
  tl: { name: "Filipino", native: "Filipino" },
  th: { name: "Thai", native: "ไทย" },
  bn: { name: "Bengali", native: "বাংলা" },
  fa: { name: "Persian", native: "فارسی" },
  am: { name: "Amharic", native: "አማርኛ" },
  so: { name: "Somali", native: "Soomaali" },
};

function buildPrompt(userData, userMessage) {
  const languageName = languageMap[userData?.language]?.name || "English";

  return `
You are a simple assistant for a newcomer settlement app.

Your job:
- help users navigate the app
- explain app features simply
- answer clearly and directly

Style rules:
- maximum 2 short sentences
- use simple words
- no filler
- no greetings unless the user greets first
- be practical and direct
- keep app section names in English exactly as written:
  Dashboard
  Checklist
  Community Map

Language rules:
- reply only in ${languageName}
- the user may type in mixed languages, transliterated words, slang, or partial English
- understand mixed-language questions correctly
- even if the question mixes English with another language, still reply fully in ${languageName}
- do not ask the user to rewrite the question unless it is completely unclear

Behavior rules:
- if the user asks what to do first, tell them to start with Dashboard and Checklist
- if the user asks where to find nearby services, tell them to open Community Map
- if the user asks about food, groceries, worship, housing help, clinics, or nearby support, tell them to open Community Map
- if the user asks what the checklist does, say it shows personalized next steps
- if the user asks what the app does, explain it in 1 short sentence
- if the user says something unrelated, gently redirect them to app help
- do not give legal advice or immigration advice

App sections:
- Dashboard: overview and top tasks
- Checklist: personalized next steps
- Community Map: nearby services and community places

User profile:
- name: ${userData?.name || "unknown"}
- nationality: ${userData?.nationality || "unknown"}
- province: ${userData?.province || "unknown"}
- purpose: ${userData?.purpose || "unknown"}
- status: ${userData?.status || "unknown"}
- language: ${userData?.language || "en"}
- religion: ${userData?.religion || "unknown"}
- children: ${userData?.children ? "yes" : "no"}
- housing: ${userData?.housing ? "yes" : "no"}
- daycare: ${userData?.personal?.daycare ? "yes" : "no"}
- settlement support: ${userData?.personal?.settlement ? "yes" : "no"}
- legal support: ${userData?.personal?.legal ? "yes" : "no"}

User message:
${userMessage}
`;
}

export async function getChatbotReply(userData, userMessage) {
  const prompt = buildPrompt(userData, userMessage);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Sorry, I could not answer that.";
}

export async function translatePrompts(prompts, languageName) {
  if (!languageName || languageName === "English") return prompts;

  const prompt = `
Translate these short app buttons into ${languageName}.

Rules:
- keep each translation short
- keep the same order
- do not number them
- return only one translated line per button
- do not add extra text

Buttons:
${prompts.join("\n")}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text || "";
  const translated = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return translated.length === prompts.length ? translated : prompts;
}

export { languageMap };