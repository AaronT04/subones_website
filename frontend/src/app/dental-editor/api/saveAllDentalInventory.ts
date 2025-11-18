import type { DentalAPI, Tooth } from "../dental-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

export async function saveAllDentalInventory(api: DentalAPI, specimenId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  const specimen_id = api.specimen.specimen_id;

  const res = await fetch(`${API_URL_ROOT}/api/dental/${specimenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(api.dental_inventory)
  });

  if (!res.ok) throw new Error("Dental save failed");

  return { success: true };
}
