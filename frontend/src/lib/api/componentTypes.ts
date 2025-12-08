import type {FormData, LocalityData, PostcranialMetrics, Craniometrics, Measurement, TaphonomyData, Inventory, DentalInventory, SkullData, SkeletonData, Morphology, CranialNonmetric} from "@/lib/api/dataTypes"
import React from 'react'

export interface IForm extends FormData {
    update : React.Dispatch<React.SetStateAction<FormData>>
}

export interface ILocality extends LocalityData {
    update : React.Dispatch<React.SetStateAction<LocalityData>>
}

export interface ICraniometrics extends Craniometrics {
    updateCranium : React.Dispatch<React.SetStateAction<Record<string, number>>>
    updateMandible : React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export interface ISkull extends SkullData {
    update: React.Dispatch<React.SetStateAction<SkullData>>
}

export interface ISkeleton extends SkeletonData {
    update: React.Dispatch<React.SetStateAction<SkeletonData>>
}

export interface IPostcranialMetrics {
    metrics : PostcranialMetrics
    update: React.Dispatch<React.SetStateAction<PostcranialMetrics>>
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
    morphology : Morphology
    updateMorphology: React.Dispatch<React.SetStateAction<Morphology>>
}