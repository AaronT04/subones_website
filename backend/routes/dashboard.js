const {pagedParams, buildSearchWhere, toNumberId} = require('./helpers/dashboardHelpers');
const express = require('express');
const { pdb } = require('../db');
const router = express.Router();

router.get('/api/health', async (_req, res) => {
  try {
    const [rows] = await pdb.query('SELECT 1 AS ok');
    res.json({ ok: rows?.[0]?.ok === 1, time: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/api/list/bones', async (req, res) => {
  try {
    const { limit, offset, q, field } = pagedParams(req);

    const mapByField = {
      id:   ['b.bone_id'],
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

    const [rows] = await pdb.query(sql, [...params, limit, offset]);
    res.json(toNumberId(rows));
  } catch (err) {
    console.error('[list/bones] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Individuals list (specimen)
router.get('/api/list/individuals', async (req, res) => {
  try {
    const { limit, offset, q, field } = pagedParams(req);

    const mapByField = {
      id:   ['s.skeleton_id'],
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

    const [rows] = await pdb.query(sql, [...params, limit, offset]);
    res.json(toNumberId(rows));
  } catch (err) {
    console.error('[list/individuals] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Dental list
router.get('/api/list/dental', async (req, res) => {
  try {
    const { limit, offset, q, field } = pagedParams(req);

    const mapByField = {
      id:   ['d.tooth_id'],
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

    const [rows] = await pdb.query(sql, [...params, limit, offset]);
    res.json(toNumberId(rows));
  } catch (err) {
    console.error('[list/dental] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get('/api/get/bone/:id', async (req, res) => {
  try {
    const boneId = req.params.id;

    const [boneRows] = await pdb.query(
      `
      SELECT
        b.bone_id            AS id,
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
      `,
      [boneId]
    );

    if (!boneRows.length) {
      return res.status(404).json({ error: 'Bone not found' });
    }

    let appendicular = null, axial = null, cranium = null, feet = null, taphonomy = [];
    try {
      const [a] = await pdb.query(`SELECT * FROM appendicular_measurements WHERE bone_id = ? LIMIT 1`, [boneId]);
      const [x] = await pdb.query(`SELECT * FROM axial_measurements        WHERE bone_id = ? LIMIT 1`, [boneId]);
      const [c] = await pdb.query(`SELECT * FROM cranium_measurements      WHERE bone_id = ? LIMIT 1`, [boneId]);
      const [f] = await pdb.query(`SELECT * FROM feet_measurements         WHERE bone_id = ? LIMIT 1`, [boneId]);
      const [t] = await pdb.query(`SELECT * FROM taphonomy WHERE bone_id = ? ORDER BY id DESC`, [boneId]);
      appendicular = a?.[0] ?? null; axial = x?.[0] ?? null; cranium = c?.[0] ?? null; feet = f?.[0] ?? null; taphonomy = t ?? [];
    } catch {}

    res.json({
      ...boneRows[0],
      id: Number(boneRows[0].id),
      measurements: { appendicular, axial, cranium, feet },
      taphonomy,
    });
  } catch (err) {
    console.error('[get/bone/:id] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/get/individual/:id', async (req, res) => {
  try {
    const specimenId = req.params.id;

    const [specRows] = await pdb.query(
      `
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
      LEFT JOIN user   u ON s.user_id   = u.user_id
      WHERE s.specimen_id = ?
      `,
      [specimenId]
    );

    if (!specRows.length) {
      return res.status(404).json({ error: 'Individual (specimen) not found' });
    }

    const [bones] = await pdb.query(
      `
      SELECT
        b.bone_id AS id,
        COALESCE(b.bone_name, b.bone_type, 'Bone') AS name,
        b.bone_type,
        b.condition,
        b.side
      FROM bone b
      WHERE b.specimen_id = ?
      ORDER BY b.bone_id DESC
      `,
      [specimenId]
    );

    const [dental] = await pdb.query(
      `
      SELECT
        d.tooth_id AS id,
        COALESCE(d.tooth_type, d.position, 'Tooth') AS name,
        d.tooth_type,
        d.position,
        d.condition
      FROM dental_inventory d
      WHERE d.specimen_id = ?
      ORDER BY d.tooth_id DESC
      `,
      [specimenId]
    );

    res.json({
      ...specRows[0],
      id: Number(specRows[0].id),
      bones: toNumberId(bones),
      dental: toNumberId(dental),
    });
  } catch (err) {
    console.error('[get/individual/:id] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/get/dental/:id', async (req, res) => {
  try {
    const toothId = req.params.id;

    const [rows] = await pdb.query(
      `
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
      `,
      [toothId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Dental record not found' });
    }

    let measurements = null;
    try {
      const [meas] = await pdb.query(
        `SELECT * FROM teeth_measurements WHERE tooth_id = ? LIMIT 1`,
        [toothId]
      );
      measurements = meas?.[0] ?? null;
    } catch {}

    res.json({
      ...rows[0],
      id: Number(rows[0].id),
      measurements,
    });
  } catch (err) {
    console.error('[get/dental/:id] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;