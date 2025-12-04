import type { EditSkeletonAPI, Tooth } from "../skeleton-editor-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

export async function saveAllMorphology(api: EditSkeletonAPI, specimen_id: number) {
  const token = localStorage.getItem("token");
  if(!api.morphology.length) {
    return;
  }

  await fetch(`${API_URL_ROOT}/api/morphology/${specimen_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(api.morphology)
  });
}
