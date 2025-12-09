const express = require('express');
const { db } = require('../db');
const router = express.Router();

// Load cranial inventory for a specimen
router.get('/api/cranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  db.query(
    `SELECT inv_entry_name, value, taphonomy_id FROM cranial_inventory WHERE specimen_id = ?`,
    [specimen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Save cranial inventory (insert/delete sync)
router.post('/api/cranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  const { inventory } = req.body; // array of {inv_entry_name, value?, taphonomy_id?} filtered by isChecked == true

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Delete rows no longer checked
    const names = inventory.map(i => i.inv_entry_name);
    const deleteQuery = names.length
      ? `DELETE FROM cranial_inventory WHERE specimen_id = ? AND inv_entry_name NOT IN (?)`
      : `DELETE FROM cranial_inventory WHERE specimen_id = ?`;
    const deleteParams = names.length ? [specimen_id, names] : [specimen_id];

    db.query(deleteQuery, deleteParams, err => {
      if (err) {
        db.rollback(() => res.status(500).json({ error: err.message }));
        return;
      }

      // 2. Insert or update checked boxes
      if (!inventory.length) {
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
        return;
      }

      const insertValues = inventory.map(i => [
        specimen_id,
        i.inv_entry_name,
        i.value ?? null,
        i.taphonomy_id ?? null
      ]);

      const insertQuery = `
        INSERT INTO cranial_inventory (specimen_id, inv_entry_name, value, taphonomy_id)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          value = VALUES(value),
          taphonomy_id = VALUES(taphonomy_id)
      `;

      db.query(insertQuery, [insertValues], err => {
        if (err) {
          db.rollback(() => res.status(500).json({ error: err.message }));
          return;
        }
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
      });
    });
  });
});


// ----- Postcranial Inventory -----

router.get('/api/postcranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  db.query(
    `SELECT inv_entry_name, value, taphonomy_id FROM postcranial_inventory WHERE specimen_id = ?`,
    [specimen_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.post('/api/postcranial_inventory/:specimen_id', (req, res) => {
  const { specimen_id } = req.params;
  const { inventory } = req.body;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    const names = inventory.map(i => i.inv_entry_name);
    const deleteQuery = names.length
      ? `DELETE FROM postcranial_inventory WHERE specimen_id = ? AND inv_entry_name NOT IN (?)`
      : `DELETE FROM postcranial_inventory WHERE specimen_id = ?`;
    const deleteParams = names.length ? [specimen_id, names] : [specimen_id];

    db.query(deleteQuery, deleteParams, err => {
      if (err) {
        db.rollback(() => res.status(500).json({ error: err.message }));
        return;
      }

      if (!inventory.length) {
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
        return;
      }

      const insertValues = inventory.map(i => [
        specimen_id,
        i.inv_entry_name,
        i.value ?? null,
        i.taphonomy_id ?? null
      ]);

      const insertQuery = `
        INSERT INTO postcranial_inventory (specimen_id, inv_entry_name, value, taphonomy_id)
        VALUES ?
        ON DUPLICATE KEY UPDATE
          value = VALUES(value),
          taphonomy_id = VALUES(taphonomy_id)
      `;

      db.query(insertQuery, [insertValues], err => {
        if (err) {
          db.rollback(() => res.status(500).json({ error: err.message }));
          return;
        }
        db.commit(err => {
          if (err) db.rollback(() => res.status(500).json({ error: err.message }));
          else res.json({ ok: true });
        });
      });
    });
  });
});
module.exports = router;