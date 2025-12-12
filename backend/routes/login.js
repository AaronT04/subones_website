const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const router = express.Router();
const { sendVerificationEmail, sendPasswordResetEmail } = require('./helpers/sendEmails');


const SECRET_KEY = process.env.JWT_SECRET;

router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, roles } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const lowerEmail = email.toLowerCase();

    // Allow only SU emails
    const allowedDomains = [
      "@gulls.salisbury.edu",
      "@salisbury.edu"
    ];

    const isAllowed = allowedDomains.some(domain => lowerEmail.endsWith(domain));

    if (!isAllowed) {
      return res.status(400).json({
        error: "Only Salisbury University emails (@gulls.salisbury.edu or @salisbury.edu) are allowed."
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verifyToken = jwt.sign(
      { email },
      process.env.EMAIL_JWT_SECRET,
      { expiresIn: "1d" }
    );

    db.query(
      `INSERT INTO user 
       (name, email, password, roles, isVerified, email_verification_token)
       VALUES (?, ?, ?, ?, FALSE, ?)`,
      [name, email, hashed, roles || "user", verifyToken],
      async (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already in use." });
          }
          return res.status(500).json({ error: err.message });
        }

        await sendVerificationEmail(email, verifyToken);

        res.status(201).json({
          message: "Account created. Please check your email to verify your account."
        });
      }
    );

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});


router.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: "Invalid email" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Email not verified. Check your inbox."
      });
    }

    // Return login token
    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.name,
        email: user.email,
        roles: user.roles
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

router.post("/api/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify JWT with SAME SECRET in all environments
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "UPDATE user SET password = ?, reset_token = NULL WHERE email = ? AND reset_token = ?",
      [hashed, email, token],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // If token not found in DB
        if (result.affectedRows === 0) {
          return res.status(400).json({ error: "Invalid or expired reset token." });
        }

        res.json({ message: "Password updated successfully." });
      }
    );

  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(400).json({ error: "Invalid or expired token." });
  }
});


router.post("/api/forgot-password", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Always return generic message
    if (rows.length === 0) {
      return res.json({ message: "If this email exists, a reset link was sent." });
    }

    // Create a JWT with short expiration
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Save token into DB BEFORE sending the email
    db.query(
      "UPDATE user SET reset_token = ? WHERE email = ?",
      [token, email],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        console.log("Reset password link:", link);

        sendPasswordResetEmail(email, link);

        return res.json({
          message: "Password reset email sent."
        });
      }
    );
  });
});


module.exports = router;
