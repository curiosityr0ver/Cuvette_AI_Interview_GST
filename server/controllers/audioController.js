const fs = require('fs');

exports.handleAudioSubmission = (req, res) => {
    try {
        // Get the audio files from the request
        const audioFiles = req.files;

        console.log('Received audio files:', audioFiles);

        // Process the data as needed (e.g., save to database)

        // Send a response back to the client
        res.status(200).json({
            message: 'Audio submission successful',
            audioFiles: audioFiles.map(file => ({
                originalname: file.originalname,
                path: file.path,
            })),
        });
    } catch (error) {
        console.error('Error handling audio submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
