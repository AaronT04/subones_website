const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const router = express.Router();

router.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;
  console.log("in verify-email")

  if (!token) return res.status(400).send("Missing token");
  console.log("token == true")

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET);
    console.log(decoded.email);

    db.query(
      `UPDATE ${`user`}
       SET isVerified = TRUE,
           email_verification_token = NULL,
           verified_at = NOW()
       WHERE email = ?`,
      [decoded.email],
      (err, result) => {
        if (err) return res.status(500).send(`Database error: ${err.message}`);

        if (result.affectedRows === 0) {
          return res.status(400).send("Invalid or expired token");
        }

        res.send("Email verified successfully! You may now log in.");
      }
    );
  } catch (e) {
    console.error(e);
    res.status(400).send("Invalid or expired token");
  }
});

module.exports = router;
