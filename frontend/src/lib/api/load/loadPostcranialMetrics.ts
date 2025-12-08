import { IPostcranialMetrics } from "../componentTypes";

export async function loadPostcranialMetrics(skeletonId : number, ctx : IPostcranialMetrics) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postcranial_metrics/${skeletonId}`);
    const data : Record<string, number> = await res.json();
    ctx.update(data)
}