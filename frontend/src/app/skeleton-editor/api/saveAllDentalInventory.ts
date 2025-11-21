import type { EditSkeletonAPI, Tooth } from "../skeleton-editor-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

export async function saveAllDentalInventory(api: EditSkeletonAPI, specimen_id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");
  if(!api.dental_inventory.length) {
    return;
  }

  const res = await fetch(`${API_URL_ROOT}/api/dental/${specimen_id}`, {
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
