export type SpecimenBody = {
    museum_id: number
    specimen_name: string
    specimen_number: number
    broad_region: string
    country: string
    locality: string
    region: string
    sex: string
    user_id: number | null

}

export type BoneBody = {
    bone_id?: number
    skeleton_id: number | null,
    bone_type: string,
    bone_name: string,
    condition: "",
    specimen_id: number
}

export type SkullBody = {
    has_cranium : boolean
    has_mandible : boolean
}

export type InventoryBody = {
    inv_entry_name: string
    value?: string
    taphonomy_id?: number
}

export type CraniometricsBody = {
    cranium_metrics: Record<string, number>
    mandible_metrics: Record<string, number>
}

export type MorphologyBody = {
    tooth_name: string
    morph_name: string
    morph_value: number
}

export type SkeletonBody = {
    specimen_id : number,
    skeleton_type : "full",
    skeleton_name : string
}