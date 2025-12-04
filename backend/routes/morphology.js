const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.post("/api/morphology/:specimen_id", (req, res) => {
  const { specimen_id } = req.params;
  const rows = req.body; // array of Morphology

  const sql = `
    INSERT INTO morphology (specimen_id, tooth_name, morph_name, morph_value)
    VALUES ?
    ON DUPLICATE KEY UPDATE morph_value = VALUES(morph_value)
  `;

  const values = rows.map(r => [
    specimen_id,
    r.tooth_name,
    r.morph_name,
    r.morph_value ?? null
  ]);

  db.query(sql, [values], err => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

router.get("/api/morphology/:specimen_id", (req, res) => {
  const { specimen_id } = req.params;

  db.query(
    "SELECT * FROM morphology WHERE specimen_id = ?",
    [specimen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

module.exports = router;
