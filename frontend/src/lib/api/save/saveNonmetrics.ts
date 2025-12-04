import type { CranialNonmetric } from "../dataTypes";
import {extractColumnsAndSave} from "../extractColumnsAndSave";

export async function saveNonmetrics(data : Record<string, CranialNonmetric>, specimenId : number) {
    if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID");

    await extractColumnsAndSave<string>("facial", data["facial"], specimenId);
    await extractColumnsAndSave<string>("lateral", data["lateral"], specimenId);
    await extractColumnsAndSave<string>("basilar", data["basilar"], specimenId);
    await extractColumnsAndSave<string>("mandibular", data["mandibular"], specimenId);
    await extractColumnsAndSave<string>("macromorphoscopics", data["macromorphoscopics"], specimenId);
}