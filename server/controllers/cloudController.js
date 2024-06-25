const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

const credentials = {
    type: process.env.GC_TYPE,
    project_id: process.env.GC_PROJECT_ID,
    private_key_id: process.env.GC_PRIVATE_KEY_ID,
    private_key: process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Handle line breaks
    client_email: process.env.GC_CLIENT_EMAIL,
    client_id: process.env.GC_CLIENT_ID,
    auth_uri: process.env.GC_AUTH_URI,
    token_uri: process.env.GC_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GC_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GC_CLIENT_X509_CERT_URL
};


// Initialize the Google Speech client
const speechClient = new SpeechClient({ credentials });

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
