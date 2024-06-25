const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const multer = require('multer');
const fs = require('fs');
const userRoute = require('./controllers/userRoute');
const quizRoute = require('./controllers/quizRoute');
const sampleRoute = require('./controllers/sampleRoute');
const { transcribeAudio } = require('./controllers/cloudController');
const { handleAudioSubmission } = require('./controllers/audioController');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;


// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Server is running');
});


app.use('/intro', userRoute);
app.use('/quiz', quizRoute);
app.post('/cloud', upload.single('audio'), transcribeAudio);


app.use(express.static(path.join(__dirname, 'public')));

// Serve React application for any routes not handled by the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
