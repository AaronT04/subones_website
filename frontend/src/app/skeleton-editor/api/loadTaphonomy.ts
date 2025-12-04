import type { TaphonomyData } from "@/lib/api/dataTypes";

export async function loadTaphonomy(
  API_URL_ROOT: string,
  specimen_id: number,
  setAPI: any
) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  const res = await fetch(
    `${API_URL_ROOT}/api/taphonomy/all/${specimen_id}`,
    { headers }
  );

  if (!res.ok) {
    console.error("Failed to load taphonomy:", await res.text());
    return;
  }

  const taphRows: TaphonomyData[] = await res.json();

  // Integrate into EditSkeletonAPI
  setAPI((prev: any) => ({
    ...prev,
    taphonomy: taphRows,
    specimen: {
      ...prev.specimen,
      specimen_id
    }
  }));
}
