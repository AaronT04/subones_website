import type { ISkull } from "../componentTypes";
import type { SkullBody } from "../apiTypes";
export async function loadSkull(specimenId : number, skullContext : ISkull) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skull/${specimenId}`);
    if(res.ok) {
        const body : SkullBody  = await res.json();
        skullContext.update({
            hasCranium: body.has_cranium,
            hasMandible: body.has_mandible
        })
    }
}   