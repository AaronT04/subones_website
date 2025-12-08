import { ISkeleton } from "../componentTypes";
import { post } from "../post-crud";
import type { SkeletonBody } from "../apiTypes";

export async function saveSkeleton(skeletonId : number, specimenId : number, ctx : ISkeleton) {
    const token = localStorage.getItem('token');
    if(!token) {
        throw new Error();
    }
    const body : SkeletonBody = {
        specimen_id: specimenId,
        skeleton_type: "full",
        skeleton_name: ctx.skeleton_name
    }
    const skeletonMethod = skeletonId && skeletonId > 0 ? "PUT" : "POST";
    const skeletonUrl =
    skeletonMethod === "PUT"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/skeleton/${skeletonId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/skeleton`;

    const skeletonRes = await fetch(skeletonUrl, {
    method: skeletonMethod,
    headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
        },
    body: JSON.stringify(body),
    });
    if (!skeletonRes.ok)
    throw new Error(`Skeleton save failed (${skeletonRes.status})`);
    const skeletonResult = await skeletonRes.json();
    return Number(skeletonResult.skeleton_id);
}