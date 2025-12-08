import type { PostcranialMetrics } from "../dataTypes";
import {post} from "@/lib/api/post-crud"

export async function savePostcranialMetrics(data : PostcranialMetrics, skeletonId : number) {
    const body = data;
    console.log(body);
    console.log(await post(body, "postcranial_metrics", skeletonId));
    
}