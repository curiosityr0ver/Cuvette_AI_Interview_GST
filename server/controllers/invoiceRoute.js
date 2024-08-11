const express = require('express');
const multer = require('multer');
const { generateContent } = require('../utils/llama_model');
const fs = require('fs');
// const pdfParse = require('pdf-parse');
const PDFParser = require("pdf2json");


const router = express.Router();

// Multer storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// POST route to upload file and user data
router.post('/', upload.single('invoice'), async (req, res) => {
    let pdfText;
    try {
        const dataBuffer = req?.file?.buffer;
        if (dataBuffer) {
            const pdfParser = new PDFParser();

            pdfParser.parseBuffer(dataBuffer);
            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                pdfText = pdfData.Pages[0].Texts.map(text => text.R.map(r => decodeURIComponent(r.T)).join('')).join(' ');
                generateContent(pdfText).then((response) => {
                    res.send({
                        input: pdfText,
                        output: response
                    });
                });
            });

        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});


router.post('/alt', upload.single('invoice'), async (req, res) => {
    try {
        const file = req.file.buffer;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        // Read and parse the PDF
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);

        // Get the raw text from the PDF
        const rawText = pdfData.text;

        // Optional: Remove the uploaded file
        fs.unlinkSync(file.path);

        // Send the raw text as a response
        res.send(rawText);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing PDF.');
    }
});

module.exports = router;;
