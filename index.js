const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

function convertToMarathiStyle(text) {
  const consonants = {
    k: "क", kh: "ख", g: "ग", gh: "घ",
    ch: "च", j: "ज",
    t: "त", th: "थ", d: "द", dh: "ध",
    n: "न", p: "प", ph: "फ", b: "ब", bh: "भ",
    m: "म", y: "य", r: "र", l: "ल",
    v: "व", w: "व", s: "स", sh: "श",
    h: "ह"
  };

  const vowels = {
    a: "",
    aa: "ा",
    i: "ि",
    ee: "ी",
    u: "ु",
    oo: "ू",
    e: "े",
    ai: "ै",
    o: "ो",
    au: "ौ"
  };

  const independentVowels = {
    a: "अ",
    aa: "आ",
    i: "इ",
    ee: "ई",
    u: "उ",
    oo: "ऊ",
    e: "ए",
    ai: "ऐ",
    o: "ओ",
    au: "औ"
  };

  text = text.toLowerCase().trim();
  let result = "";
  let i = 0;

  while (i < text.length) {
    let two = text.substring(i, i + 2);
    let one = text[i];

    let consonant = consonants[two] ? two : consonants[one] ? one : null;

    if (consonant) {
      let marathiChar = consonants[consonant];
      i += consonant.length;

      let nextTwo = text.substring(i, i + 2);
      let nextOne = text[i];

      if (vowels[nextTwo] !== undefined) {
        marathiChar += vowels[nextTwo];
        i += 2;
      } else if (vowels[nextOne] !== undefined) {
        if (nextOne === "i" && i === text.length - 1) {
          marathiChar += "ी";
        } else {
          marathiChar += vowels[nextOne];
        }
        i++;
      }

      result += marathiChar;
    } else if (independentVowels[two]) {
      result += independentVowels[two];
      i += 2;
    } else if (independentVowels[one]) {
      result += independentVowels[one];
      i++;
    } else {
      result += one;
      i++;
    }
  }

  return result;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/convert", (req, res) => {
  const text = req.body.text;

  if (!text || !text.trim()) {
    return res.json({ message: "Please enter text" });
  }

  const marathiOutput = convertToMarathiStyle(text);

  res.json({ marathi: marathiOutput });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
