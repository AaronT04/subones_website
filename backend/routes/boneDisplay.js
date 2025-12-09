const express = require("express");
const router = express.Router();
const { db, pdb } = require("../db");

// ---------------------------------------------------------
// GET BONE DETAILS — Viewer Mode (Read-Only)
// ---------------------------------------------------------
router.get("/api/view/bone/:boneId", async (req, res) => {
  const boneId = req.params.boneId;

  try {
    // 1️⃣ Fetch bone + specimen + museum data
    const [boneRows] = await pdb.query(
      `
      SELECT 
        b.bone_id,
        b.bone_name,
        b.bone_type,
        b.specimen_id,

        s.specimen_number,
        s.sex,
        s.user_id,
        u.name AS user_name,

        m.museum_name,
        s.broad_region,
        s.country,
        s.locality,
        s.region

      FROM bone b
      JOIN specimen s ON s.specimen_id = b.specimen_id
      LEFT JOIN user u ON u.user_id = s.user_id
      LEFT JOIN museum m ON m.museum_id = s.museum_id

      WHERE b.bone_id = ?
      `,
      [boneId]
    );

    if (boneRows.length === 0) {
      return res.json({ success: false, message: "Bone not found" });
    }

    const bone = boneRows[0];

    // 2️⃣ Taxonomy (one record per specimen)
    const [taxRows] = await pdb.query(
      `SELECT * FROM taxonomy WHERE specimen_id = ? LIMIT 1`,
      [bone.specimen_id]
    );

    const taxonomy = taxRows[0] || null;

    // 3️⃣ Locality details
    const locality = {
      museum_name: bone.museum_name,
      broad_region: bone.broad_region,
      country: bone.country,
      locality: bone.locality,
      region: bone.region,
    };

    // 4️⃣ Taphonomy (optional, newest)
    const [taphRows] = await pdb.query(
      `
      SELECT *
      FROM taphonomy
      WHERE bone_id = ?
      ORDER BY taphonomy_id DESC
      LIMIT 1
      `,
      [boneId]
    );

    const taphonomy = taphRows[0] || null;

    // 5️⃣ Determine measurement table by bone_type
    let table = null;

    const t = bone.bone_type.toLowerCase();

    if (t === "cranium") {
      table = "cranium_measurements";
    } else if (
      t.includes("vertebra") ||
      t === "sacrum" ||
      t === "axial"
    ) {
      table = "axial_measurements";
    } else {
      table = "appendicular_measurements"; // fallback for limbs
    }

    // 6️⃣ Load measurements
    let measurements = [];
    try {
      const [mRows] = await pdb.query(
        `SELECT * FROM ${table} WHERE specimen_id = ? LIMIT 1`,
        [bone.specimen_id]
      );

      if (mRows.length > 0) {
        measurements = [mRows[0]]; // return as array so frontend stays consistent
      }
    } catch (err) {
      console.error("Measurement load error:", err);
    }

    // 7️⃣ Response
    return res.json({
      success: true,
      bone,
      locality,
      taxonomy,
      taphonomy,
      measurements,
    });
  } catch (err) {
    console.error("❌ VIEWER ERROR:", err);
    return res.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
