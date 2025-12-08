import { IAllTaphonomy } from "../componentTypes";
import type { TaphonomyData } from "@/lib/api/dataTypes";


export async function loadAllTaphonomy(specimenId : number, ctx : IAllTaphonomy) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/taphonomy/all/${specimenId}`);
    const taphRows: TaphonomyData[] = await res.json();
    if(res.ok) {
        const record : Record<string, TaphonomyData> = {}
        for(const r of taphRows) {
            record[r.bone_name] = r;
        }

        ctx.update(record);
    }
    
}