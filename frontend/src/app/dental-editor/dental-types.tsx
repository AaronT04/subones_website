export type User = {
    user_id:  number
    user_name: string
}

export type Specimen = {
    specimen_id: number,
    specimen_number: number,
    museum_id: number,
    sex: string
}

export type Taxonomy = {
    parvorder: string,
    superfamily: string,
    family: string,
    subfamily: string,
    genus: string
}

export type Locality = {
    broad_region: string,
    country: string,
    locality: string,
    region: string
}

export type Tooth = {
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
    morph_value: number
}

export type DentalAPI = {
    dental_inventory: Tooth[]
    morphology: Morphology[]
    user: User
    specimen: Specimen
    taxonomy: Taxonomy
    locality: Locality

}

export const DEFAULT_DENTAL_API = {
    dental_inventory: [],
    morphology: [],
    user: {
    user_id: -1,
    user_name: "",
  },
    specimen: {
    specimen_id: -1,
    skeleton_name: "",
    specimen_number: 0,
    museum_id: 0,
    sex: "",
    },
  taxonomy: {
      parvorder: "",
      superfamily: "",
      family: "",
      subfamily: "",
      genus: "",
    },
    locality: {
        broad_region: "",
        country: "",
        locality: "",
        region: "",
    },
}