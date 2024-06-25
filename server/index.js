const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const userRoute = require('./controllers/userRoute');
const quizRoute = require('./controllers/quizRoute');
const { transcribeAudioHandler, upload } = require('./controllers/transcribeController');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use('/intro', userRoute);
app.use('/quiz', quizRoute);
app.post('/cloud', upload.single('audio'), transcribeAudioHandler);



app.use(express.static(path.join(__dirname, 'public')));
// Serve React application for any routes not handled by the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
