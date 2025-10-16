require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(express.json()); // allows parsing JSON in request body
app.use(cors()); // allow requests from your Chrome extension

const PORT = process.env.PORT || 3000;

app.post('/ai/suggest', async (req, res) => {
  const { text, site } = req.body;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: `Improve this text for ${site}: ${text}`
        })
      }
    );

    // Parse the response and extract suggestion **inside try**
    const data = await response.json();
    const suggestion = data?.content?.trim() || 'Could not generate suggestion';

    // Send the suggestion back to the Chrome extension
    res.json({ suggestion });

  } catch (err) {
    console.error('Error calling Gemini API:', err);
    res.status(500).json({ suggestion: 'Error generating suggestion' });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
