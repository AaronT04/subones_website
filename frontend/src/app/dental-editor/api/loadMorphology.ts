import type { Morphology } from "../dental-types";

export async function loadMorphology(
  API_URL_ROOT: string,
  specimen_id: number,
  setAPI: any
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL_ROOT}/api/morphology/${specimen_id}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Failed to load morphology:", await res.text());
    return;
  }

  const rows: Morphology[] = await res.json();

  setAPI((prev: any) => ({
    ...prev,
    morphology: rows,
  }));
}
