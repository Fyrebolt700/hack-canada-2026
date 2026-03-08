/**
 * Convert text to speech using ElevenLabs API.
 * @param {string} text - The text to convert to speech
 * @returns {Promise<string>} - Blob URL for audio playback
 */
export async function textToSpeech(text) {
    try {
        const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_multilingual_v2",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs TTS error:", errorText);
            throw new Error("Text to speech failed");
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("textToSpeech error:", error);
        throw new Error("Sorry, I had trouble speaking that. Please try again!");
    }
}
