import type { DentalAPI, Tooth } from "../dental-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

export async function saveAllMorphology(api: DentalAPI, specimenId: number) {
  const token = localStorage.getItem("token");
  if(!api.morphology.length) {
    return;
  }

  await fetch(`${API_URL_ROOT}/api/morphology/${specimenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(api.morphology)
  });
}
