import {DentalAPI} from "../dental-types"
import { saveAllDentalInventory } from "./saveAllDentalInventory";
import { saveAllMorphology } from "./saveAllMorphology";

export async function saveDentalData(API_URL_ROOT : string, api: DentalAPI, setAPI : any) {
    try {
    console.log("💾 Saving dental data...");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in first.");

    // --- 1️⃣ Save or update specimen ---
    const specimenBody = {
      museum_id: api.specimen.museum_id,
      specimen_name: "",
      specimen_number: api.specimen.specimen_number,
      broad_region: api.locality.broad_region || "",
      country: api.locality.country || "",
      locality: api.locality.locality || "",
      region: api.locality.region || "",
      sex: api.specimen.sex || "unknown",
      user_id: api.user.user_id || null,
    };

    let specimenId = api.specimen.specimen_id;

    // Check if specimen already exists (update) or create new
    const specimenMethod = specimenId && specimenId > 0 ? "PUT" : "POST";
    const specimenUrl =
      specimenMethod === "PUT"
        ? `${API_URL_ROOT}/api/specimen/${specimenId}`
        : `${API_URL_ROOT}/api/specimen`;

    const specimenRes = await fetch(specimenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
       },
      body: JSON.stringify(specimenBody),
    });

    if (!specimenRes.ok) throw new Error(`Specimen save failed (${specimenRes.status})`);
    const specimenResult = await specimenRes.json();

    console.log(specimenResult);
    // If new, update the ID
    specimenId = specimenResult.specimen_id;
    setAPI(prev => ({
            ...prev,
            specimen: {
                specimen_id: 23,
                ...prev.specimen,
            },
    }));

        // --- 2️⃣ Save or update taxonomy ---
    const taxonomyBody = {
    parvorder: api.taxonomy.parvorder || "",
    superfamily: api.taxonomy.superfamily || "",
    family: api.taxonomy.family || "",
    subfamily: api.taxonomy.subfamily || "",
    genus: api.taxonomy.genus || "",
    species: "", // optional for now
    specimen_id: specimenId,
    };
    
    // ✅ Step 1: Check if taxonomy already exists for this specimen
    const existingTaxonomyRes = await fetch(
    `${API_URL_ROOT}/api/taxonomy/bySpecimen/${specimenId}`,
    {
        headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
        },
    }
    );

    let taxonomyMethod = "POST";
    let taxonomyUrl = `${API_URL_ROOT}/api/taxonomy`;

    if (existingTaxonomyRes.ok) {
    const taxonomies = await existingTaxonomyRes.json();

    // if there is already a taxonomy for this specimen
    if (Array.isArray(taxonomies) && taxonomies.length > 0) {
        const taxonomyId = taxonomies[0].taxonomy_id;
        taxonomyMethod = "PUT";
        taxonomyUrl = `${API_URL_ROOT}/api/taxonomy/${taxonomyId}`;
    }
    }
    
    // ✅ Step 2: Save (create or update)
    const taxonomyRes = await fetch(taxonomyUrl, {
    method: taxonomyMethod,
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(taxonomyBody),
    });

    if (!taxonomyRes.ok) {
    console.warn("⚠️ Taxonomy save skipped or failed (no taxonomy yet).");
    } else {
    console.log(`✅ Taxonomy ${taxonomyMethod} successful`);
    }
    await saveAllDentalInventory(api, specimenId); 
    await saveAllMorphology(api, specimenId);

    console.log(api);
    return { success: true, message: "Skeleton saved successfully." };
    }
    catch(error : any) {
        console.error("❌ Error saving dental data:", error);
        return { success: false, message: error.message };
    }
}