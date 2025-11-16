import type { EditSkeletonAPI, Taphonomy } from "../skeleton-editor-types";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL!;

// Save ALL taphonomy entries for this specimen
export async function saveAllTaphonomy(api: EditSkeletonAPI) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated.");

  const specimen_id = api.specimen.specimen_id;
  if (!specimen_id || specimen_id < 1)
    throw new Error("Invalid specimen ID.");

  // Loop over each bone-level Taphonomy entry
  for (const t of api.taphonomy) {
    await saveSingleTaphonomy(specimen_id, t, token);
  }

  return { success: true };
}

// Save a single bone's taphonomy entry
async function saveSingleTaphonomy(
  specimen_id: number,
  t: Taphonomy,
  token: string
) {

  const url = `${API_URL_ROOT}/api/taphonomy/${specimen_id}/${encodeURIComponent(t.bone_name)}`;

  const body = {
    bone_condition: t.bone_condition,
    surface_exposure: t.surface_exposure,
    bone_color: t.bone_color,
    staining: t.staining,
    surface_damage: t.surface_damage,
    adherent_materials: t.adherent_materials,
    modifications: t.modifications,
    comments: t.comments ?? "",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Taph SAVE ERROR:", text);
    throw new Error(`Failed to save taphonomy for bone ${t.bone_name}`);
  }
}
