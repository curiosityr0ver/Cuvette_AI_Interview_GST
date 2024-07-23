const express = require('express');
const { generateContent } = require('../utils/gemini_model');

const router = express.Router();
const newAnswerPrompt =
    "\nRate and review each of the answers on a scale of [1-10]\n\nUsing this JSON schema:\n\n  Ratings = {\"rating\": number, \n\"remark\": string }\n\nReturn a `list[Rating]`\n      ";


router.post('/dev', async (req, res) => {
    const { payload } = req.body;

    const response = await generateContent(newAnswerPrompt, JSON.stringify(payload));
    res.json(response);
});

module.exports = router;
