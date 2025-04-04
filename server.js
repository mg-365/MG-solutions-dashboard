const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

// GPT API 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 미들웨어
app.use(cors());
app.use(bodyParser.json());

// ✅ index.html 같은 정적 파일을 서빙
app.use(express.static(path.join(__dirname)));

// API 엔드포인트
app.post("/api/keywords", async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const messages = [{
      role: "user",
      content: `Please analyze related keywords for: ${keyword}
Please return result in this JSON format:

[
  { "keyword": "diet", "cpc": "$1.25", "volume": "11,000 posts", "score": "0.81" },
  { "keyword": "nutrition", "cpc": "$1.10", "volume": "9,500 posts", "score": "0.67" },
  ...
]`
    }];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });

    res.json(completion.data);
  } catch (err) {
    console.error("Error in /api/keywords:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
