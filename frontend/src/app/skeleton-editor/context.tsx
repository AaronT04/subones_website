import React, {ReactNode, useContext, createContext, useEffect, useState} from 'react'
import type {LocalityData, TaphonomyData, Inventory, FormData, DentalInventory, DecodedToken, SkeletonData, PostcranialMetrics, CranialNonmetric} from "@/lib/api/dataTypes"
import type {IForm, ILocality, ICraniometrics, ISkeleton, IAllTaphonomy, IInventory, IDental, ICranialNonmetrics, IPostcranialMetrics} from "@/lib/api/componentTypes"
import {loadUser} from "@/lib/loadUser"
import * as PageManager from "@/lib/pageManager"
import {saveSpecimen} from "@/lib/api/save/saveSpecimen"
import {getSpecimenBody} from "@/lib/api/frontendToApi"
import { saveCraniometrics } from '@/lib/api/save/saveCraniometrics'
import { saveNonmetrics } from '@/lib/api/save/saveNonmetrics'
import {saveInventory} from "@/lib/api/save/saveInventory"
import {saveAllTaphonomy} from "@/lib/api/save/saveTaphonomy"
import {saveDentalInventory} from "@/lib/api/save/saveDentalInventory"
import { saveMorphology } from '@/lib/api/save/saveMorphology'
import { savePostcranialMetrics } from '@/lib/api/save/savePostcranialMetrics'
import { saveSkeleton } from '@/lib/api/save/saveSkeleton'
import { loadSpecimen } from '@/lib/api/load/loadSpecimen'
import {loadCraniometrics} from "@/lib/api/load/loadCraniometrics"
import {loadNonmetrics} from "@/lib/api/load/loadNonmetrics"
import {loadInventory} from "@/lib/api/load/loadInventory"
import {loadAllTaphonomy} from "@/lib/api/load/loadTaphonomy"
import {loadDental} from "@/lib/api/load/loadDental"
import { loadSkeleton } from '@/lib/api/load/loadSkeleton'
import { loadPostcranialMetrics } from '@/lib/api/load/loadPostcranialMetrics'

interface SkeletonEditorContextType {
    userData : DecodedToken | undefined
    skeletonContext : ISkeleton
    formContext : IForm
    localityContext : ILocality
    craniometricsContext : ICraniometrics
    taphonomyContext : IAllTaphonomy
    cranialInventoryContext : IInventory
    cranialNonmetricsContext : ICranialNonmetrics
    postcranialMetricsContext : IPostcranialMetrics
    postcranialInventoryContext : IInventory
    dentalContext : IDental
    handleSave: () => Promise<void>;
}

const SkeletonEditorContext = createContext<SkeletonEditorContextType | undefined>(undefined);

export function SkeletonEditorContextProvider({children} : {children : ReactNode}) {
    const [userData, setUserData] = useState<DecodedToken | undefined>(undefined);
    const [specimenId, setSpecimenId] = useState<number>(-1);
    const [skeletonId, setSkeletonId] = useState<number>(-1);
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
    const [skeletonData, setSkeletonData] = useState<SkeletonData>({
        skeleton_name: ""
    })
    const skeletonContext : ISkeleton = {...skeletonData, update: setSkeletonData}
    const [craniumMetrics, setCraniumMetrics] = useState<Record<string, number>>({});
    const [mandibleMetrics, setMandibleMetrics] = useState<Record<string, number>>({});
    const craniometricsContext : ICraniometrics = {craniumMetrics, updateCranium : setCraniumMetrics,
            mandibleMetrics, updateMandible: setMandibleMetrics};
    const [allTaphonomy, setAllTaphonomy] = useState<Record<string, TaphonomyData>>({});
    const taphonomyContext : IAllTaphonomy = {allTaphonomy, update: setAllTaphonomy}
    const [c_inventory, setCInventory] = useState<Record<string, Inventory>>({});
    const cranialInventoryContext : IInventory = {inventory: c_inventory, update: setCInventory};
    const [p_inventory, setPInventory] = useState<Record<string, Inventory>>({});
    const postcranialInventoryContext : IInventory = {inventory: p_inventory, update: setPInventory};
    const [allNonmetrics, setAllNonmetrics] = useState<Record<string, CranialNonmetric>>({})
    const cranialNonmetricsContext : ICranialNonmetrics = {allNonmetrics, update: setAllNonmetrics}
    const [pc_metrics, setPcMetrics] = useState<PostcranialMetrics>({})
    const postcranialMetricsContext : IPostcranialMetrics = {metrics: pc_metrics, update: setPcMetrics}
    const [dentInv, setDentInv] = useState<Record<string, DentalInventory>>({});
    const [morphology, setMorphology] = useState<Record<string, Record<string, number | null>>>({});
    const dentalContext : IDental = {inventory: dentInv, updateInventory: setDentInv, morphology, updateMorphology: setMorphology}
    
    async function handleLoad() {
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        const skeletonId = PageManager.getDatabaseID("skeleton-editor");
        setSkeletonId(skeletonId);
        const resultSpecimenId = await loadSkeleton(skeletonId, skeletonContext);
        setSpecimenId(resultSpecimenId);
        await loadSpecimen(resultSpecimenId, formContext, localityContext);
        await loadCraniometrics(resultSpecimenId, craniometricsContext);
        await loadNonmetrics(resultSpecimenId, cranialNonmetricsContext);
        await loadPostcranialMetrics(skeletonId, postcranialMetricsContext);
        await loadInventory(resultSpecimenId, "cranial", cranialInventoryContext);
        await loadInventory(resultSpecimenId, "postcranial", postcranialInventoryContext);
        await loadAllTaphonomy(resultSpecimenId, taphonomyContext);
        await loadDental(resultSpecimenId, dentalContext);
    }
    async function handleSave() {
        const skeletonId = PageManager.getDatabaseID("skeleton-editor");
        if (!userData) {
            alert("Save error - Invalid User");
            return;
        }
        const resultSkeletonId = await saveSkeleton(skeletonId, specimenId, skeletonContext);
        setSkeletonId(resultSkeletonId);
        const resultSpecimenId = await saveSpecimen(getSpecimenBody(formContext, localityContext, userData), specimenId);
        setSpecimenId(resultSpecimenId);
        await saveCraniometrics(craniometricsContext, resultSpecimenId);
        await saveNonmetrics(cranialNonmetricsContext.allNonmetrics, resultSpecimenId);
        await saveInventory("cranial", cranialInventoryContext.inventory, resultSpecimenId);
        await saveInventory("postcranial", postcranialInventoryContext.inventory, resultSpecimenId);
        await savePostcranialMetrics(postcranialMetricsContext.metrics, resultSkeletonId);
        await saveAllTaphonomy(taphonomyContext.allTaphonomy, resultSpecimenId);
        await saveDentalInventory(dentalContext.inventory, resultSpecimenId);
        await saveMorphology(dentalContext.morphology, resultSpecimenId);
        PageManager.switchToEditModeAfterSave("skeleton-editor", resultSkeletonId);
        alert("Save completed - check console for details");

    }
    return(<SkeletonEditorContext.Provider value={{
        userData,
        skeletonContext,
        formContext,
        localityContext,
        craniometricsContext,
        taphonomyContext,
        cranialInventoryContext,
        cranialNonmetricsContext,
        postcranialMetricsContext,
        postcranialInventoryContext,
        dentalContext,
        handleSave,
    }}>
        {children}
    </SkeletonEditorContext.Provider>)
}

export function useSkeletonEditorContext() {
    const context = useContext(SkeletonEditorContext);
    if (context === undefined) {
        throw new Error('useSkeletonEditorContext must be used within a SkeletonEditorProvider... you know what I mean');
    }
    return context;
}