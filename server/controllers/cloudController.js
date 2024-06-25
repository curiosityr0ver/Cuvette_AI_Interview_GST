const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

// Initialize the Google Speech client
const speechClient = new SpeechClient();

const transcribeAudio = async (req, res) => {
    console.log("Transcribing audio...");
    const filePath = req.file.path;

    const audioBytes = fs.readFileSync(filePath).toString('base64');

    const request = {
        audio: { content: audioBytes },
        config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,  // Set to 48000 to match the WEBM OPUS header
            languageCode: 'en-IN',
        },
    };

    try {
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        res.json({ transcript: transcription });
    } catch (error) {
        console.error('Error during transcription:', error);
        res.status(500).send(error);
    } finally {
        fs.unlinkSync(filePath);
    }
};

module.exports = {
    transcribeAudio
};
