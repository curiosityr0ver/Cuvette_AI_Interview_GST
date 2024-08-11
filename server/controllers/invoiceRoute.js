const express = require('express');
const multer = require('multer');
const { generateContent: processor } = require('../utils/gemini_model');
const { generateContent } = require('../utils/llama_model');
const pdfParse = require('pdf-parse');
const PDFParser = require("pdf2json");


const router = express.Router();

// Multer storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// POST route to upload file and user data
router.post('/', upload.single('invoice'), async (req, res) => {
    try {
        const dataBuffer = req?.file?.buffer;
        if (dataBuffer) {
            // const data = await pdfParse(dataBuffer);
            const pdfParser = new PDFParser();
            pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));


            const text = data.text;
            // const extract = await processor("extract the invoice into a json object", text);
            const response = await generateContent(text);
            res.status(201).json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;;
