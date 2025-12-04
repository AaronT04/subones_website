export type SkullData = {
    hasCranium: boolean;
    hasMandible: boolean;
}

export type FormData = {
    specimenNumber: string;
    museumId: string;
    sex: string;
}

export type Craniometrics = {
  craniumMetrics: Record<string, number>
  mandibleMetrics: Record<string, number>
}


export type LocalityData = {
  broadRegion: string;
  country: string;
  locality: string;
  region: string;
}

export type CranialNonmetric = Record<string, string>

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

export type Morphology = Record<string, Record<string, number | null>>

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