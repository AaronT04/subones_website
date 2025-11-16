import type { EditSkeletonAPI, Tooth } from "../skeleton-editor-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

export async function saveAllMorphology(api: EditSkeletonAPI) {
  const token = localStorage.getItem("token");
  const specimen_id = api.specimen.specimen_id;

  await fetch(`${API_URL_ROOT}/api/morphology/${specimen_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(api.morphology)
  });
}
