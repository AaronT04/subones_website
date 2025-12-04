import { IDental } from "../componentTypes";
import type { DentalInventory, Morphology } from "../dataTypes";
import type { MorphologyBody } from "../apiTypes";


export async function loadDental(specimenId : number, ctx : IDental) {
    const inv_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dental/${specimenId}`);
    const morph_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/morphology/${specimenId}`);
    if(inv_res.ok) {
        const teeth : DentalInventory[] = await inv_res.json();
        const record : Record<string, DentalInventory> = {}
        for(const t of teeth) {
            record[t.tooth_name] = t
        }
        ctx.updateInventory(record);
    }
    if(morph_res.ok) {
        const morph : MorphologyBody[] = await morph_res.json();
        const record : Morphology = {}
        if(morph == undefined) return;
        for(const m of morph) {
            let teeth_map = morph.find((t) => t.morph_name == m.morph_name && t.tooth_name == m.tooth_name)
            if(teeth_map) {
                for(const t of Object.keys(teeth_map)) {
                    (record[m.morph_name])[t] = m.morph_value;
                }
            }
        }
        ctx.updateMorphology(record);
    }
}