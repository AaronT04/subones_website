"use client"

import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react'
import type {LocalityData, Measurement, TaphonomyData, Inventory, FormData, DentalInventory, DecodedToken, SkullData, CranialNonmetric} from "@/lib/api/dataTypes"
import type {IForm, ILocality, ICraniometrics, IAllTaphonomy, IInventory, ISkull, IDental, ICranialNonmetrics} from "@/lib/api/componentTypes"
import { loadUser } from '@/lib/loadUser'
import * as PageManager from "@/lib/pageManager"
import {saveSpecimen} from "@/lib/api/save/saveSpecimen"
import {getSpecimenBody} from "@/lib/api/frontendToApi"
import { saveCraniometrics } from '@/lib/api/save/saveCraniometrics'
import { saveNonmetrics } from '@/lib/api/save/saveNonmetrics'
import {saveInventory} from "@/lib/api/save/saveInventory"
import {saveAllTaphonomy} from "@/lib/api/save/saveTaphonomy"
import {saveDentalInventory} from "@/lib/api/save/saveDentalInventory"
import { saveMorphology } from '@/lib/api/save/saveMorphology'
import {saveSkull} from '@/lib/api/save/saveSkull'
import { loadSpecimen } from '@/lib/api/load/loadSpecimen'
import {loadSkull} from '@/lib/api//load/loadSkull'
import {loadCraniometrics} from "@/lib/api/load/loadCraniometrics"
import {loadNonmetrics} from "@/lib/api/load/loadNonmetrics"
import {loadInventory} from "@/lib/api/load/loadInventory"
import {loadAllTaphonomy} from "@/lib/api/load/loadTaphonomy"
import {loadDental} from "@/lib/api/load/loadDental"

interface SkullContextType {
    userData : DecodedToken | undefined
    skullContext : ISkull
    formContext : IForm
    localityContext : ILocality
    craniometricsContext : ICraniometrics
    taphonomyContext : IAllTaphonomy
    cranialInventoryContext : IInventory
    cranialNonmetricsContext : ICranialNonmetrics
    dentalContext : IDental
    handleSave: () => Promise<void>;

}
const SkullContext = createContext<SkullContextType | undefined>(undefined);

export function SkullContextProvider({children} : {children : ReactNode}) {
    const [userData, setUserData] = useState<DecodedToken | undefined>(undefined)
    useEffect(() => {
        setUserData(loadUser());
        handleLoad();
    }, []);
    
    const [formData, setFormData] = useState<FormData>({
        specimenNumber: '',
        museumId: '',
        sex: 'unknown'
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
        hasCranium: true,
        hasMandible: true
    })
    const skullContext : ISkull = {...skullData, update: setSkullData}
    const [craniumMetrics, setCraniumMetrics] = useState<Record<string, number>>({});
    const [mandibleMetrics, setMandibleMetrics] = useState<Record<string, number>>({});
    const craniometricsContext : ICraniometrics = {craniumMetrics, updateCranium : setCraniumMetrics,
         mandibleMetrics, updateMandible: setMandibleMetrics};
    const [allTaphonomy, setAllTaphonomy] = useState<Record<string, TaphonomyData>>({});
    const taphonomyContext : IAllTaphonomy = {allTaphonomy, update: setAllTaphonomy}
    const [inventory, setInventory] = useState<Record<string, Inventory>>({});
    const cranialInventoryContext : IInventory = {inventory, update: setInventory};
    const [allNonmetrics, setAllNonmetrics] = useState<Record<string, CranialNonmetric>>({})
    const cranialNonmetricsContext : ICranialNonmetrics = {allNonmetrics, update: setAllNonmetrics}
    const [dentInv, setDentInv] = useState<Record<string, DentalInventory>>({});
    const [morphology, setMorphology] = useState<Record<string, Record<string, number | null>>>({});
    const dentalContext : IDental = {inventory: dentInv, updateInventory: setDentInv, morphology, updateMorphology: setMorphology}
    async function handleSave() {
        console.log(userData, skullContext, formContext, localityContext, craniometricsContext, taphonomyContext,
                    cranialInventoryContext, cranialNonmetricsContext, dentalContext);
        if (!userData) {
            alert("Save error - Invalid User");
            return;
        }
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        let specimenId = PageManager.getDatabaseID("skull-editor");
        const specimenBody = getSpecimenBody(formContext, localityContext, userData);
        let resultSpecimenId = await saveSpecimen(specimenBody, specimenId, token);
        await saveSkull(skullContext, resultSpecimenId)
        await saveCraniometrics(craniometricsContext, resultSpecimenId);
        await saveNonmetrics(cranialNonmetricsContext.allNonmetrics, resultSpecimenId);
        await saveInventory("cranial", cranialInventoryContext.inventory, resultSpecimenId);
        await saveAllTaphonomy(taphonomyContext.allTaphonomy, resultSpecimenId);
        await saveDentalInventory(dentalContext.inventory, resultSpecimenId);
        await saveMorphology(dentalContext.morphology, resultSpecimenId);
        PageManager.switchToEditModeAfterSave("skull-editor", resultSpecimenId);
        alert("Save completed - check console for details");
    };
    async function handleLoad() {
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        let specimenId = PageManager.getDatabaseID("skull-editor");
        await loadSpecimen(specimenId, formContext, localityContext);
        await loadSkull(specimenId, skullContext);
        await loadCraniometrics(specimenId, craniometricsContext);
        await loadNonmetrics(specimenId, cranialNonmetricsContext);
        await loadInventory(specimenId, "cranial", cranialInventoryContext);
        await loadAllTaphonomy(specimenId, taphonomyContext);
        await loadDental(specimenId, dentalContext);
    }
        

    return (<SkullContext.Provider value={
        {userData, skullContext, formContext, localityContext, craniometricsContext, 
        taphonomyContext, cranialInventoryContext, cranialNonmetricsContext, dentalContext, handleSave}

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