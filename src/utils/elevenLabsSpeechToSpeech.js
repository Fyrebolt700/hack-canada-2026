/**
 * Send audio to ElevenLabs Speech-to-Speech and get spoken response audio.
 * @param {Blob} audioBlob - The user's audio recording
 * @returns {Promise<string>} - Blob URL of spoken audio response
 */
export async function speechToSpeech(audioBlob) {
    try {
        const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("model_id", "eleven_multilingual_v2");
        formData.append(
            "voice_settings",
            JSON.stringify({ stability: 0.5, similarity_boost: 0.75 })
        );

        const response = await fetch(
            `https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}`,
            {
                method: "POST",
                headers: {
                    "xi-api-key": apiKey,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ElevenLabs S2S error:", errorText);
            throw new Error("Speech to speech failed");
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("speechToSpeech error:", error);
        throw new Error("Sorry, I had trouble with voice mode. Please try again!");
    }
}
