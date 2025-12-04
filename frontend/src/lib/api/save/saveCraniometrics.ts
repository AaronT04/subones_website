import type { Craniometrics, DecodedToken } from "@/lib/api/dataTypes";
import {extractColumnsAndSave} from "@/lib/api/extractColumnsAndSave"

export async function saveCraniometrics(data : Craniometrics, specimenId : number) {

    if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID");

    await extractColumnsAndSave<number>("cranium_measurements", data.craniumMetrics, specimenId);
    await extractColumnsAndSave<number>("mandible_measurements", data.mandibleMetrics, specimenId);
}