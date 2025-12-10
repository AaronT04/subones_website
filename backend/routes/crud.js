const express = require('express');
const { db } = require('../db');
const {authenticateToken} = require('../middleware/auth');

function useCrudRoutes(app) {
    // -------------------- GENERIC CRUD --------------------
    function makeCrudRoutes(table, pk, allowedFields) {
    app.get(`/api/${table}`, (req, res) => {
        const {
        q,                 // search term
        limit = 25,        // page size
        offset = 0,        // offset
        sort = pk,         // column to sort by
        dir = 'ASC',       // ASC | DESC
        } = req.query;

        // Validate sort & dir
        const allowedSorts = new Set([pk, ...allowedFields]);
        const SAFE_SORT = allowedSorts.has(String(sort)) ? String(sort) : pk;
        const SAFE_DIR = String(dir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        // WHERE for fuzzy search across pk + fields
        const searchable = [pk, ...allowedFields];
        const where = q
        ? `WHERE CONCAT_WS(' ', ${searchable.map(c => `\`${c}\``).join(', ')}) LIKE ?`
        : '';

        const params = [];
        if (q) params.push(`%${q}%`);
        params.push(Number(limit), Number(offset));

        const sql = `
        SELECT * FROM \`${table}\`
        ${where}
        ORDER BY \`${SAFE_SORT}\` ${SAFE_DIR}
        LIMIT ? OFFSET ?
        `;

        db.query(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
        });
    });

    // Get one
    app.get(`/api/${table}/:id`, (req, res) => {
        db.query(`SELECT * FROM ${table} WHERE ${pk} = ?`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
        });
    });

    // Create
    app.post(`/api/${table}`, authenticateToken, async (req, res) => {
    try {
        const body = {};
        for (const f of allowedFields) {
        if (req.body[f] !== undefined) body[f] = req.body[f];
        }
        if (!Object.keys(body).length)
        return res.status(400).json({ error: "No valid fields" });

        const [result] = await db.promise().query(`INSERT INTO ${table} SET ?`, body);

        const pkName = pk;
        res.status(201).json({ [pkName]: result.insertId, ...body });
    } catch (err) {
        console.error("Error inserting:", err);
        res.status(500).json({ error: err.message });
    }
    });

    // Upsert logic
    app.post(`/api/${table}/:id`, authenticateToken, async (req, res) => {
        try {
        const id = req.params.id;
        const body = {};
        for (const f of allowedFields) {
            if (req.body[f] !== undefined) body[f] = req.body[f];
        }
        if (!Object.keys(body).length)
            return res.status(400).json({ error: "No valid fields" });

        const sql = `
            INSERT INTO ${table} (${[pk, ...Object.keys(body)].map(c => `\`${c}\``).join(", ")})
            VALUES (${[pk, ...Object.keys(body)].map(() => "?").join(", ")})
            ON DUPLICATE KEY UPDATE ${Object.keys(body)
            .map(c => `${c} = VALUES(${c})`)
            .join(", ")}
        `;

        const values = [id, ...Object.values(body)];
        await db.promise().query(sql, values);
        res.status(201).json({ ok: true, [pk]: id });
        } catch (err) {
        console.error("Error inserting by ID:", err);
        res.status(500).json({ error: err.message });
        }
    });


    // Update
    app.put(`/api/${table}/:id`, authenticateToken, (req, res) => {
        const body = {};
        const id = req.params.id;
        for (const f of allowedFields) {
        if (req.body[f] !== undefined) body[f] = req.body[f];
        }
        if (!Object.keys(body).length) {
        return res.status(400).json({ error: 'No valid fields' });
        }
        db.query(`UPDATE ${table} SET ? WHERE ${pk} = ?`, [body, req.params.id], (err, result) => {
        if (err) { 
            console.error("Error in app.put:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ [pk]: id, ...body });
        });
    });

    // Delete
    app.delete(`/api/${table}/:id`, authenticateToken, (req, res) => {
        db.query(`DELETE FROM ${table} WHERE ${pk} = ?`, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result.affectedRows) return res.status(404).json({ error: 'Not found' });
        res.json({ ok: true });
        });
    });
    }


    // -------------------- REGISTER YOUR TABLES --------------------
    makeCrudRoutes('specimen', 'specimen_id', ['museum_id','specimen_name','specimen_number','broad_region','country','locality','region','sex','user_id']);
    makeCrudRoutes('museum', 'museum_id', ['museum_name','broad_region','country','locality','region']);
    makeCrudRoutes('taxonomy', 'taxonomy_id', ['parvorder','superfamily','family','subfamily','genus','species','specimen_id']);
    makeCrudRoutes('taphonomy', 'taphonomy_id', ['specimen_id','bone_id','date_of_record']);
    makeCrudRoutes('bone', 'bone_id', ['skeleton_id','bone_type','bone_name', 'specimen_id']);
    makeCrudRoutes('skeleton', 'skeleton_id', ['specimen_id', 'skeleton_type', 'skeleton_name']);
    makeCrudRoutes('cranium_measurements', 'specimen_id', ['maximum_cranial_length', 'maximum_cranial_breadth',
                'bizygomatic_diameter', 'basion_bregma_height', 'cranial_base_length', 'basion_prosthion_length',
                'maxillo_alveolar_breadth', 'maxillo_alveolar_length', 'biauricular_breadth', 'upper_facial_height',
                'minimum_frontal_breadth', 'upper_facial_breadth', 'nasal_height', 'nasal_breadth', 'orbital_breadth',
                'orbital_height', 'biorbital_breadth', 'interorbital_breadth', 'frontal_chord', 'parietal_chord',
                'occipital_chord', 'foramen_magnum_length', 'foramen_magnum_breadth', 'mastoid_height']);
    makeCrudRoutes('mandible_measurements', 'specimen_id', ['chin_height', 'height_of_the_mandibular_body_at_the_mental_foramen',
                'breadth_of_the_mandibular_body_at_the_mental_foramen', 'bigonial_width', 'bicondylar_breadth',
                'minimum_ramus_breadth', 'maximum_ramus_breadth', 'maximum_ramus_height', 'mandibular_length', 'mandibular_angle']);
    makeCrudRoutes('has_skeleton', 'specimen_id', ['specimen_id', 'skeleton_id']);

    // -------------------- FACIAL, LATERAL, BASILAR, MANDIBULAR, MACROMORPHOSCOPICS --------------------
    makeCrudRoutes('facial', 'specimen_id', [
    'left_infraorbital_suture', 'right_infraorbital_suture',
    'left_infraorbital_foramen', 'right_infraorbital_foramen',
    'left_zygomaticofacial_foramen', 'right_zygomaticofacial_foramen',
    'metopic_suture',
    'left_supraorbital_notch', 'right_supraorbital_notch',
    'left_supraorbital_foramen', 'right_supraorbital_foramen',
    'left_supratrochlear_notch', 'right_supratrochlear_notch',
    'left_coronal_ossicle', 'right_coronal_ossicle',
    'left_epipteric_bone', 'right_epipteric_bone'
    ]);

    makeCrudRoutes('lateral', 'specimen_id', [
    'bregmatic_bone', 'saggital_ossicle',
    'left_parietal_foramen', 'midline_parietal_foramen', 'right_parietal_foramen',
    'apical_bone', 'inca_bone',
    'left_lambdoid_ossicle', 'right_lambdoid_ossicle',
    'left_asterionic_bone', 'right_asterionic_bone',
    'left_ossicle_in_occipitomastoid_suture', 'right_ossicle_in_occipitomastoid_suture',
    'left_parietal_notch_bone', 'right_parietal_notch_bone',
    'left_auditory_exostosis', 'right_auditory_exostosis',
    'left_mastoid_foramen_number', 'right_mastoid_foramen_number',
    'left_mastoid_foramen_location', 'right_mastoid_foramen_location'
    ]);

    makeCrudRoutes('basilar', 'specimen_id', [
    'left_condylar_canal', 'right_condylar_canal',
    'left_divided_hypoglossal_canal', 'right_divided_hypoglossal_canal',
    'left_tympanic_dehiscence', 'right_tympanic_dehiscence',
    'left_foramen_spinosum_incomplete', 'right_foramen_spinosum_incomplete',
    'left_foramen_ovale_incomplete', 'right_foramen_ovale_incomplete',
    'left_pterygospinous_bridge', 'right_pterygospinous_bridge',
    'left_pterygoalar_bridge', 'right_pterygoalar_bridge',
    'palatine_torus_development', 'palatine_torus_location'
    ]);

    makeCrudRoutes('mandibular', 'specimen_id', [
    'left_mylohyoid_bridge_development', 'right_mylohyoid_bridge_development',
    'left_mylohyoid_bridge_location', 'right_mylohyoid_bridge_location',
    'left_mental_foramen', 'right_mental_foramen',
    'left_mandibular_torus', 'right_mandibular_torus'
    ]);

    makeCrudRoutes('macromorphoscopics', 'specimen_id', [
    'anterior_nasal_spine', 'inferior_nasal_aperture',
    'interorbital_breadth', 'malar_tubercule',
    'nasal_aperture_shape', 'nasal_aperture_width',
    'nasal_bone_contour', 'nasal_bone_shape',
    'nasal_overgrowth', 'nasofrontal_suture',
    'orbital_shape', 'postbregmatic_depression',
    'posterior_zygomatic_tubercule', 'supranasal_suture',
    'zygomaticomaxillary_suture_course', 'transverse_palatine_suture'
    ]);

    makeCrudRoutes('skull', 'specimen_id', ['has_cranium', 'has_mandible']);

    makeCrudRoutes('postcranial_metrics', 'skeleton_id', [
  'clavicle_maximum_length',
  'clavicle_anterior_sagittal_posterior_diameter_at_midshaft',
  'clavicle_superior_vertical_inferior_diameter_at_midshaft',

  'scapula_height_anatomical_breadth',
  'scapula_breadth_anatomical_length',

  'humerus_maximum_length',
  'humerus_epicondylar_breadth',
  'humerus_vertical_diameter_of_head',
  'humerus_maximum_diameter_at_midshaft',
  'humerus_minimum_diameter_at_midshaft',

  'radius_maximum_length',
  'radius_anterior_posterior_sagittal_diameter_at_midshaft',
  'radius_medial_lateral_transverse_diameter_at_midshaft',

  'ulna_maximum_length',
  'ulna_anterior_posterior_dorso_volar_diameter',
  'ulna_medial_lateral_transverse_diameter',
  'ulna_physiological_length',
  'ulna_minimum_circumference',

  'sacrum_anterior_length',
  'sacrum_anterior_superior_breadth',
  'sacrum_maximum_transverse_diameter_of_base',
  'sacrum_s1_height',

  'os_coxae_height',
  'os_coxae_iliac_breadth',
  'os_coxae_pubis_length',
  'os_coxae_ischium_length',

  'femur_maximum_length',
  'femur_bicondylar_length',
  'femur_epicondylar_breadth',
  'femur_maximum_head_diameter',
  'femur_anterior_posterior_sagittal_subtrochanteric_diameter',
  'femur_medial_lateral_transverse_subtrochanteric_diameter',
  'femur_anterior_posterior_sagittal_midshaft_diameter',
  'femur_medial_lateral_transverse_midshaft_diameter',
  'femur_midshaft_circumference',

  'tibia_condylo_malleolar_length',
  'tibia_maximum_proximal_epiphyseal_breadth',
  'tibia_distal_epiphyseal_breadth',
  'tibia_maximum_diameter_at_the_nutrient_foramen',
  'tibia_medial_lateral_transverse_diameter_at_the_nutrient_foramen',
  'tibia_circumference_at_the_nutrient_foramen',

  'fibula_maximum_length',
  'fibula_maximum_diameter_at_midshaft',

  'calcaneus_maximum_length',
  'calcaneus_middle_breadth',

  'talus_talus_height',

  'cervical_vertebrae_c2',
  'cervical_vertebrae_max_c3_c7_height',
  'thoracic_vertebrae_max_t1_t12_height',
  'lumbar_vertebrae_max_l1_l5_height'
]);



}
module.exports = {useCrudRoutes}