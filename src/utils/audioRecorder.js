/**
 * Request microphone and start recording.
 * @returns {Promise<MediaRecorder>} - The active MediaRecorder instance
 */
export async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        const chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        // Store chunks on the recorder object so stopRecording can access them
        recorder._chunks = chunks;
        recorder._stream = stream;

        recorder.start();
        return recorder;
    } catch (error) {
        console.error("startRecording error:", error);
        if (error.name === "NotAllowedError") {
            throw new Error(
                "Microphone access was denied. Please allow microphone access in your browser settings."
            );
        }
        throw new Error("Could not start recording. Please check your microphone.");
    }
}

/**
 * Stop recording and return the audio blob.
 * @param {MediaRecorder} recorder - The active recorder from startRecording()
 * @returns {Promise<Blob>} - The recorded audio blob
 */
export function stopRecording(recorder) {
    return new Promise((resolve, reject) => {
        try {
            recorder.onstop = () => {
                const blob = new Blob(recorder._chunks, { type: "audio/webm" });
                // Stop all tracks to release mic
                recorder._stream.getTracks().forEach((track) => track.stop());
                resolve(blob);
            };
            recorder.stop();
        } catch (error) {
            console.error("stopRecording error:", error);
            reject(new Error("Could not stop recording."));
        }
    });
}
