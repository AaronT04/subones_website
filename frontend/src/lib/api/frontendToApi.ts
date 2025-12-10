import type {SpecimenBody, MorphologyBody, BoneBody} from "@/lib/api/apiTypes"
import type {FormData, LocalityData, DecodedToken, Craniometrics, Morphology, DentalInventory} from "@/lib/api/dataTypes"

export const getSpecimenBody = (formContext: FormData, localityContext : LocalityData, userData : DecodedToken) => {
    const specimenBody : SpecimenBody = {
        museum_id : Number(formContext.museumId),
        specimen_name:  "SUB-" + formContext.specimenNumber,
        specimen_number: Number(formContext.specimenNumber),
        broad_region: localityContext.broadRegion,
        country: localityContext.country,
        locality: localityContext.locality,
        region: localityContext.region,
        sex: formContext.sex,
        user_id: userData.id
    }
    return specimenBody;
}

export const getBoneBody = (boneName : string, specimenId : number) => {
    const boneBody : BoneBody = {
                    skeleton_id: null,
                    bone_type: boneName.toLowerCase().replace(/\s+/g, '_'),
                    bone_name: boneName,
                    specimen_id: specimenId
                }
    return boneBody;
}


export const getDentalInventoryBody = (record : Record<string, DentalInventory>) => {
    const arr: DentalInventory[] = [];
    for(const tooth_name of Object.keys(record)) {
        arr.push({
            ...record[tooth_name],
            tooth_name
        })
    }
    return arr;
}


export const getMorphologyBody = (record : Morphology) => {
    const arr : MorphologyBody[] = [];
    for(const morph_name of Object.keys(record)) {
        for(const tooth_name of Object.keys(record[morph_name])) {
            if((record[morph_name])[tooth_name] != null) {
                arr.push({
                    morph_name,
                    tooth_name,
                    morph_value: (record[morph_name])[tooth_name]
                    })
            }
        }
    }
    return arr;
}