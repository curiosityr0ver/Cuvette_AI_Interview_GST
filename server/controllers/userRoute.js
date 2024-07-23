const express = require('express');
const multer = require('multer');
const User = require('../model/User');
const { generateContent } = require('../utils/gemini_model');
const pdfParse = require('pdf-parse');
const Resume = require('../model/Resume');

const router = express.Router();
const altPrompt = `Parse the given resume and extract information strictly according to given schema ${JSON.stringify(Resume)}`;

// const b = 10;
router.get('/', (req, res) => {
  res.send('Intro Route');
});


// Multer storage configuration
const upload = multer({ storage: multer.memoryStorage() });

// POST route to upload file and user data
router.post('/parse', upload.single('resume'), async (req, res) => {
  let profile = {};
  try {
    const dataBuffer = req?.file?.buffer;
    if (dataBuffer) {
      const data = await pdfParse(dataBuffer);
      const text = data.text;
      profile = await generateContent(altPrompt, text);
    }
    res.status(201).json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

router.post('/register', async (req, res) => {
  const { email, phone, fullName, linkedin, technologies, jobProfile } = req.body;

  const user = new User({
    email,
    phone,
    fullName,
    linkedin,
    technologies,
    jobProfile
  });

  try {
    await user.save();
    res.status(201).json(user);
    console.log("here");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
