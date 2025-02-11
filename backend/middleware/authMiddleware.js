const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Ensure token starts with 'Bearer ' and remove it
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  } else {
    return res
      .status(401)
      .json({ error: "Invalid token format. Use 'Bearer <token>'" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    res.status(400).json({ error: "Invalid token or expired session." });
  }
};

// Role-Based Access
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ error: "Access denied. Insufficient permissions." });
  }
  next();
};

module.exports = { authenticateUser, authorizeRole };
