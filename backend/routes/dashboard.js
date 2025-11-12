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
  const { limit, offset, q, field } = pagedParams(req);

  const mapByField = {
    id: ['b.bone_id'],
    name: ['b.bone_name', 'b.bone_type'],
    user: ['u.name'],
  };
  const mapAll = ['b.bone_name', 'b.bone_type', 'm.museum_name', 'u.name'];

  const { where, params } = buildSearchWhere({ q, field, mapAll, mapByField });

  const sql = `
    SELECT
      b.bone_id AS id,
      CONCAT('B-', b.bone_id) AS menuID,
      COALESCE(b.bone_name, b.bone_type, 'Bone') AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM bone b
    LEFT JOIN specimen s ON b.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    ${where}
    ORDER BY b.bone_id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});


// ------------------ INDIVIDUALS LIST ------------------
router.get('/api/list/individuals', (req, res) => {
  const { limit, offset, q, field } = pagedParams(req);

  const mapByField = {
    id: ['s.skeleton_id'],
    name: ['s.skeleton_name'],
    user: ['u.name'],
  };
  const mapAll = ['s.skeleton_name', 'm.museum_name', 'u.name'];

  const { where, params } = buildSearchWhere({ q, field, mapAll, mapByField });

  const sql = `
    SELECT
      s.skeleton_id AS id,
      CONCAT('I-', s.skeleton_id) AS menuID,
      s.skeleton_name AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM skeletal_inventory s
    LEFT JOIN specimen sp ON s.specimen_id = sp.specimen_id
    LEFT JOIN museum m ON sp.museum_id = m.museum_id
    LEFT JOIN user   u ON sp.user_id   = u.user_id
    ${where}
    ORDER BY s.skeleton_id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});


// ------------------ DENTAL LIST ------------------
router.get('/api/list/dental', (req, res) => {
  const { limit, offset, q, field } = pagedParams(req);

  const mapByField = {
    id: ['d.tooth_id'],
    name: ['d.tooth_type', 'd.position'],
    user: ['u.name'],
  };
  const mapAll = ['d.tooth_type', 'd.position', 'm.museum_name', 'u.name'];

  const { where, params } = buildSearchWhere({ q, field, mapAll, mapByField });

  const sql = `
    SELECT
      d.tooth_id AS id,
      CONCAT('D-', d.tooth_id) AS menuID,
      COALESCE(d.tooth_type, d.position, 'Tooth') AS name,
      COALESCE(m.museum_name, '') AS museum,
      COALESCE(u.name, '') AS user
    FROM dental_inventory d
    LEFT JOIN specimen s ON d.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    ${where}
    ORDER BY d.tooth_id DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [...params, limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(toNumberId(rows));
  });
});


// ------------------ GET BONE BY ID ------------------
router.get('/api/get/bone/:id', (req, res) => {
  const boneId = req.params.id;

  db.query(`
    SELECT
      b.bone_id AS id,
      COALESCE(b.bone_name, b.bone_type, 'Bone') AS name,
      b.bone_type,
      b.condition,
      b.side,
      b.notes,
      b.specimen_id,
      COALESCE(s.specimen_name, s.specimen_number) AS specimen_name,
      m.museum_id,
      COALESCE(m.museum_name, '') AS museum,
      u.user_id,
      COALESCE(u.name, '') AS user
    FROM bone b
    LEFT JOIN specimen s ON b.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    WHERE b.bone_id = ?
  `, [boneId], (err, boneRows) => {

    if (err) return res.status(500).json({ error: err.message });
    if (!boneRows.length) return res.status(404).json({ error: 'Bone not found' });

    const result = { ...boneRows[0], id: Number(boneRows[0].id), measurements: {}, taphonomy: [] };

    db.query(`SELECT * FROM appendicular_measurements WHERE bone_id = ? LIMIT 1`, [boneId],
      (e1, a) => {
        db.query(`SELECT * FROM axial_measurements WHERE bone_id = ? LIMIT 1`, [boneId],
          (e2, x) => {
            db.query(`SELECT * FROM cranium_measurements WHERE bone_id = ? LIMIT 1`, [boneId],
              (e3, c) => {
                db.query(`SELECT * FROM feet_measurements WHERE bone_id = ? LIMIT 1`, [boneId],
                  (e4, f) => {
                    db.query(`SELECT * FROM taphonomy WHERE bone_id = ? ORDER BY id DESC`, [boneId],
                      (e5, t) => {

                        result.measurements.appendicular = a?.[0] ?? null;
                        result.measurements.axial = x?.[0] ?? null;
                        result.measurements.cranium = c?.[0] ?? null;
                        result.measurements.feet = f?.[0] ?? null;
                        result.taphonomy = t ?? [];

                        res.json(result);
                      });
                  });
              });
          });
      });
  });
});


// ------------------ GET INDIVIDUAL ------------------
router.get('/api/get/individual/:id', (req, res) => {
  const specimenId = req.params.id;

  db.query(`
    SELECT
      s.specimen_id AS id,
      COALESCE(s.specimen_name, s.specimen_number) AS name,
      s.specimen_number,
      s.broad_region,
      s.country,
      s.locality,
      s.region,
      s.sex,
      s.age_estimate,
      s.notes,
      s.user_id,
      COALESCE(u.name, '') AS user,
      s.museum_id,
      COALESCE(m.museum_name, '') AS museum
    FROM specimen s
    LEFT JOIN museum m ON s.museum_id = m.museum_id
    LEFT JOIN user   u ON s.user_id = u.user_id
    WHERE s.specimen_id = ?
  `, [specimenId], (err, specRows) => {

    if (err) return res.status(500).json({ error: err.message });
    if (!specRows.length) return res.status(404).json({ error: 'Individual not found' });

    const result = { ...specRows[0], id: Number(specRows[0].id) };

    db.query(`
      SELECT
        b.bone_id AS id,
        COALESCE(b.bone_name, b.bone_type, 'Bone') AS name,
        b.bone_type,
        b.condition,
        b.side
      FROM bone b
      WHERE b.specimen_id = ?
      ORDER BY b.bone_id DESC
    `, [specimenId], (e2, bones) => {

      db.query(`
        SELECT
          d.tooth_id AS id,
          COALESCE(d.tooth_type, d.position, 'Tooth') AS name,
          d.tooth_type,
          d.position,
          d.condition
        FROM dental_inventory d
        WHERE d.specimen_id = ?
        ORDER BY d.tooth_id DESC
      `, [specimenId], (e3, dental) => {

        result.bones = toNumberId(bones);
        result.dental = toNumberId(dental);
        res.json(result);
      });
    });
  });
});


// ------------------ GET DENTAL RECORD ------------------
router.get('/api/get/dental/:id', (req, res) => {
  const toothId = req.params.id;

  db.query(`
    SELECT
      d.tooth_id AS id,
      COALESCE(d.tooth_type, d.position, 'Tooth') AS name,
      d.tooth_type,
      d.position,
      d.condition,
      d.notes,
      d.specimen_id,
      COALESCE(s.specimen_name, s.specimen_number) AS specimen_name,
      s.museum_id,
      COALESCE(m.museum_name, '') AS museum,
      s.user_id,
      COALESCE(u.name, '') AS user
    FROM dental_inventory d
    LEFT JOIN specimen s ON d.specimen_id = s.specimen_id
    LEFT JOIN museum   m ON s.museum_id   = m.museum_id
    LEFT JOIN user     u ON s.user_id     = u.user_id
    WHERE d.tooth_id = ?
  `, [toothId], (err, rows) => {

    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'Dental record not found' });

    const result = { ...rows[0], id: Number(rows[0].id) };

    db.query(`SELECT * FROM teeth_measurements WHERE tooth_id = ? LIMIT 1`,
      [toothId],
      (err2, meas) => {
        result.measurements = meas?.[0] ?? null;
        res.json(result);
      });
  });
});


module.exports = router;
