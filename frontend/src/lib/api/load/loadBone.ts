import { BoneBody } from "../apiTypes";
import { IBone } from "../componentTypes";

export async function loadBone(specimenId : number, ctx : IBone) {
    //console.log("...")
    const boneRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone/bySpecimen/${specimenId}`);
    //console.log("...")
    
    if(!boneRes.ok) 
    {
        //console.log("bone error")
        throw new Error(`Failed to fetch bone: ${boneRes.status}`);
    }
    //console.log("got bone response")
    const boneData : BoneBody = await boneRes.json();
    //console.log("got bone data")
    ctx.update({boneName: boneData.bone_name})
    return boneData.bone_id ?? -1;
}