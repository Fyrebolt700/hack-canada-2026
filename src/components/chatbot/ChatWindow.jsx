import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const styles = {
    container: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "#ffffff",
        scrollBehavior: "smooth",
    },
    typingBubble: {
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        animation: "fadeSlideUp 0.3s ease forwards",
    },
    typingInner: {
        backgroundColor: "#f0f4f0",
        borderRadius: "20px 20px 20px 4px",
        padding: "14px 18px",
        display: "flex",
        gap: "6px",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(92, 125, 92, 0.1)",
    },
    dot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "#7c9e7e",
        display: "inline-block",
    },
};

const typingKeyframes = `
@keyframes bounce1 {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  30% { transform: translateY(-6px); opacity: 1; }
}
@keyframes bounce2 {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  40% { transform: translateY(-6px); opacity: 1; }
}
@keyframes bounce3 {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-6px); opacity: 1; }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

export default function ChatWindow({ messages, isLoading, onSpeak }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <>
            <style>{typingKeyframes}</style>
            <div style={styles.container}>
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} onSpeak={onSpeak} />
                ))}

                {isLoading && (
                    <div style={styles.typingBubble}>
                        <div style={styles.typingInner}>
                            <span style={{ ...styles.dot, animation: "bounce1 1.2s infinite" }} />
                            <span style={{ ...styles.dot, animation: "bounce2 1.2s infinite" }} />
                            <span style={{ ...styles.dot, animation: "bounce3 1.2s infinite" }} />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </>
    );
}
