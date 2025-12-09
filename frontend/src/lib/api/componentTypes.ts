import type {FormData, DecodedToken, LocalityData, PostcranialMetrics, Craniometrics, Measurements, TaphonomyData, Inventory, DentalInventory, SkullData, SkeletonData, Morphology, CranialNonmetrics, Bone} from "@/lib/api/dataTypes"
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

export interface IPostcranialMetrics extends GenericComponentInterface<PostcranialMetrics> {}

export interface IAllTaphonomy extends GenericComponentInterface<Record<string, TaphonomyData>> {}

export interface IInventory extends GenericComponentInterface<Record<string, Inventory>> {}

export interface IMeasurements extends GenericComponentInterface<Measurements> {}

export interface ICranialNonmetrics extends GenericComponentInterface<CranialNonmetrics> {}

export interface IDental {
    inventory : Record<string, DentalInventory>
    updateInventory: React.Dispatch<React.SetStateAction<Record<string, DentalInventory>>>
    morphology : Morphology
    updateMorphology: React.Dispatch<React.SetStateAction<Morphology>>
}

export interface IBone extends GenericComponentInterface<Bone> {}

export interface GenericEditorContextType {
    userData : DecodedToken | undefined
    formContext : IForm
    localityContext : ILocality
    handleSave : () => Promise<void> 
}

export interface GenericComponentInterface<T> {
    data : T
    update : React.Dispatch<React.SetStateAction<T>>
}