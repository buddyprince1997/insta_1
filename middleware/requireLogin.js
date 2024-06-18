const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(401).json({ error: "You must be logged in" });
    }

    const { _id } = payload;
    User.findById(_id)
      .then((userdata) => {
        if (!userdata) {
          return res.status(401).json({ error: "User not found" });
        }
        req.user = userdata; // Attach user data to request object
        next();
      })
      .catch((err) => {
        console.error("Error finding user by ID:", err.message);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
