const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

// ✅ CORS 설정 (zocuna.com에서도 호출 가능하게 허용)
app.use(cors({
  origin: ["https://www.zocuna.com", "http://localhost:3000"],
  methods: ["POST"],
}));

app.use(bodyParser.json());

// ✅ GPT API 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ POST 요청 처리
app.post("/api/keywords", async (req, res) => {
  const keyword = req.body.keyword;

  if (!keyword) {
    return res.status(400).json({ error: "No keyword provided" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Please analyze related keywords for: ${keyword}
Return ONLY a JSON array in this format:

[
  { "keyword": "diet", "cpc": "$1.25", "volume": "11000", "score": "0.81" },
  { "keyword": "supplements", "cpc": "$0.97", "volume": "14000", "score": "0.73" },
  { "keyword": "nutrition", "cpc": "$1.12", "volume": "9000", "score": "0.68" },
  ...
]`
      }],
    });

    const gptReply = completion.data.choices[0].message.content;

    // GPT가 JSON 배열을 텍스트로 주기 때문에 파싱 시도
    const parsed = JSON.parse(gptReply);
    res.json({ keywords: parsed });
  } catch (err) {
    console.error("GPT Error:", err.message);
    res.status(500).json({ error: "Failed to analyze keywords" });
  }
});

// ✅ 기본 응답 (GET / 요청 시 404 방지용)
app.get("/", (req, res) => {
  res.send("Keyword Analysis API is running.");
});

// ✅ 서버 시작
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
