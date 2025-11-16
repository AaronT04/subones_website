// routes/dental.js
const express = require("express");
const router = express.Router();
const { db } = require("../db");

// Load all teeth for a specimen
router.get("/api/dental/:specimen_id", (req, res) => {
  const { specimen_id } = req.params;

  db.query(
    "SELECT * FROM tooth_inventory WHERE specimen_id = ? ORDER BY tooth_name",
    [specimen_id],
    (err, rows) => {
      if (err) {
        console.error("Dental load error:", err);
        return res.status(500).json({ error: "DB error", details: err });
      }
      res.json(rows);
    }
  );
});

// Save all teeth (UPSERT)
router.post("/api/dental/:specimen_id", (req, res) => {
  const { specimen_id } = req.params;
  const teeth = req.body;

  if (!Array.isArray(teeth)) {
    return res.status(400).json({ error: "Expected array" });
  }

  const sql = `
    INSERT INTO tooth_inventory 
      (specimen_id, tooth_name, tooth_inv_code, tooth_width, tooth_height, tooth_wear_code, tooth_dev_code)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      tooth_inv_code = VALUES(tooth_inv_code),
      tooth_width = VALUES(tooth_width),
      tooth_height = VALUES(tooth_height),
      tooth_wear_code = VALUES(tooth_wear_code),
      tooth_dev_code = VALUES(tooth_dev_code)
  `;

  const values = teeth.map(t => [
    specimen_id,
    t.tooth_name,
    t.tooth_inv_code ?? null,
    t.tooth_width ?? null,
    t.tooth_height ?? null,
    t.tooth_wear_code ?? null,
    t.tooth_dev_code ?? null
  ]);

  db.query(sql, [values], err => {
    if (err) {
      console.error("Dental save error:", err);
      return res.status(500).json({ error: "DB error", details: err });
    }
    res.json({ success: true });
  });
});

module.exports = router;
