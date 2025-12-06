import type { IForm, ILocality } from "../componentTypes";
import type {DecodedToken} from "../dataTypes"
import type {SpecimenBody} from "@/lib/api/apiTypes"
export async function loadSpecimen(
    specimenId : number, 
    form_ctx : IForm, 
    loc_ctx : ILocality,
) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/specimen/${specimenId}`);
    if(res.ok) {
        const body : SpecimenBody = await res.json();
        form_ctx.update({
            specimenNumber: String(body.specimen_number),
            museumId: String(body.museum_id),
            sex: String(body.sex)
        });
        loc_ctx.update({
            region: body.region,
            broadRegion: body.broad_region,
            country: body.country,
            locality: body.locality
        });
    }
}