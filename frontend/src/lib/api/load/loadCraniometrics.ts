import { ICraniometrics } from "../componentTypes";

export async function loadCraniometrics(specimenId : number, ctx : ICraniometrics) {
    const cranium_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cranium_measurements/${specimenId}`);
    console.log(cranium_res);
    const mandible_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mandible_measurements/${specimenId}`);
    if(cranium_res.ok) {
        
        const cranium_body : Record<string, number> = await cranium_res.json();
        ctx.updateCranium(cranium_body);
    }
    if(mandible_res.ok) {
        const mandible_body : Record<string, number> = await mandible_res.json();
        ctx.updateMandible(mandible_body);
    }
}