// routes/taphonomy.js
const express = require("express");
const router = express.Router();
const { db } = require("../db");

// Mapping of string labels → SQL column names
const COLUMN_MAP = {
  // STAINING
  "Green (copper)": "green_copper",
  "Green (algae)": "green_algae",
  "Red (ocher, cinnabar, vermillion)": "red_ocher_cinnabar_vermillion",
  "Iron/Ferrous Metal": "iron_ferrous_metal",
  "Black": "black",
  "Soil": "soil",
  "Roots/Plant": "roots_plant",
  "Mottled Pattern": "mottled_pattern",
  "Other Staining": "other_staining",

  // SURFACE DAMAGE
  "Sunbleaching": "sunbleaching",
  "Plant Root damage": "plant_root_damage",
  "Rodent tooth marks": "rodent_tooth_marks",
  "Carnivore tooth marks": "carnivore_tooth_marks",
  "Unidentified Animal damage": "unidentified_animal_damage",
  "Insect Damage": "insect_damage",
  "Scratches/Abrasions": "scratches_abrasions",
  "Warping due to ground pressure": "warping_due_to_ground_pressure",
  "Contact erosion (eg. coffin wear)": "contact_erosion_eg_coffin_wear",
  "Burning": "burning",
  "Other Damage": "other_damage",

  // ADHERENT MATERIALS
  "Dried Body Fluids": "dried_body_fluids",
  "Dessicated Tissue": "dessicated_tissue",
  "Adipocere": "adipocere",
  "Hair/Fur": "hair_fur",
  "Insect Debris/Pupae": "insect_debris_pupae",
  "Lichens": "lichens",
  "Roots/Rootlets": "roots_rootlets",
  "Soil": "soil_adherent",  // careful: different from staining Soil
  "Textile/Impression": "textile_impression",
  "Other Material": "other_material",

  // CURATION MODIFICATIONS
  "Excavation Damage": "excavation_damage",
  "Laboratory Cut Marks": "laboratory_cut_marks",
  "Bleaching/Cleaning": "bleaching_cleaning",
  "Hardware attached": "hardware_attached",
  "Preservatives/Glue applied": "preservatives_glue_applied",
  "Plaster/Reconstr. Materials": "plaster_reconstr_materials",
  "Samples removed": "samples_removed",
  "Other Modifications": "other_modifications",

  // CULTURAL MODIFICATIONS
  "Cut Marks": "cut_marks",
  "Intentional Fracture": "intentional_fracture",
  "PM Drilling/Cutting, etc.": "pm_drilling_cutting_etc"
};

const COLUMN_TO_LABEL = Object.fromEntries(
  Object.entries(COLUMN_MAP).map(([label, col]) => [col, label])
);

// SAVE or UPDATE TAPHONOMY ENTRY
router.post("/api/taphonomy/:specimen_id/:bone_name", async (req, res) => {
  try {
    const { specimen_id, bone_name } = req.params;
    const t = req.body;

    // REQUIRED FIELDS
    if (!specimen_id || !bone_name) {
      return res.status(400).json({ error: "specimen_id and bone_name required" });
    }

    // Base columns included no matter what
    const columns = [
      "specimen_id",
      "bone_name",
      "bone_condition",
      "surface_exposure",
      "comments"
    ];

    const values = [
      specimen_id,
      bone_name,
      t.bone_condition ?? null,
      t.surface_exposure ? 1 : 0,
      t.comments || null
    ];

    const placeholders = ["?", "?", "?", "?", "?"];

    // Flatten all option arrays
    const optionStrings = [
      ...t.staining,
      ...t.surface_damage,
      ...t.adherent_materials,
      ...t.modifications
    ];

    // Mark columns = 1 for selected options
    for (const label of optionStrings) {
      const col = COLUMN_MAP[label];
      if (!col) continue;

      columns.push(col);
      values.push(1);
      placeholders.push("?");
    }

    columns.push("bone_color");
    values.push(t.bone_color || null);
    placeholders.push("?");


    // Build UPSERT clause (updates the row if it already exists)
    const updateClause = columns
      .filter(c => !["specimen_id", "bone_name"].includes(c))
      .map(c => `\`${c}\` = VALUES(\`${c}\`)`)
      .join(", ");

    const sql = `
      INSERT INTO taphonomy (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      ON DUPLICATE KEY UPDATE ${updateClause};
    `;

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Taphonomy save error:", err);
        return res.status(500).json({ error: "Database error", details: err });
      }
      res.json({ success: true, message: "Taphonomy saved." });
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/api/taphonomy/all/:specimen_id", (req, res) => {
  const { specimen_id } = req.params;

  const sql = `
    SELECT *
    FROM taphonomy
    WHERE specimen_id = ?
  `;

  db.query(sql, [specimen_id], (err, rows) => {
    if (err) {
      console.error("Taphonomy load error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    const results = rows.map(rowToTaphonomy);
    res.json(results);
  });
});

// ---------------------------------------------
// GET: Loader for a SINGLE bone
// ---------------------------------------------
router.get("/api/taphonomy/:specimen_id/:bone_name", (req, res) => {
  const { specimen_id, bone_name } = req.params;

  const sql = `
    SELECT *
    FROM taphonomy
    WHERE specimen_id = ? AND bone_name = ?
    LIMIT 1
  `;

  db.query(sql, [specimen_id, bone_name], (err, rows) => {
    if (err) {
      console.error("Taphonomy load error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    if (rows.length === 0) return res.json(null);

    const taph = rowToTaphonomy(rows[0]);
    res.json(taph);
  });
});

// ---------------------------------------------
// HELPER — Convert a DB row into Taphonomy object
// ---------------------------------------------
function rowToTaphonomy(row) {
  const staining = [];
  const surface_damage = [];
  const adherent_materials = [];
  const modifications = [];

  for (const [colName, value] of Object.entries(row)) {
    if (value !== 1) continue; // only TRUE flags

    const label = COLUMN_TO_LABEL[colName];
    if (!label) continue;

    // figure out which group it belongs to

    if (Object.keys(COLUMN_MAP).slice(0, 9).includes(label)) {
      staining.push(label);
    } else if (
      Object.keys(COLUMN_MAP).slice(9, 20).includes(label)
    ) {
      surface_damage.push(label);
    } else if (
      Object.keys(COLUMN_MAP).slice(20, 31).includes(label)
    ) {
      adherent_materials.push(label);
    } else {
      modifications.push(label);
    }
  }

  return {
    bone_name: row.bone_name,
    bone_condition: row.bone_condition,
    surface_exposure: !!row.surface_exposure,
    bone_color: row.bone_color || "",
    staining,
    surface_damage,
    adherent_materials,
    modifications,
    comments: row.comments || ""
  };
}



module.exports = router;
