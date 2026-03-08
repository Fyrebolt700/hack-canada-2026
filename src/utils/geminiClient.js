import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function sendMessageToGemini(userMessage, userData, chatHistory, selectedLanguage) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `You are a warm, patient, and knowledgeable settlement assistant for WelcomeHome, a Canadian immigration aid app.

Here is information about the user you are helping:
- Name: ${userData?.name || "friend"}
- Province: ${userData?.province || "Canada"}
- Immigration Status: ${userData?.status || "unknown"}
- Purpose: ${userData?.purpose || "not specified"}
- Nationality: ${userData?.nationality || "not specified"}
- Religion: ${userData?.religion || "not specified"}
- Language preference: ${userData?.language || "English"}
- Children ages: ${userData?.children?.join(", ") || "none"}
- Needs daycare: ${userData?.needsDaycare ? "yes" : "no"}
- Needs help with: ${userData?.needs?.join(", ") || "general settlement"}

Be warm, patient and simple. Give practical Canadian settlement advice. Reference Service Canada, IRCC, 211 Ontario. Never give legal advice. Keep responses short and clear. Always respond in ${selectedLanguage || "English"}.`;

        const priorMessages = chatHistory.filter(
            (msg) => msg.role === "user" || msg.role === "assistant"
        );

        const firstUserIdx = priorMessages.findIndex((msg) => msg.role === "user");
        const validMessages = firstUserIdx > 0 ? priorMessages.slice(firstUserIdx) : priorMessages;

        const history = validMessages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Understood! I'm ready to help." }] },
                ...history
            ],
        });

        const result = await chat.sendMessage(userMessage);
        return result.response.text();

    } catch (error) {
        console.error("[Gemini] Error:", error);
        throw new Error("Sorry, I had a little trouble with that. Please try again!");
    }
}