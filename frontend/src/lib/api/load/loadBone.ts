import { BoneBody } from "../apiTypes";
import { IBone } from "../componentTypes";

export async function loadBone(specimenId : number, ctx : IBone) {
    const boneRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone/bySpecimen/${specimenId}`);
    if(!boneRes.ok) throw new Error(`Failed to fetch bone: ${boneRes.status}`);
    const boneData : BoneBody = await boneRes.json();
    ctx.update({boneName: boneData.bone_name})
    return boneData.bone_id ?? -1;
}