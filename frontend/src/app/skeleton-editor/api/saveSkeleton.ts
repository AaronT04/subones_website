// app/skeleton-editor/api/saveSkeleton.ts
import { EditSkeletonAPI } from "../skeleton-editor-types";
import { loadCraniometrics } from "./loadCraniometrics";
import { saveCraniometrics } from "./saveCraniometrics";
import { saveInventory } from "./inventoryUtils";
import {saveNonmetrics} from "./saveNonmetrics";
import { savePostcranialMetrics } from "./postcranialMetricsAPI";
import { saveAllTaphonomy } from "./saveTaphonomy";
import { saveAllDentalInventory } from "./saveAllDentalInventory";
import { saveAllMorphology } from "./saveAllMorphology";

import { saveSpecimen } from '@/lib/api/save/saveSpecimen'

/**
 * Saves the skeleton and its related data (specimen, taxonomy, etc.)
 * back to the backend using existing /api routes.
 *
 * @param API_URL_ROOT - Root URL of your backend
 * @param api - The full EditSkeletonAPI object from context
 * @returns A success/failure message or thrown error
 */
export async function saveSkeletonData(API_URL_ROOT: string, api: EditSkeletonAPI, setAPI: any) {
  try {
    console.log("💾 Saving skeleton data...");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated. Please log in first.");
    let specimenId = api.specimen.specimen_id;
    
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
    let resultID = await saveSpecimen(specimenBody, specimenId, token);
    setAPI(prev => ({
                ...prev,
                specimen: {
                    ...prev.specimen,
                    specimen_id: resultID
                }
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
    saveTaxonomy(taxonomyBody, specimenId, token);
    // --- 3️⃣ Save skeleton record itself ---
    const skeletonBody = {
      specimen_id: specimenId,
      skeleton_type: "full",
      skeleton_name: api.specimen.skeleton_name,
    };
    saveSkeleton(skeletonBody, api.skeleton_id, token);
    await saveCraniometrics(API_URL_ROOT, api, specimenId);
    await saveInventory("cranial", specimenId, api.cranial_inventory);
    await saveInventory("postcranial", specimenId, api.postcranial_inventory);
    await savePostcranialMetrics(api.skeleton_id, api.postcranial_metrics);
    await saveNonmetrics(api, specimenId);
    await saveAllTaphonomy(api, specimenId);
    await saveAllDentalInventory(api, specimenId); 
    await saveAllMorphology(api, specimenId);
    console.log(api);

    return { success: true, message: "Skeleton saved successfully." };


  } catch (error: any) {
    console.error("❌ Error saving skeleton data:", error);
    return { success: false, message: error.message };
  }

}



const saveTaxonomy = async (taxonomyBody, specimenId, token) => {
      // ✅ Step 1: Check if taxonomy already exists for this specimen
    const existingTaxonomyRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/taxonomy/bySpecimen/${specimenId}`,
    {
        headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
        },
    }
    );

    let taxonomyMethod = "POST";
    let taxonomyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/taxonomy`;

    if (existingTaxonomyRes.ok) {
      const taxonomies = await existingTaxonomyRes.json();

      // if there is already a taxonomy for this specimen
      if (Array.isArray(taxonomies) && taxonomies.length > 0) {
          const taxonomyId = taxonomies[0].taxonomy_id;
          taxonomyMethod = "PUT";
          taxonomyUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/taxonomy/${taxonomyId}`;
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
}
const saveSkeleton = async (skeletonBody, skeletonId, token) => {
  const skeletonMethod = skeletonId && skeletonId > 0 ? "PUT" : "POST";
  const skeletonUrl =
    skeletonMethod === "PUT"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/skeletal_inventory/${skeletonId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/skeletal_inventory`;

  const skeletonRes = await fetch(skeletonUrl, {
    method: skeletonMethod,
    headers: { "Content-Type": "application/json",
      "authorization": `Bearer ${token}`
      },
    body: JSON.stringify(skeletonBody),
  });

  if (!skeletonRes.ok)
    throw new Error(`Skeleton save failed (${skeletonRes.status})`);
}