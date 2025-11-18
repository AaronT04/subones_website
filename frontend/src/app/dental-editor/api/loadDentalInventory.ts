import type { Tooth } from "../dental-types";

export async function loadDentalInventory(API_URL_ROOT: string, specimen_id: number, setAPI: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL_ROOT}/api/dental/${specimen_id}`, {
    headers: { authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    console.error("Failed to load dental inventory:", await res.text());
    return;
  }

  const teeth: Tooth[] = await res.json();

  setAPI((prev: any) => ({
    ...prev,
    dental_inventory: teeth
  }));
}
