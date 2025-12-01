import type {FormData, LocalityData, Craniometrics, Measurement, TaphonomyData, Inventory, DentalInventory, SkullData, Morphology, CranialNonmetric} from "@/lib/api/types"
import React from 'react'

export interface IForm extends FormData {
    update : React.Dispatch<React.SetStateAction<FormData>>
}

export interface ILocality extends LocalityData {
    update : React.Dispatch<React.SetStateAction<LocalityData>>
}

export interface ICraniometrics extends Craniometrics {
    updateCranium : React.Dispatch<React.SetStateAction<Measurement[]>>
    updateMandible : React.Dispatch<React.SetStateAction<Measurement[]>>
}

export interface ISkull extends SkullData {
    update: React.Dispatch<React.SetStateAction<SkullData>>
}

export interface IAllTaphonomy {
    allTaphonomy : Record<string, TaphonomyData>
    update : React.Dispatch<React.SetStateAction<Record<string, TaphonomyData>>>
}

export interface IInventory {
    inventory: Record<string, Inventory>
    update : React.Dispatch<React.SetStateAction<Record<string, Inventory>>>
}

export interface ICranialNonmetrics {
    allNonmetrics : Record<string, CranialNonmetric>
    update : React.Dispatch<React.SetStateAction<Record<string, CranialNonmetric>>>
}

export interface IDental {
    inventory : Record<string, DentalInventory>
    updateInventory: React.Dispatch<React.SetStateAction<Record<string, DentalInventory>>>
    morphology : Record<string, Morphology>
    updateMorphology: React.Dispatch<React.SetStateAction<Record<string, Morphology>>>
}