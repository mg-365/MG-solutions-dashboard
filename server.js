// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/keywords', async (req, res) => {
  const keyword = req.body.keyword;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Please analyze related keywords for: ${keyword}
Return result in this format (5 keywords):

Keyword: diet
CPC: $1.25
Blog Volume: 11,000 posts
Entry Score: 0.81`
        }]
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No result.";
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
