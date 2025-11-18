import { loadDentalInventory } from "./loadDentalInventory";
import { loadMorphology } from "./loadMorphology";
import { DEFAULT_DENTAL_API } from "../dental-types";
import {jwtDecode} from "jwt-decode"

type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};

export async function loadDentalData(API_URL_ROOT: string, setAPI: any) {
  try {
    

    const specimenId = 7; //!!!!!!!!!!!!!!!!!
    const specimenResponse = await fetch(`${API_URL_ROOT}/api/specimen/${specimenId}`);
    const specimenData = await specimenResponse.json();

    let taxonomyData: Partial<typeof DEFAULT_DENTAL_API["taxonomy"]> | null = null;
    try {
      const taxonomyResponse = await fetch(`${API_URL_ROOT}/api/taxonomy/bySpecimen/${specimenId}`);
      if (taxonomyResponse.ok) {
        const taxonomyList = await taxonomyResponse.json();
        taxonomyData = Array.isArray(taxonomyList) ? taxonomyList[0] : taxonomyList;
      }
    } catch {
      console.warn("No taxonomy found for specimen — continuing without it.");
    }

    setAPI((prev: any) => ({
      ...prev,
      specimen: {
        specimen_id: specimenData.specimen_id,
        specimen_number: specimenData.specimen_number,
        museum_id: specimenData.museum_id,
        sex: specimenData.sex || "",
      },
      taxonomy: taxonomyData
        ? {
            parvorder: taxonomyData.parvorder || "",
            superfamily: taxonomyData.superfamily || "",
            family: taxonomyData.family || "",
            subfamily: taxonomyData.subfamily || "",
            genus: taxonomyData.genus || "",
          }
        : prev.taxonomy,
      locality: {
        broad_region: specimenData.museum_id === 1 ? "East Coast" : specimenData.broad_region || "",
        country: specimenData.museum_id === 1 ? "United States" : specimenData.country || "",
        locality: specimenData.museum_id === 1 ? "Salisbury" : specimenData.locality || "",
        region: specimenData.museum_id === 1 ? "MD" : specimenData.region || "",
      },
    }));

    await loadDentalInventory(API_URL_ROOT, specimenData.specimen_id, setAPI);
    await loadMorphology(API_URL_ROOT, specimenData.specimen_id, setAPI);
    

    console.log("✅ Dental data loaded successfully");
  } catch (error) {
    console.error("❌ Error loading dental data:", error);
  }
}
