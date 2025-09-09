const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    const verified = jwt.verify(token, "secretkey123"); // same secret as login
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
