/**
 * Convert speech audio blob to text using ElevenLabs Speech-to-Text API.
 * @param {Blob} audioBlob - The audio recording blob
 * @returns {Promise<string>} - Transcribed text
 */
export async function speechToText(audioBlob) {
    try {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
            method: "POST",
            headers: {
                "xi-api-key": apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs STT error:", errorText);
            throw new Error("Speech to text failed");
        }

        const data = await response.json();
        return data.text || "";
    } catch (error) {
        console.error("speechToText error:", error);
        throw new Error("Sorry, I couldn't understand that. Please try again!");
    }
}
