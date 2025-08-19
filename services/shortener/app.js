const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener"
);

// Shorten URL endpoint
app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
    }

    // Generate short code
    const shortCode = nanoid(8);

    url = new Url({ originalUrl, shortCode });
    await url.save();

    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all URLs
app.get("/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => console.log("Shortener service running on port 3001"));
