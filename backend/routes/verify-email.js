const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send('Missing token');

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET);

    db.query(
      'UPDATE user SET isVerified = true WHERE user_id = ?',
      [decoded.id],
      (err, result) => {
        if (err) return res.status(500).send(`Database error: ${err.message}`);
        res.send('Email verified successfully. You can now log in.');
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).send('Invalid or expired token');
  }
});

module.exports = router;