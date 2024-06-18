const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { JWT_SECRET, SENDGRID_API, EMAIL } = require("../config/keys");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

// Route to handle user registration (signup)
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please fill all the required fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });

        user.save()
          .then(() => {
            res.json({ message: "User registered successfully" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to register user" });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error. Please try again later." });
    });
});

// Route to handle user login (signin)
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please provide email and password" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or password" });
      }
      bcrypt.compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            // Generate JWT token
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Server error. Please try again later." });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error. Please try again later." });
    });
});

// Route to handle password reset request
router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(422).json({ error: "User does not exist with that email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000; // Token expiry time: 1 hour
        user.save()
          .then((result) => {
            transporter.sendMail({
              to: user.email,
              from: EMAIL,
              subject: "Password Reset",
              html: `
                <p>You requested a password reset</p>
                <h5>Click <a href="${EMAIL}/reset/${token}">here</a> to reset your password</h5>
              `,
            });
            res.json({ message: "Check your email for password reset instructions" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Failed to save reset token" });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "Server error. Please try again later." });
      });
  });
});

// Route to handle setting new password after reset
router.post("/new-password", (req, res) => {
  const { newPassword, sentToken } = req.body;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Session expired. Please try again." });
      }
      bcrypt.hash(newPassword, 12)
        .then((hashedpassword) => {
          user.password = hashedpassword;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user.save()
            .then(() => {
              res.json({ message: "Password updated successfully" });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ error: "Failed to update password" });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error. Please try again later." });
    });
});

module.exports = router;
