import React from "react";

const LANGUAGES = [
    { code: "English", label: "English", flag: "🇬🇧" },
    { code: "French", label: "French", flag: "🇫🇷" },
    { code: "Hindi", label: "Hindi", flag: "🇮🇳" },
    { code: "Arabic", label: "Arabic", flag: "🇸🇦" },
    { code: "Spanish", label: "Spanish", flag: "🇪🇸" },
    { code: "Punjabi", label: "Punjabi", flag: "🇮🇳" },
    { code: "Urdu", label: "Urdu", flag: "🇵🇰" },
    { code: "Tagalog", label: "Tagalog", flag: "🇵🇭" },
    { code: "Mandarin", label: "Mandarin", flag: "🇨🇳" },
];

const styles = {
    select: {
        appearance: "none",
        WebkitAppearance: "none",
        backgroundColor: "#e8efe8",
        border: "1.5px solid #b8d0b9",
        borderRadius: "20px",
        padding: "6px 14px",
        fontSize: "13px",
        color: "#2d3b2e",
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a7d5c' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        paddingRight: "30px",
    },
};

export default function LanguageSelector({ language, onLanguageChange }) {
    const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

    return (
        <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={styles.select}
            aria-label="Select language"
            onFocus={(e) => {
                e.target.style.borderColor = "#5a7d5c";
                e.target.style.boxShadow = "0 0 0 3px rgba(90,125,92,0.15)";
            }}
            onBlur={(e) => {
                e.target.style.borderColor = "#b8d0b9";
                e.target.style.boxShadow = "none";
            }}
        >
            {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                </option>
            ))}
        </select>
    );
}
