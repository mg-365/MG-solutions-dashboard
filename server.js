const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/keywords", async (req, res) => {
  const userKeyword = req.body.keyword;

  const prompt = `
Please analyze related keywords for: ${userKeyword}
Return 5 relevant keywords and their stats in this format:

Keyword: diet
CPC: $1.25
Blog Volume: 11,000 posts
Entry Score: 0.81
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("GPT fetch error:", error);
    res.status(500).json({ error: "Error fetching keyword data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Keyword Analysis API is running. Please use the frontend at https://zocuna.com.");
});
