const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(' ')[1];
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("Token verified, user:", user);
    req.user = user;
    next();
  });
}

module.exports = { verifyToken };