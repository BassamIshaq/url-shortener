const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();

// URL Schema (same as shortener)
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener"
);

// Redirect endpoint
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Update click count
    url.clicks += 1;
    await url.save();

    // Send analytics event
    try {
      await axios.post(`${process.env.ANALYTICS_SERVICE_URL}/analytics/click`, {
        shortCode,
        timestamp: new Date(),
        userAgent: req.get("User-Agent"),
        ip: req.ip,
      });
    } catch (analyticsError) {
      console.error("Analytics service error:", analyticsError.message);
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3002, () => console.log("Redirect service running on port 3002"));
