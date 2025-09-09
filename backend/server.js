const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const historyRoutes = require("./routes/history");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/history", historyRoutes);


const SECRET_KEY = "mysecretkey"; // change for production

// ✅ Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/library", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  history: [
    {
      title: String,
      author: String,
      img: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model("User", userSchema);

// ✅ Register Route
app.post("/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, email, username, password: hashedPassword });

  await newUser.save();
  res.json({ message: "✅ Registration successful!" });
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "✅ Login successful!", token });
});

// ✅ Auth Middleware
function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

// ✅ Save History
app.post("/history", auth, async (req, res) => {
  const { title, author, img } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.history.unshift({ title, author, img });
  if (user.history.length > 20) user.history = user.history.slice(0, 20);

  await user.save();
  res.json({ message: "✅ Book saved to history!" });
});

// ✅ Get History
app.get("/history", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user.history);
});

// ✅ Start server
app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
