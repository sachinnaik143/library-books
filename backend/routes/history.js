const express = require("express");
const History = require("../models/history");
const authMiddleware = require("../middleware/auth"); // import middleware

const router = express.Router();

// 📌 Save book to history
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, author, img } = req.body;

    const newHistory = new History({
      userId: req.user.id,
      title,
      author,
      img,
    });

    await newHistory.save();
    res.json({ message: "Book saved to history!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Get user’s history
router.get("/", authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Clear user history
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: "History cleared!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
