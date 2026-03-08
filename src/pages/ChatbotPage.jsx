import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sendMessageToGemini } from "../utils/geminiClient";
import { textToSpeech } from "../utils/elevenLabsClient";
import { speechToText } from "../utils/elevenLabsSpeechToText";
import { speechToSpeech } from "../utils/elevenLabsSpeechToSpeech";
import { startRecording, stopRecording } from "../utils/audioRecorder";
import ChatWindow from "../components/chatbot/ChatWindow";
import LanguageSelector from "../components/chatbot/LanguageSelector";
import VoiceModeToggle from "../components/chatbot/VoiceModeToggle";

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        backgroundColor: "#f4f7f4",
        fontFamily: "'DM Sans', sans-serif",
        color: "#2d3b2e",
        overflow: "hidden",
    },

    // Header
    header: {
        backgroundColor: "#e8efe8",
        borderBottom: "1px solid #c8d9c8",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(92,125,92,0.08)",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    leafIcon: {
        fontSize: "22px",
        animation: "sway 4s ease-in-out infinite",
    },
    headerTitle: {
        fontFamily: "'Lora', serif",
        fontSize: "20px",
        fontWeight: "600",
        color: "#2d3b2e",
        margin: 0,
    },
    headerSubtitle: {
        fontSize: "12px",
        color: "#7a8f7b",
        margin: 0,
        marginTop: "1px",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    // Loading screen
    loadingScreen: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "#7a8f7b",
        fontSize: "15px",
    },
    loadingSpinner: {
        width: "36px",
        height: "36px",
        border: "3px solid #c8d9c8",
        borderTopColor: "#5a7d5c",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },

    // Chat area
    chatArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },

    // Input bar
    inputArea: {
        backgroundColor: "#f4f7f4",
        borderTop: "1px solid #c8d9c8",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexShrink: 0,
    },
    inputForm: {
        display: "flex",
        flex: 1,
        gap: "10px",
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        border: "1.5px solid #b8d0b9",
        borderRadius: "24px",
        padding: "11px 18px",
        fontSize: "15px",
        fontFamily: "'DM Sans', sans-serif",
        color: "#2d3b2e",
        backgroundColor: "#ffffff",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        resize: "none",
    },
    sendBtn: {
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        backgroundColor: "#5a7d5c",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        flexShrink: 0,
        transition: "background-color 0.2s, transform 0.1s",
        color: "#fff",
    },
    micBtn: {
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        flexShrink: 0,
        transition: "all 0.2s",
        backgroundColor: "#e8efe8",
        color: "#5a7d5c",
    },
    micBtnRecording: {
        backgroundColor: "#c97d5a",
        color: "#fff",
        animation: "micPulse 1s ease-in-out infinite",
        boxShadow: "0 0 0 4px rgba(201,125,90,0.3)",
    },

    // Voice mode big mic
    voiceModeArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "30px",
    },
    bigMicBtn: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        fontSize: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        backgroundColor: "#5a7d5c",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(90,125,92,0.3)",
    },
    bigMicBtnRecording: {
        backgroundColor: "#c97d5a",
        animation: "micPulse 1s ease-in-out infinite",
        boxShadow: "0 0 0 12px rgba(201,125,90,0.2), 0 4px 20px rgba(201,125,90,0.4)",
    },
    voiceModeLabel: {
        fontSize: "15px",
        color: "#7a8f7b",
        textAlign: "center",
    },
    voiceModeHistory: {
        flex: 1,
        overflow: "hidden",
        width: "100%",
    },

    // Hidden audio
    hiddenAudio: {
        display: "none",
    },
};

const globalKeyframes = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Lora:wght@600&display=swap');

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes sway {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
@keyframes micPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.07); }
}
`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function ChatbotPage() {
    const [userData, setUserData] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [audioUrl, setAudioUrl] = useState(null);

    const recorderRef = useRef(null);
    const audioRef = useRef(null);

    // ── Fetch user on mount ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const docRef = doc(db, "users", "testuser123");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    setSelectedLanguage(data.language || "English");

                    // Welcome message
                    const welcome = {
                        role: "assistant",
                        text: `Welcome to WelcomeHome, ${data.name || "friend"}! 🌿 I'm here to help you settle in Canada. I can see you're from ${data.nationality || "your home country"} and living in ${data.province || "Canada"}. Ask me anything — housing, healthcare, schools, legal status, or just where to find food from home.`,
                        timestamp: Date.now(),
                    };
                    setMessages([welcome]);
                } else {
                    throw new Error("No user document found");
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
                setMessages([
                    {
                        role: "assistant",
                        text: "Welcome to WelcomeHome! 🌿 I'm here to help you settle in Canada. Ask me anything about housing, healthcare, schools, or more.",
                        timestamp: Date.now(),
                    },
                ]);
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchUser();
    }, []);

    // ── Play audio whenever audioUrl changes ────────────────────────────────
    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch((e) => console.error("Audio play error:", e));
        }
    }, [audioUrl]);

    // ── Add a message helper ─────────────────────────────────────────────────
    const addMessage = (role, text) => {
        const msg = { role, text, timestamp: Date.now() };
        setMessages((prev) => [...prev, msg]);
        return msg;
    };

    // ── Send text message ────────────────────────────────────────────────────
    const handleSend = async (textOverride) => {
        const text = (textOverride ?? input).trim();
        if (!text || isLoading) return;
        setInput("");

        addMessage("user", text);
        setIsLoading(true);

        try {
            // Build history: exclude the welcome message (leading assistant turn)
            // and the new user message we're about to send — Gemini receives that
            // via sendMessage() and must not also appear in history.
            const firstUserIdx = messages.findIndex((m) => m.role === "user");
            const chatHistory = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : [];
            const reply = await sendMessageToGemini(text, userData, chatHistory, selectedLanguage);
            addMessage("assistant", reply);
        } catch (err) {
            addMessage("assistant", "Sorry, I had a little trouble with that. Please try again! 🌿");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Speak assistant message ──────────────────────────────────────────────
    const handleSpeak = async (text) => {
        try {
            const url = await textToSpeech(text);
            setAudioUrl(url);
        } catch (err) {
            console.error("TTS error:", err);
        }
    };

    // ── STT mic recording (text mode) ────────────────────────────────────────
    const handleMicToggle = async () => {
        if (isRecording) {
            // Stop and transcribe
            try {
                setIsRecording(false);
                const blob = await stopRecording(recorderRef.current);
                setIsLoading(true);
                const transcribed = await speechToText(blob);
                if (transcribed && transcribed.trim()) {
                    setInput(transcribed.trim());
                    await handleSend(transcribed.trim());
                } else {
                    addMessage("assistant", "I couldn't quite hear that. Could you try again? 🌿");
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("STT error:", err);
                addMessage("assistant", "Sorry, I had trouble with that. Please try again!");
                setIsLoading(false);
            }
        } else {
            // Start recording
            try {
                const recorder = await startRecording();
                recorderRef.current = recorder;
                setIsRecording(true);
            } catch (err) {
                console.error("Mic error:", err);
                addMessage("assistant", `🎤 ${err.message || "Could not access microphone. Please check permissions."}`);
            }
        }
    };

    // ── Voice mode big mic ───────────────────────────────────────────────────
    const handleVoiceModeToggle = async () => {
        if (isRecording) {
            // Stop if switching modes mid-recording
            try {
                await stopRecording(recorderRef.current);
            } catch (_) { }
            setIsRecording(false);
        }
        setIsVoiceMode((v) => !v);
    };

    const handleBigMicToggle = async () => {
        if (isRecording) {
            // Stop and send speech-to-speech
            try {
                setIsRecording(false);
                const blob = await stopRecording(recorderRef.current);
                setIsLoading(true);

                // Show loading indicator in chat
                addMessage("user", "🎤 [Voice message]");

                const responseAudioUrl = await speechToSpeech(blob);
                setAudioUrl(responseAudioUrl);

                // Also show text response placeholder for accessibility
                addMessage("assistant", "🔊 Voice response played. Switch to text mode to see the full message.");
            } catch (err) {
                console.error("S2S error:", err);
                addMessage("assistant", "Sorry, I had trouble with voice mode. Please try again! 🌿");
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                const recorder = await startRecording();
                recorderRef.current = recorder;
                setIsRecording(true);
            } catch (err) {
                console.error("Mic error:", err);
                addMessage("assistant", `🎤 ${err.message || "Could not access microphone."}`);
            }
        }
    };

    // ── Language switch ──────────────────────────────────────────────────────
    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        addMessage("assistant", `🌿 Language switched to ${lang}. I'll respond in ${lang} from now on.`);
    };

    // ── Keyboard shortcut ────────────────────────────────────────────────────
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <>
            <style>{globalKeyframes}</style>
            <audio ref={audioRef} style={styles.hiddenAudio} />

            <div style={styles.page}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={styles.headerLeft}>
                        <span style={styles.leafIcon}>🌿</span>
                        <div>
                            <h1 style={styles.headerTitle}>WelcomeHome</h1>
                            <p style={styles.headerSubtitle}>Your Canadian Settlement Assistant</p>
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <VoiceModeToggle isVoiceMode={isVoiceMode} onToggle={handleVoiceModeToggle} />
                        <LanguageSelector language={selectedLanguage} onLanguageChange={handleLanguageChange} />
                    </div>
                </header>

                {/* Body */}
                {isLoadingUser ? (
                    <div style={styles.loadingScreen}>
                        <div style={styles.loadingSpinner} />
                        <span>Loading your profile…</span>
                    </div>
                ) : isVoiceMode ? (
                    /* Voice Mode */
                    <div style={styles.chatArea}>
                        {/* Chat history still visible above */}
                        <div style={styles.voiceModeHistory}>
                            <ChatWindow messages={messages} isLoading={isLoading} onSpeak={handleSpeak} />
                        </div>

                        {/* Big mic area */}
                        <div style={{ ...styles.inputArea, flexDirection: "column", gap: "12px" }}>
                            <button
                                onClick={handleBigMicToggle}
                                disabled={isLoading}
                                style={{
                                    ...styles.bigMicBtn,
                                    ...(isRecording ? styles.bigMicBtnRecording : {}),
                                    ...(isLoading ? { opacity: 0.6, cursor: "not-allowed" } : {}),
                                }}
                                aria-label={isRecording ? "Stop recording" : "Start recording"}
                            >
                                {isLoading ? "⏳" : isRecording ? "⏹️" : "🎤"}
                            </button>
                            <p style={styles.voiceModeLabel}>
                                {isLoading
                                    ? "Processing…"
                                    : isRecording
                                        ? "Recording… tap to stop"
                                        : "Tap to speak"}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* Text Mode */
                    <div style={styles.chatArea}>
                        <ChatWindow messages={messages} isLoading={isLoading} onSpeak={handleSpeak} />

                        {/* Input bar */}
                        <div style={styles.inputArea}>
                            <div style={styles.inputForm}>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything about settling in Canada…"
                                    rows={1}
                                    style={styles.textInput}
                                    disabled={isLoading}
                                    aria-label="Type your message"
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#5a7d5c";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(90,125,92,0.15)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#b8d0b9";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />

                                {/* STT mic button */}
                                <button
                                    onClick={handleMicToggle}
                                    disabled={isLoading}
                                    style={{
                                        ...styles.micBtn,
                                        ...(isRecording ? styles.micBtnRecording : {}),
                                        ...(isLoading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                                    }}
                                    aria-label={isRecording ? "Stop recording" : "Start voice input"}
                                    title={isRecording ? "Tap to stop recording" : "Tap to speak"}
                                >
                                    {isRecording ? "⏹️" : "🎤"}
                                </button>

                                {/* Send button */}
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    style={{
                                        ...styles.sendBtn,
                                        ...(isLoading || !input.trim()
                                            ? { opacity: 0.5, cursor: "not-allowed" }
                                            : {}),
                                    }}
                                    aria-label="Send message"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
