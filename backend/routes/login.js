const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const router = express.Router();
const {captchaHandler} = require('../middleware/captcha');

const SECRET_KEY = process.env.JWT_SECRET || 'SecretKey';

// Register
router.post('/api/register', async (req, res) => {
  try {
    await captchaHandler(req, res);
    const { name, email, password, roles } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO user (name, email, password, roles, isVerified) VALUES (?, ?, ?, ?, TRUE)',
      [name, email, hashed, roles || 'user'],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name, email, roles });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Login
router.post('/api/login', (req, res) => {
  //console.log('api route hit');
  const { email, password } = req.body;
  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(401).json({ error: 'Invalid email' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.user_id, name: user.name, roles: user.roles },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    res.json({ token });
  });
});

module.exports = router;
