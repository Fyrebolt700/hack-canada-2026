import { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserData } from "../hooks/useUserData";
import { getChatbotReply, translatePrompts, languageMap } from "../services/geminiService";

const greetingMap = {
    en: "Hi! I can help you use the app.",
    es: "¡Hola! Puedo ayudarte a usar la aplicación.",
    fr: "Bonjour ! Je peux vous aider à utiliser l'application.",
    ar: "مرحبًا! يمكنني مساعدتك في استخدام التطبيق.",
    hi: "नमस्ते! मैं आपको ऐप इस्तेमाल करने में मदद कर सकता हूँ।",
    ur: "سلام! میں آپ کو ایپ استعمال کرنے میں مدد کر سکتا ہوں۔",
    pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਨੂੰ ਐਪ ਵਰਤਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
    zh: "你好！我可以帮助你使用这个应用。",
    vi: "Xin chào! Tôi có thể giúp bạn sử dụng ứng dụng.",
    ko: "안녕하세요! 앱 사용을 도와드릴 수 있습니다.",
    ja: "こんにちは！アプリの使い方をお手伝いします。",
    ru: "Здравствуйте! Я могу помочь вам пользоваться приложением.",
    pt: "Olá! Posso ajudar você a usar o aplicativo.",
    tr: "Merhaba! Uygulamayı kullanmanıza yardımcı olabilirim.",
    de: "Hallo! Ich kann Ihnen helfen, die App zu benutzen.",
    it: "Ciao! Posso aiutarti a usare l'app.",
    tl: "Hello! Matutulungan kitang gamitin ang app.",
    th: "สวัสดี! ฉันช่วยคุณใช้แอปได้",
    bn: "হ্যালো! আমি আপনাকে অ্যাপ ব্যবহার করতে সাহায্য করতে পারি।",
    fa: "سلام! می‌توانم به شما در استفاده از برنامه کمک کنم.",
    am: "ሰላም! መተግበሪያውን እንዴት መጠቀም እንደሚቻል እረዳዎታለሁ።",
    so: "Salaan! Waxaan kaa caawin karaa sida loo isticmaalo app-ka.",
};

const placeholderMap = {
    en: "Ask in English or your own language...",
    hi: "अपनी भाषा में पूछें...",
    es: "Pregunta en tu idioma...",
    fr: "Posez votre question dans votre langue...",
    ar: "اسأل بلغتك...",
    ur: "اپنی زبان میں پوچھیں...",
    pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੁੱਛੋ...",
    zh: "请用你的语言提问...",
    vi: "Hãy hỏi bằng ngôn ngữ của bạn...",
    ko: "원하는 언어로 물어보세요...",
    ja: "あなたの言語で質問してください...",
    ru: "Задайте вопрос на своем языке...",
    pt: "Pergunte no seu idioma...",
    tr: "Kendi dilinizde sorun...",
    de: "Fragen Sie in Ihrer Sprache...",
    it: "Fai una domanda nella tua lingua...",
    tl: "Magtanong sa iyong wika...",
    th: "ถามเป็นภาษาของคุณได้เลย...",
    bn: "আপনার ভাষায় জিজ্ঞাসা করুন...",
    fa: "به زبان خودتان بپرسید...",
    am: "በቋንቋዎ ይጠይቁ...",
    so: "Ku weydii luqaddaada...",
};

const basePrompts = [
    "What should I do first?",
    "Explain the checklist",
    "How do I use the map?",
    "Where can I find housing help?",
];

export default function ChatbotPage() {
    const { userData, loading: userLoading } = useUserData();
    const lang = userData?.language || "en";

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestedPrompts, setSuggestedPrompts] = useState(basePrompts);
    const chatEndRef = useRef(null);

    // Set greeting once userData loads
    useEffect(() => {
        if (userData) {
            setMessages([{
                role: "assistant",
                text: greetingMap[lang] || greetingMap.en,
            }]);
        }
    }, [userData]);

    // Translate quick prompts
    useEffect(() => {
        if (!userData) return;
        async function loadPrompts() {
            const languageName = languageMap[lang]?.name || "English";
            try {
                const translated = await translatePrompts(basePrompts, languageName);
                setSuggestedPrompts(translated);
            } catch {
                setSuggestedPrompts(basePrompts);
            }
        }
        loadPrompts();
    }, [userData]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (messageText) => {
        const text = messageText || input;
        if (!text.trim()) return;

        const userMessage = { role: "user", text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const reply = await getChatbotReply(userData, text);
            setMessages([...updatedMessages, { role: "assistant", text: reply }]);
        } catch {
            setMessages([...updatedMessages, { role: "assistant", text: "Something went wrong. Try again." }]);
        } finally {
            setLoading(false);
        }
    };

    if (userLoading) return (
        <p style={{ color: '#9ca3af' }} className="font-light">Loading...</p>
    );

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 style={{ color: '#1a1a1a' }} className="text-5xl font-light">
                    Settlement Assistant
                </h1>
                <p style={{ color: '#6b6b6b' }} className="text-base font-light tracking-wide">
                    Get quick help using the app.
                </p>
                <span
                    style={{ backgroundColor: '#e8e4d9', color: '#6b6b6b' }}
                    className="text-xs font-light tracking-wide px-4 py-2 rounded-full self-start"
                >
                    🌍 {languageMap[lang]?.name || "English"} ({languageMap[lang]?.native || "English"})
                </span>
            </div>

            {/* Chat box */}
            <div
                style={{ border: '1px solid #e8e4d9', backgroundColor: '#ffffff' }}
                className="rounded-3xl p-6 flex flex-col gap-3 min-h-96 max-h-96 overflow-y-auto"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            style={{
                                backgroundColor: message.role === "user" ? '#A50E06' : '#FAF9F2',
                                color: message.role === "user" ? '#FAF9F2' : '#1a1a1a',
                                border: message.role === "assistant" ? '1px solid #e8e4d9' : 'none',
                            }}
                            className="max-w-lg px-5 py-3 rounded-2xl text-sm font-light leading-relaxed"
                        >
                            {message.text}
                        </div>
                    </div>
                ))}

                {loading && (
                    <p style={{ color: '#9ca3af' }} className="text-sm font-light">
                        Assistant is typing...
                    </p>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input row */}
            <div className="flex flex-row gap-3">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                    placeholder={placeholderMap[lang] || placeholderMap.en}
                    style={{ border: '1px solid #e8e4d9', backgroundColor: '#FAF9F2', color: '#1a1a1a' }}
                    className="flex-1 px-5 py-4 rounded-2xl text-sm font-light focus:outline-none"
                />
                <button
                    onClick={() => sendMessage()}
                    style={{ backgroundColor: '#A50E06', color: '#FAF9F2' }}
                    className="px-8 py-4 rounded-2xl text-sm font-light tracking-widest uppercase hover:opacity-80 transition-opacity"
                >
                    Send
                </button>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-row flex-wrap gap-3">
                {suggestedPrompts.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        style={{ border: '1px solid #e8e4d9', color: '#6b6b6b', backgroundColor: '#FAF9F2' }}
                        className="px-4 py-2 rounded-full text-sm font-light hover:border-red-800 transition-all"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

        </div>
    );
}