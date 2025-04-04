const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/keywords", async (req, res) => {
  const keyword = req.body.keyword;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please analyze related keywords for: ${keyword}
Provide result in this format (5 keywords):

Keyword: diet
CPC: $1.25
Blog Volume: 11,000 posts
Entry Score: 0.81`,
        },
      ],
    });

    res.json(completion);
  } catch (error) {
    console.error("GPT Error:", error);
    res.status(500).json({ error: "Something went wrong with GPT API" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
