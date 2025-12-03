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

export type SkullData = {
    hasCranium: boolean;
    hasMandible: boolean;
}

export type CranialNonmetric = {
    category: string
    nonmetric_name: string
    value_str: string
}

export type FormData = {
    specimenNumber: string;
    museumId: string;
    sex: string;
    user: string;
    userID: number;
}

export type Craniometrics = {
  craniumMetrics: Measurement[]
  mandibleMetrics: Measurement[]
}


export type LocalityData = {
  broadRegion: string;
  country: string;
  locality: string;
  region: string;
}

export interface TaphonomyData {
    bone_name : string,
    bone_condition: number,
    surface_exposure: boolean,
    bone_color: string,
    staining: string[],
    surface_damage: string[],
    adherent_materials: string[],
    modifications: string[],
    comments: string
}

export type DentalInventory = {
    tooth_name: string
    tooth_inv_code: number
    tooth_width: number
    tooth_height: number
    tooth_wear_code: number
    tooth_dev_code: number
}

export type Morphology = {
    tooth_name: string
    morph_name: string
    morph_value: number | null
}

export const defaultTaphonomy : TaphonomyData = {
    bone_name: "",
    bone_condition: -1,
    surface_exposure: false,
    bone_color: "",
    staining: [],
    surface_damage: [],
    adherent_materials: [],
    modifications: [],
    comments: ""
}

export type Measurement = {
    metric_name: string,
    metric_value: number
}

export type Inventory = {
    inv_entry_name: string
    value?: string
    taphonomy_id?: number
    isChecked: boolean
}

export type DecodedToken = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  exp: number;
  iat: number;
};