const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // Refers to the User model
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: "Unknown"
  },
  img: {
    type: String,
    default: "https://via.placeholder.com/200x300?text=No+Cover"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("History", historySchema);
