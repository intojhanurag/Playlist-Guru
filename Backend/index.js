const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getPlaylistDuration } = require('./youtube');





// After require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post('/generate-timetable', async (req, res) => {
  const { playlistUrl, days, schedule, depth } = req.body;

  const playlistId = new URL(playlistUrl).searchParams.get('list');
  if (!playlistId) return res.status(400).json({ error: 'Invalid playlist URL' });

  try {
    const playlistLength = await getPlaylistDuration(playlistId);

    const prompt = `
You are an expert study planner. Create a 7-day study timetable based on:

- Playlist duration: ${playlistLength} hours
- Days to finish: ${days}
- Weekly schedule: ${schedule}
- Learning depth: ${depth ? 'In-depth' : 'Quick overview'}

Balance content evenly, add breaks, and don't overload the user.
`;

    const model = genAI.getGenerativeModel({ model: 'gemeni-2.0-flash' });
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const timetable = await response.text();

    res.json({ timetable });

  } catch (err) {
    console.error('[Gemini Error]:', err.message);
    res.status(500).json({ error: 'Something went wrong while generating the plan' });
  }
});


app.listen(3001, () => console.log('Server running on http://localhost:3001'));
