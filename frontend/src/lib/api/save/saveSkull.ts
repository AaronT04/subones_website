import type { SkullData } from "../dataTypes";
import {post} from "@/lib/api/post-crud"

export async function saveSkull(data : SkullData, specimenId : number) {
    const body = {
        has_cranium: data.hasCranium,
        has_mandible: data.hasMandible
    }
    post(body, "skull", specimenId);
}