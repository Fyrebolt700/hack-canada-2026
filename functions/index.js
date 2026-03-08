const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

setGlobalOptions({ maxInstances: 10 });

const geminiApiKey = defineSecret("GEMINI_API_KEY");

async function fetchWithBackoff(url, options, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        const response = await fetch(url, options);
        if (response.status === 429) {
            attempt++;
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            console.log(`[Gemini] 429 received. Retrying in ${delay / 1000}s... (Attempt ${attempt})`);
            await new Promise(res => setTimeout(res, delay));
            continue;
        }
        return response;
    }
    throw new Error(`Failed after ${maxRetries} attempts due to 429 Too Many Requests`);
}

exports.askGemini = onCall({ secrets: [geminiApiKey] }, async (request) => {
    const { userMessage, userData, chatHistory, selectedLanguage } = request.data;

    if (!userMessage) {
        throw new HttpsError("invalid-argument", "The function must be called with a userMessage.");
    }

    // Shortened system prompt
    const systemPrompt = `You are a warm, patient Canadian settlement assistant. User: ${userData?.name || "friend"}, Province: ${userData?.province || "Canada"}. Needs: ${userData?.needs?.join(", ") || "general help"}. Keep it very short, clear, and empathetic. Always reply in ${selectedLanguage || "English"}. No legal advice.`;

    // Limit history to last 6 turns
    const validHistory = (chatHistory || [])
        .filter(msg => msg.role === "user" || msg.role === "assistant");

    // Ensure last 6 turns
    let historyToUse = validHistory.slice(-6);
    // Must start with a user message contextually
    if (historyToUse.length > 0 && historyToUse[0].role === "assistant") {
        historyToUse = historyToUse.slice(1);
    }

    const historyContents = historyToUse.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.text }],
    }));

    const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood! I'm ready to help." }] },
        ...historyContents,
        { role: "user", parts: [{ text: userMessage }] },
    ];

    const apiKey = geminiApiKey.value();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetchWithBackoff(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Gemini] Error ${response.status}:`, errorBody);
        throw new HttpsError("internal", "Error contacting Gemini API.");
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new HttpsError("internal", "No text in Gemini response");
    }

    return { response: text };
});
