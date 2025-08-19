const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, required: true },
  userAgent: String,
  ip: String,
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener"
);

// Record click event
app.post("/analytics/click", async (req, res) => {
  try {
    const analytics = new Analytics(req.body);
    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get analytics for specific URL
app.get("/analytics/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    const clicks = await Analytics.find({ shortCode }).sort({ timestamp: -1 });
    const totalClicks = clicks.length;

    // Group by date for chart data
    const clicksByDate = clicks.reduce((acc, click) => {
      const date = click.timestamp.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json({
      shortCode,
      totalClicks,
      clicksByDate,
      recentClicks: clicks.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3003, () => console.log("Analytics service running on port 3003"));
