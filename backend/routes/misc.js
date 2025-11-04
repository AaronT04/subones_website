const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.get('/api/taxonomy/bySpecimen/:specimen_id', (req, res) => {
  db.query(`SELECT * FROM taxonomy WHERE specimen_id = ?`, [req.params.specimen_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
module.exports = router;
