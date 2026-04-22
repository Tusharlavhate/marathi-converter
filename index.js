const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Simple character mapping for demo transliteration
const charMap = {
  a: "अ", b: "ब", c: "क", d: "द", e: "ए",
  f: "फ", g: "ग", h: "ह", i: "इ", j: "ज",
  k: "क", l: "ल", m: "म", n: "न", o: "ओ",
  p: "प", q: "क", r: "र", s: "स", t: "त",
  u: "उ", v: "व", w: "व", x: "क्स", y: "य", z: "ज",
  " ": " "
};

function convertToMarathiStyle(text) {
  let result = "";

  for (let ch of text.toLowerCase()) {
    result += charMap[ch] || ch;
  }

  return result;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/convert", (req, res) => {
  const text = req.body.text;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter text"
    });
  }

  const marathiOutput = convertToMarathiStyle(text);

  res.json({
    success: true,
    input: text,
    marathi: marathiOutput
  });
});

app.get("/convert/:text", (req, res) => {
  const text = req.params.text;

  if (!text || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter text"
    });
  }

  const marathiOutput = convertToMarathiStyle(text);

  res.json({
    success: true,
    input: text,
    marathi: marathiOutput
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});