const express = require("express");
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const invoiceRoute = require('./controllers/invoiceRoute');
const { transcribeAudioHandler, upload } = require('./controllers/transcribeController');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server running');
});

app.use('/invoice', invoiceRoute);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.clear();
    console.log(`Server running on port ${port}`);
});
