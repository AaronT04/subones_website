const express = require('express');
const { db } = require('../db');
const router = express.Router();

// Load all postcranial metrics for a skeleton
router.get('/api/postcranial_metrics/:skeleton_id', (req, res) => {
  const { skeleton_id } = req.params;
  console.log(skeleton_id);
  db.query(
    'SELECT * FROM postcranial_metrics WHERE skeleton_id = ?',
    [skeleton_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!rows.length) return res.json([]);

      const row = rows[0];
      const formatted = Object.entries(row)
        .filter(([key]) => key !== "skeleton_id")
        .map(([key, value]) => ({
          metric_name: key,
          metric_value: value,
        }));

      res.json(formatted);
    }
  );
});

router.post('/api/postcranial_metrics/:skeleton_id', async (req, res) => {
  try {
    const { skeleton_id } = req.params;
    const { metrics } = req.body; // array of { metric_name, metric_value }

    if (!Array.isArray(metrics)) {
      return res.status(400).json({ error: "metrics array required" });
    }

    // Build dynamic columns and values
    const columns = ["skeleton_id"];
    const values = [skeleton_id];
    const placeholders = ["?"];

    metrics.forEach(({ metric_name, metric_value }) => {
      if (metric_value !== null && metric_value !== undefined && metric_value !== "") {
        //const col = toColumnName(metric_name);
        const col = metric_name;
        columns.push(`\`${col}\``);
        values.push(metric_value);
        placeholders.push("?");
      }
    });

    // ✅ Handle empty case
    if (columns.length === 1) {
      // No metrics provided — just ensure the row exists
      const insertSkeletonRow = `
        INSERT IGNORE INTO postcranial_metrics (skeleton_id)
        VALUES (?)
      `;
      await db.promise().query(insertSkeletonRow, [skeleton_id]);
      return res.json({ ok: true, message: "No metrics to update" });
    }

    // ✅ Safe upsert if metrics exist
    const sql = `
      INSERT INTO postcranial_metrics (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      ON DUPLICATE KEY UPDATE ${columns
        .filter((c) => c !== "skeleton_id")
        .map((c) => `${c} = VALUES(${c})`)
        .join(", ")}
    `;

    await db.promise().query(sql, values);
    res.json({ ok: true });
  } catch (err) {
    console.error("Error saving postcranial metrics:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
