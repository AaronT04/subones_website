import { IMeasurements } from "../componentTypes";

export async function loadMeasurements(boneId : number, ctx: IMeasurements) {
    const measurementsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone_metrics/${boneId}}`);
    const measurementsData = await measurementsRes.json();
    if(measurementsRes.ok) {
        ctx.update(measurementsData);
    }
}