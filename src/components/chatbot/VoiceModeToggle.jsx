import React from "react";

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    label: {
        fontSize: "12px",
        color: "#7a8f7b",
        fontFamily: "'DM Sans', sans-serif",
    },
    toggleBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "1.5px solid #b8d0b9",
        borderRadius: "20px",
        padding: "5px 14px",
        fontSize: "13px",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        color: "#2d3b2e",
        backgroundColor: "#e8efe8",
        transition: "all 0.2s ease",
    },
    toggleBtnActive: {
        backgroundColor: "#c97d5a",
        borderColor: "#c97d5a",
        color: "#ffffff",
    },
    dot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: "#5a7d5c",
        display: "inline-block",
    },
    dotActive: {
        backgroundColor: "#fff",
        animation: "pulse 1s infinite",
    },
};

const pulseKeyframes = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}
`;

export default function VoiceModeToggle({ isVoiceMode, onToggle }) {
    return (
        <>
            <style>{pulseKeyframes}</style>
            <div style={styles.container}>
                <span style={styles.label}>{isVoiceMode ? "Voice Mode" : "Text Mode"}</span>
                <button
                    onClick={onToggle}
                    style={{
                        ...styles.toggleBtn,
                        ...(isVoiceMode ? styles.toggleBtnActive : {}),
                    }}
                    aria-label={isVoiceMode ? "Switch to text mode" : "Switch to voice mode"}
                    title={isVoiceMode ? "Switch to text mode" : "Switch to voice mode"}
                    onMouseEnter={(e) => {
                        if (!isVoiceMode) {
                            e.currentTarget.style.borderColor = "#5a7d5c";
                            e.currentTarget.style.backgroundColor = "#d8e8d8";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isVoiceMode) {
                            e.currentTarget.style.borderColor = "#b8d0b9";
                            e.currentTarget.style.backgroundColor = "#e8efe8";
                        }
                    }}
                >
                    <span
                        style={{
                            ...styles.dot,
                            ...(isVoiceMode ? styles.dotActive : {}),
                        }}
                    />
                    {isVoiceMode ? "🎤 Voice" : "💬 Text"}
                </button>
            </div>
        </>
    );
}
