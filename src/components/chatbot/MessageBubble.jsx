import React, { useState } from "react";

const styles = {
    wrapper: {
        display: "flex",
        marginBottom: "2px",
    },
    wrapperUser: {
        justifyContent: "flex-end",
    },
    wrapperAssistant: {
        justifyContent: "flex-start",
    },
    bubbleContainer: {
        position: "relative",
        maxWidth: "72%",
    },
    bubble: {
        borderRadius: "20px",
        padding: "12px 16px",
        lineHeight: "1.55",
        fontSize: "15px",
        boxShadow: "0 2px 10px rgba(92, 125, 92, 0.12)",
        animation: "fadeSlideUp 0.35s ease forwards",
        wordBreak: "break-word",
        whiteSpace: "pre-wrap",
    },
    bubbleUser: {
        backgroundColor: "#7c9e7e",
        color: "#ffffff",
        borderRadius: "20px 20px 4px 20px",
    },
    bubbleAssistant: {
        backgroundColor: "#f0f4f0",
        color: "#2d3b2e",
        borderRadius: "20px 20px 20px 4px",
    },
    timestamp: {
        fontSize: "11px",
        color: "#7a8f7b",
        marginTop: "4px",
        paddingLeft: "4px",
        paddingRight: "4px",
    },
    timestampUser: {
        textAlign: "right",
    },
    timestampAssistant: {
        textAlign: "left",
    },
    speakBtn: {
        position: "absolute",
        bottom: "-10px",
        right: "8px",
        background: "#f4f7f4",
        border: "1px solid #c8d9c8",
        borderRadius: "12px",
        padding: "2px 8px",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 4px rgba(92,125,92,0.15)",
        color: "#5a7d5c",
        opacity: 0,
        pointerEvents: "none",
    },
    speakBtnVisible: {
        opacity: 1,
        pointerEvents: "auto",
    },
    speakBtnLoading: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
};

const keyframes = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function formatTime(timestamp) {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, onSpeak }) {
    const [hovered, setHovered] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const isUser = message.role === "user";

    const handleSpeak = async () => {
        if (speaking) return;
        setSpeaking(true);
        try {
            await onSpeak(message.text);
        } finally {
            setSpeaking(false);
        }
    };

    return (
        <>
            <style>{keyframes}</style>
            <div
                style={{
                    ...styles.wrapper,
                    ...(isUser ? styles.wrapperUser : styles.wrapperAssistant),
                }}
            >
                <div
                    style={styles.bubbleContainer}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <div
                        style={{
                            ...styles.bubble,
                            ...(isUser ? styles.bubbleUser : styles.bubbleAssistant),
                        }}
                    >
                        {message.text}
                    </div>

                    {!isUser && (
                        <button
                            onClick={handleSpeak}
                            style={{
                                ...styles.speakBtn,
                                ...(hovered ? styles.speakBtnVisible : {}),
                                ...(speaking ? styles.speakBtnLoading : {}),
                            }}
                            title="Listen"
                            aria-label="Read aloud"
                        >
                            {speaking ? "⏳" : "🔊"}
                        </button>
                    )}

                    <div
                        style={{
                            ...styles.timestamp,
                            ...(isUser ? styles.timestampUser : styles.timestampAssistant),
                        }}
                    >
                        {formatTime(message.timestamp)}
                    </div>
                </div>
            </div>
        </>
    );
}
