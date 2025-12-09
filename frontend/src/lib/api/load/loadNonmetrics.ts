import { ICranialNonmetrics } from "../componentTypes";
import {produce} from "immer"

export async function loadNonmetrics(specimenId : number, ctx : ICranialNonmetrics) {
    async function loadCategory(endpoint : string) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}/${specimenId}`);
        if(res.ok) {
            const body : Record<string, string> = await res.json();
            ctx.update(prev =>
                produce(prev, draft => {
                    draft[endpoint] = body;
                }
            ))
            console.log(body);
            
        }
        
    }
    const categories = ['facial', 'lateral', 'basilar', 'mandibular', 'macromorphoscopics'];
    for(const c of categories) {
        loadCategory(c);
    }

}