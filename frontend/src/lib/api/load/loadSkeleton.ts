import type {ISkeleton} from "@/lib/api/componentTypes"
import type {SkeletonBody} from "@/lib/api/apiTypes"
export async function loadSkeleton(skeletonId : number, ctx : ISkeleton) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skeleton/${skeletonId}`);
    if (!response.ok) throw new Error(`Failed to fetch skeleton: ${response.status}`);
    const skeletonData : SkeletonBody = await response.json();

    ctx.update({skeleton_name: skeletonData.skeleton_name})
    return skeletonData.specimen_id;
}