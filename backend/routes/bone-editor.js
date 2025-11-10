const express = require('express');
const { db } = require('../db');
const router = express.Router();

// Save bone measurements (complex insert)
router.post('/api/bones/complete', async (req, res) => {
  try {
    const { specimenNumber, museumId, boneName, boneType, sex, user, localityData, measurements } = req.body;
    
    console.log('Received data:', { specimenNumber, museumId, boneName, boneType, sex, user, localityData, measurements });
    
    // Determine which table to use based on bone type
    const axialBones = ['sacrum', 'cervical_vertebrae', 'thoracic_vertebrae', 'lumbar_vertebrae'];
    const cranialBones = ['cranium'];
    const mandibleBones = ['mandible'];
    
    const isAxialBone = axialBones.includes(boneType);
    const isCranialBone = cranialBones.includes(boneType);
    const isMandibleBone = mandibleBones.includes(boneType);
    
    let measurementsTable;
    let useSpecimenId = false; // Flag to determine if we use specimen_id or bone_id
    
    if (isAxialBone) {
      measurementsTable = 'axial_measurements';
    } else if (isCranialBone) {
      measurementsTable = 'cranium_measurements';
      useSpecimenId = true;
    } else if (isMandibleBone) {
      measurementsTable = 'mandible_measurements';
      useSpecimenId = true;
    } else {
      measurementsTable = 'appendicular_measurements';
    }
    
    console.log('Using table:', measurementsTable);
    console.log('Using specimen_id:', useSpecimenId);
    
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
        VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?)
      `;
      const [specimenResult] = await db.promise().query(specimenQuery, [
        specimenName,
        parseInt(specimenNumber),
        parseInt(museumId),
        sex,
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

module.exports = router;