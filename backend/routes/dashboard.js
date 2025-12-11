const { pagedParams, buildSearchWhere, toNumberId } = require('./helpers/dashboardHelpers');
const express = require('express');
const { db } = require('../db');         // <-- ONLY USING CALLBACK API
const router = express.Router();


// ------------------ HEALTH CHECK ------------------
router.get('/api/health', (_req, res) => {
  db.query('SELECT 1 AS ok', (err, rows) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: rows?.[0]?.ok === 1, time: new Date().toISOString() });
  });
});


// ------------------ BONES LIST ------------------
router.get('/api/list/bones', (req, res) => {
  const { id } = req.query;

  const sql = `
    SELECT
      s.specimen_id AS id,
      CONCAT('B-', s.specimen_number) AS menuID,
      COALESCE(b.bone_name, b.bone_type, 'Bone') AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM bone b
    LEFT JOIN specimen s ON b.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    WHERE s.specimen_number IS NOT NULL AND b.bone_name <> "Skull" AND u.user_id = ?
    ORDER BY s.specimen_number DESC
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});


// ------------------ INDIVIDUALS LIST ------------------
router.get('/api/list/individuals', (req, res) => {

  const { id } = req.query;

  const sql = `
    SELECT
      s.skeleton_id AS id,
      CONCAT('I-', s.skeleton_id) AS menuID,
      s.skeleton_name AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM skeleton s
    LEFT JOIN specimen sp ON s.specimen_id = sp.specimen_id
    LEFT JOIN museum m ON sp.museum_id = m.museum_id
    LEFT JOIN user   u ON sp.user_id   = u.user_id
    WHERE u.user_id = ?
    ORDER BY s.skeleton_id DESC
  `;
  //console.log("User ID =", id);

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});

//Skull list
router.get('/api/list/skull', (req, res) => {
  const { id } = req.query;
  const sql = `
  SELECT
    s.specimen_id AS id,
    CONCAT('SK-', s.specimen_number) AS menuID,
    COALESCE(s.specimen_name, s.specimen_number) AS name,
    COALESCE(m.museum_name, '') AS museum,
    COALESCE(u.name, '') AS user
    FROM skull sk

    LEFT JOIN specimen s on sk.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    WHERE u.user_id = ?
    ORDER BY s.specimen_id DESC
    `

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
})


// ------------------ DENTAL LIST ------------------
router.get('/api/list/dental', (req, res) => {
  const { id } = req.query;

  const sql = `
    SELECT DISTINCT
      s.specimen_id AS id,
      CONCAT('D-', s.specimen_number) AS menuID,
      COALESCE(s.specimen_name, s.specimen_number) AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM specimen s
    RIGHT JOIN tooth_inventory t on s.specimen_id = t.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    WHERE u.user_id = ? 
    ORDER BY s.specimen_id DESC
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});

module.exports = router;
