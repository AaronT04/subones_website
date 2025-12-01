"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react'
import type {LocalityData, Measurement, TaphonomyData, Inventory, FormData, SkullData, CranialNonmetric} from "@/lib/api/types"
import type {IForm, ILocality, ICraniometrics, IAllTaphonomy, IInventory, ISkull, ICranialNonmetrics} from "@/lib/api/componentTypes"



interface SkullContextType {
    skullContext : ISkull
    formContext : IForm
    localityContext : ILocality
    craniometricsContext : ICraniometrics
    taphonomyContext : IAllTaphonomy
    cranialInventoryContext : IInventory
    cranialNonmetricsContext : ICranialNonmetrics
    handleSave: () => Promise<void>;

}
const SkullContext = createContext<SkullContextType | undefined>(undefined);

export function SkullContextProvider({children} : {children : ReactNode}) {
    const [formData, setFormData] = useState<FormData>({
        specimenNumber: '',
        museumId: '',
        sex: 'unknown',
        user: '',
        userID: -1,
    });
    const formContext : IForm = {...formData, update: setFormData}
    const [localityData, setLocalityData] = useState<LocalityData>({
        broadRegion: '',
        country: '',
        locality: '',
        region: ''
    });
    const localityContext : ILocality = {...localityData, update: setLocalityData}
    const [skullData, setSkullData] = useState<SkullData>({
        hasCranium: false,
        hasMandible: false
    })
    const skullContext : ISkull = {...skullData, update: setSkullData}
    const [craniumMetrics, setCraniumMetrics] = useState<Measurement[]>([]);
    const [mandibleMetrics, setMandibleMetrics] = useState<Measurement[]>([]);
    const craniometricsContext : ICraniometrics = {craniumMetrics, updateCranium : setCraniumMetrics,
         mandibleMetrics, updateMandible: setMandibleMetrics};
    const [allTaphonomy, setAllTaphonomy] = useState<Record<string, TaphonomyData>>({});
    const taphonomyContext : IAllTaphonomy = {allTaphonomy, update: setAllTaphonomy}
    const [inventory, setInventory] = useState<Record<string, Inventory>>({});
    const cranialInventoryContext : IInventory = {inventory, update: setInventory};
    const [allNonmetrics, setAllNonmetrics] = useState<Record<string, CranialNonmetric>>({})
    const cranialNonmetricsContext : ICranialNonmetrics = {allNonmetrics, update: setAllNonmetrics}
    async function handleSave() {
        console.log(formContext, localityContext, craniometricsContext, taphonomyContext, cranialInventoryContext, cranialNonmetricsContext);
    };
        

    return (<SkullContext.Provider value={
        {skullContext, formContext, localityContext, craniometricsContext, 
        taphonomyContext, cranialInventoryContext, cranialNonmetricsContext, handleSave}

    }>
        {children}
        </SkullContext.Provider>
    )
}

export function useSkullContext() {
    const context = useContext(SkullContext);
    if (context === undefined) {
        throw new Error('useSkullContext must be used within a SkullProvider... you know what I mean');
    }
    return context;
}