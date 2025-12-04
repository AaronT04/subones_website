const express = require('express');
const { db } = require('../db');
const router = express.Router();

router.post("/api/bone_metrics/save", async (req, res) => {
  try {
    const { bone_id, measurements } = req.body;

    if (!bone_id || typeof measurements !== "object") {
      return res.status(400).json({ error: "Missing bone_id or measurements" });
    }

    const values = [];

    for (const [metric_name, metric_value] of Object.entries(measurements)) {
      if (metric_value === null || metric_value === "" || metric_value === undefined)
        continue;

      values.push([bone_id, metric_name, Number(metric_value)]);
    }

    if (values.length === 0) {
      return res.json({ success: true, message: "No metrics to save" });
    }

    await db.promise().query(
      `
      INSERT INTO bone_metrics (bone_id, metric_name, metric_value)
      VALUES ?
      ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value)
      `,
      [values]
    );

    res.json({
      success: true,
      rows_saved: values.length,
    });
  } catch (err) {
    console.error("Error saving bone metrics:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/api/bone_metrics/:bone_id", async (req, res) => {
  try {
    const bone_id = req.params.bone_id;

    const [rows] = await db.promise().query(
      `SELECT metric_name, metric_value FROM bone_metrics WHERE bone_id = ?`,
      [bone_id]
    );

    const result = {};

    for (const row of rows) {
      result[row.metric_name] = row.metric_value;
    }

    res.json(result);
  } catch (err) {
    console.error("Error loading bone metrics:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/api/bone/bySpecimen/:specimen_id', (req, res) => {
  //console.log(req.params.specimen_id);
  try {
    db.query(`SELECT * FROM bone WHERE specimen_id = ?`, [req.params.specimen_id], (err, rows) => {
        if (err) {return res.status(500).json({ error: err.message });}
        res.json(rows[0]);
      })
  }
  catch(error) {
    console.log(error);
  }
  
});

module.exports = router;