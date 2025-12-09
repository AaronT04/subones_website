const express = require("express");
const router = express.Router();
const { db, pdb } = require("../db"); // your promise DB connection

// -------------------------------------------------------------
// GET BONE DETAILS (Debug Version - prints measurements format)
// -------------------------------------------------------------
router.get("/api/get/bone/details/:boneId", async (req, res) => {
  const boneId = req.params.boneId;

  try {
    console.log("📌 Request for boneId:", boneId);

    // 1️⃣ Load bone + specimen + museum data
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
        s.broad_region,
        s.country,
        s.locality,
        s.region,

        m.museum_name

      FROM bone b
      JOIN specimen s ON s.specimen_id = b.specimen_id
      LEFT JOIN museum m ON m.museum_id = s.museum_id
      WHERE b.bone_id = ?
      `,
      [boneId]
    );

    console.log("📌 Bone row:", boneRows);

    if (boneRows.length === 0) {
      console.log("❌ Bone not found");
      return res.json({ success: false, message: "Bone not found" });
    }

    const bone = boneRows[0];

    // 2️⃣ Determine measurement table
    let measurementTable = null;

    if (bone.bone_type === "cranium") {
      measurementTable = "cranium_measurements";
    } else if (bone.bone_type.includes("vertebra") || bone.bone_type === "sacrum") {
      measurementTable = "axial_measurements";
    } else {
      measurementTable = "appendicular_measurements";
    }

    console.log("📌 Measurement table:", measurementTable);

    // 3️⃣ Fetch measurements using specimen_id (your DB uses that)
    let measurements = [];
    try {
      const [mRows] = await pdb.query(
        `SELECT * FROM ${measurementTable} WHERE specimen_id = ?`,
        [bone.specimen_id]
      );

      console.log("📌 RAW MEASUREMENTS:", mRows);

      measurements = mRows;
    } catch (err) {
      console.error("❌ ERROR LOADING MEASUREMENTS:", err);
      measurements = [];
    }

    // 4️⃣ Fetch taxonomy
    const [taxRows] = await pdb.query(
      `SELECT * FROM taxonomy WHERE specimen_id = ? LIMIT 1`,
      [bone.specimen_id]
    );

    // 5️⃣ Build response
    return res.json({
      success: true,
      bone,
      taxonomy: taxRows[0] || null,
      locality: {
        broad_region: bone.broad_region,
        locality: bone.locality,
        country: bone.country,
        region: bone.region,
        museum_name: bone.museum_name
      },
      measurements
    });

  } catch (err) {
    console.error("❌ Error in GET bone details:", err);
    return res.json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

module.exports = router;
