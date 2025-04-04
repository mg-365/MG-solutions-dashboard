const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

app.post("/api/keywords", async (req, res) => {
    const keyword = req.body.keyword;
    if (!keyword) {
        return res.status(400).json({ error: "Keyword is required" });
    }

    try {
        const prompt = `Give me 5 related keywords for: "${keyword}", each with estimated CPC (USD), blog volume (number of posts), and entry difficulty score (0~1). Return only valid and meaningful keywords in this JSON format:
[
  { "keyword": "example", "cpc": "1.23", "volume": "8500", "score": "0.75" }
]`;

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const raw = response.data.choices?.[0]?.message?.content || "[]";
        const data = JSON.parse(raw);
        res.json(data);
    } catch (error) {
        console.error("OpenAI API error:", error.message);
        res.status(500).json({ error: "Failed to fetch keyword insights" });
    }
});

app.get("/", (_, res) => {
    res.send("Keyword Analysis API is running.");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
