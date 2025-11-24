const express = require('express');
const { db } = require('../db');
const router = express.Router();

const {COLUMN_TO_FRONTEND, FRONTEND_TO_COLUMN} = require("../utils/pcmetrics-map");

const axialBones = ['sacrum', 'cervical_vertebrae', 'thoracic_vertebrae', 'lumbar_vertebrae'];
const cranialBones = ['cranium'];
const mandibleBones = ['mandible'];
    
const isAxialBone = (boneType) => axialBones.includes(boneType);
const isCranialBone = (boneType) => cranialBones.includes(boneType);
const isMandibleBone = (boneType) => mandibleBones.includes(boneType);


// Save bone measurements (complex insert)
router.post('/api/bones/complete', async (req, res) => {
  try {
    const { specimenNumber, museumId, boneName, boneType, sex, userID, localityData, measurements } = req.body;
    
    console.log('Received data:', { specimenNumber, museumId, boneName, boneType, sex, userID, localityData, measurements });
    
    // Determine which table to use based on bone type
    
    
    let measurementsTable;
    let useSpecimenId = false; // Flag to determine if we use specimen_id or bone_id
    
    if (isAxialBone(boneType)) {
      measurementsTable = 'axial_measurements';
    } else if (isCranialBone(boneType)) {
      measurementsTable = 'cranium_measurements';
      useSpecimenId = true;
    } else if (isMandibleBone(boneType)) {
      measurementsTable = 'mandible_measurements';
      useSpecimenId = true;
    } else {
      measurementsTable = 'appendicular_measurements';
    }
    
    console.log('Using table:', measurementsTable);
    console.log('Using specimen_id:', useSpecimenId);
    
   if (boneName === "Skull") { //need to use a different route for saving the skull
    return;
   }
    
    // Step 1: Get museum abbreviation for specimen_name
    const [museumResult] = await db.promise().query(
      'SELECT museum_name FROM museum WHERE museum_id = ?',
      [parseInt(museumId)]
    );
    
    if (museumResult.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid museum ID'
      });
    }
    
    const museumAbbreviation = museumResult[0].museum_name;
    const specimenName = `${museumAbbreviation}-${specimenNumber}`;
    
    console.log('Creating specimen:', specimenName);
    
    // Step 2: Check if specimen exists
    const checkSpecimenQuery = `SELECT specimen_id FROM specimen WHERE specimen_name = ?`;
    const [existingSpecimen] = await db.promise().query(checkSpecimenQuery, [specimenName]);
    
    let specimenId;
    
    if (existingSpecimen.length === 0) {
      // Create new specimen with taxonomy data
      const specimenQuery = `
        INSERT INTO specimen (specimen_name, specimen_number, museum_id, sex, user_id, broad_region, country, locality, region) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [specimenResult] = await db.promise().query(specimenQuery, [
        specimenName,
        parseInt(specimenNumber),
        parseInt(museumId),
        sex,
        userID,
        localityData?.broadRegion || null,
        localityData?.country || null,
        localityData?.locality || null,
        localityData?.region || null
      ]);
      specimenId = specimenResult.insertId;
      console.log('Created new specimen with ID:', specimenId);
    } else {
      specimenId = existingSpecimen[0].specimen_id;
      console.log('Specimen already exists with ID:', specimenId);
    }
    
    // Step 3: Insert into bone table
    const boneQuery = `
      INSERT INTO bone (bone_name, bone_type, specimen_id) 
      VALUES (?, ?, ?)
    `;
    const [boneResult] = await db.promise().query(boneQuery, [boneName, boneType, specimenId]);
    const boneId = boneResult.insertId;
    console.log('Inserted bone with auto-generated ID:', boneId);
    
    // Step 4: Process measurements and handle vertebrae ranges
    const columnsToInsert = useSpecimenId ? {
      specimen_id: specimenId
    } : {
      bone_id: boneId,
      bone_name: boneName
    };
    
    // Process each measurement
    Object.keys(measurements).forEach(key => {
      const value = measurements[key];
      if (value === '' || value === null || value === undefined) {
        return;
      }
      
      // Handle cranium measurements - use exact column names from table
      if (isCranialBone) {
        // Convert measurement key to match database column format
        let columnName = key
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/-/g, '_');
        
        columnsToInsert[columnName] = parseFloat(value);
        return;
      }
      
      // Handle mandible measurements - use exact column names from table
      if (isMandibleBone) {
        // Convert measurement key to match database column format
        let columnName = key
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/-/g, '_');
        
        columnsToInsert[columnName] = parseFloat(value);
        return;
      }
      
      // Check if it's a vertebrae bone type
      if (boneType === 'cervical_vertebrae' || boneType === 'thoracic_vertebrae' || boneType === 'lumbar_vertebrae') {
        const vertebraMatch = key.match(/^([CTL])(\d+)$/i);
        if (vertebraMatch) {
          const type = vertebraMatch[1].toLowerCase();
          const number = vertebraMatch[2];
          const columnName = `vertebra_${type}${number}_max_height`;
          columnsToInsert[columnName] = parseFloat(value);
          return;
        }
        
        const rangeMatch = key.match(/^Max ([CTL])(\d+)-([CTL])(\d+) Height$/i);
        if (rangeMatch) {
          const type = rangeMatch[1].toLowerCase();
          const startNum = parseInt(rangeMatch[2]);
          const endNum = parseInt(rangeMatch[4]);
          
          for (let i = startNum; i <= endNum; i++) {
            const columnName = `vertebra_${type}${i}_max_height`;
            columnsToInsert[columnName] = parseFloat(value);
          }
          return;
        }
      }
      
      if (boneType === 'sacrum') {
        let cleanName = key
          .replace(/\([^)]*\)/g, '')
          .replace(/\//g, ' ')
          .replace(/-/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');
        
        const columnName = `sacrum_${cleanName}`;
        columnsToInsert[columnName] = parseFloat(value);
        return;
      }
      
      if (!isAxialBone && !isCranialBone && !isMandibleBone) {
        let cleanName = key
          .replace(/\([^)]*\)/g, '')
          .replace(/\//g, ' ')
          .replace(/-/g, ' ')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');
        
        const columnName = `${boneType}_${cleanName}`;
        columnsToInsert[columnName] = parseFloat(value);
      }
    });
    
    // Step 5: Build and execute the INSERT query
    const columns = Object.keys(columnsToInsert).map(col => `\`${col}\``);
    const values = Object.values(columnsToInsert);
    const placeholders = values.map(() => '?');
    
    const measurementsQuery = `
      INSERT INTO ${measurementsTable} (${columns.join(', ')}) 
      VALUES (${placeholders.join(', ')})
    `;
    
    console.log('Measurements SQL Query:', measurementsQuery);
    console.log('Values:', values);
    
    await db.promise().query(measurementsQuery, values);
    
    res.status(201).json({ 
      success: true, 
      message: 'All data saved successfully',
      boneId: boneId,
      specimenId: specimenId,
      specimenName: specimenName,
      measurementsTable: measurementsTable
    });
    
  } catch (error) {
    console.error('Error saving bone data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save bone data',
      error: error.message 
    });
  }
});

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




router.post('/api/measurements/byBone', async (req, res) => {
  try {
    const bone = req.body;

    if (!bone || typeof bone !== "object") {
      return res.status(400).json({ error: "Expected a bone object" });
    }

    const { bone_id, bone_type, specimen_id } = bone;
    const bt = bone_type?.toLowerCase();

    let table = null;
    let key = null;

    // Determine which table to query
    if (bt === "cranium") {
      table = "cranium_measurements";
      key = "specimen_id";
    } else if (bt === "mandible") {
      table = "mandible_measurements";
      key = "specimen_id";
    } else if (["sacrum", "cervical_vertebrae", "thoracic_vertebrae", "lumbar_vertebrae"].includes(bt)) {
      table = "axial_measurements";
      key = "bone_id";
    } else if (["calcaneus", "talus"].includes(bt)) {
      table = "feet_measurements";
      key = "bone_id";
    } else {
      table = "appendicular_measurements";
      key = "bone_id";
    }

    const lookupValue = key === "bone_id" ? bone_id : specimen_id;

    const [rows] = await db.promise().query(
      `SELECT * FROM ${table} WHERE ${key} = ?`,
      [lookupValue]
    );

    // No measurements exist yet
    if (!rows.length) {
      console.log("no measurements exist yet");
      return res.json({
        bone_id,
        bone_type,
        measurements: {}
      });
    }

    const row = rows[0];

    const measurements = {};

    for (const [col, val] of Object.entries(row)) {
      if (col === key || col === "bone_name") continue;

      const display = COLUMN_TO_FRONTEND[col];

      if (display) {
        measurements[display] = val;
      } else {
        // fallback if missing from map
        measurements[col] = val;
      }
    }

    res.json({
      bone_id,
      bone_type,
      measurements
    });

  } catch (err) {
    console.error("Error loading measurements:", err);
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