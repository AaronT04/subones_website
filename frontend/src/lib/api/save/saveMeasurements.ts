import { Measurements } from "../dataTypes"
import { post } from "../post-crud"

export async function saveMeasurements(data : Measurements, boneId : number,) {
    const body = {bone_id: boneId, measurements: data}
    await post(body, "bone_metrics", boneId);

}