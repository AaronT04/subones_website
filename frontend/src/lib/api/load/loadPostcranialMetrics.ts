import { IPostcranialMetrics } from "../componentTypes";
import type { PostcranialMetrics } from "../dataTypes";

export async function loadPostcranialMetrics(skeletonId : number, ctx : IPostcranialMetrics) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcranial_metrics/${skeletonId}`);
    const data : PostcranialMetrics = await res.json();
    if(res.ok) {
        ctx.update(data);
    }
    console.log(data.ok);
    console.log(data);
    console.log(ctx);
}