import type { TaphonomyData } from "../dataTypes";

export async function saveSingleTaphonomy(data : TaphonomyData, specimenId : number, boneName : string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/taphonomy/${specimenId}/${encodeURIComponent(boneName)}`;
    const body = {
        bone_condition: data.bone_condition,
        surface_exposure: data.surface_exposure,
        bone_color: data.bone_color,
        staining: data.staining,
        surface_damage: data.surface_damage,
        adherent_materials: data.adherent_materials,
        modifications: data.modifications,
        comments: data.comments ?? "",
    };
    const token = localStorage.getItem('token');
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
        throw new Error(`Failed to save taphonomy for bone ${boneName}`);
    }

}
export async function saveAllTaphonomy(data : Record<string, TaphonomyData>, specimenId : number) {
      if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID.");
    for (const boneName of Object.keys(data)) {
        await saveSingleTaphonomy(data[boneName], specimenId, boneName);
    }

    return { success: true };

}
