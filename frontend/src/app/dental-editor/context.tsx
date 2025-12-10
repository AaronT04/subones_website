import type { DecodedToken, FormData, LocalityData, DentalInventory } from "@/lib/api/dataTypes"
import type { IForm, ILocality, IDental, GenericEditorContextType } from "@/lib/api/componentTypes"
import {loadUser} from "@/lib/loadUser"
import * as PageManager from "@/lib/pageManager"

import React, {ReactNode, createContext, useState, useContext, useEffect} from 'react'
import { getSpecimenBody } from "@/lib/api/frontendToApi"
import { saveSpecimen } from "@/lib/api/save/saveSpecimen"
import { saveDentalInventory } from "@/lib/api/save/saveDentalInventory"
import { saveMorphology } from "@/lib/api/save/saveMorphology"
import { loadSpecimen } from "@/lib/api/load/loadSpecimen"
import { loadDental } from "@/lib/api/load/loadDental"


interface DentalEditorContextType extends GenericEditorContextType {
    dentalContext : IDental
    handleSave: () => Promise<void>;
}

const DentalEditorContext = createContext<DentalEditorContextType | undefined>(undefined);


export function DentalEditorContextProvider({children} : {children : ReactNode}) {
    const [userData, setUserData] = useState<DecodedToken | undefined>(undefined)
    useEffect(() => {
        setUserData(loadUser());
        if(PageManager.getPageMode("dental-editor") === "Edit") {//console.log("loading"); 
        handleLoad();}
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
    const localityContext : ILocality = {...localityData, update: setLocalityData};
    const [dentInv, setDentInv] = useState<Record<string, DentalInventory>>({});
    const [morphology, setMorphology] = useState<Record<string, Record<string, number | null>>>({});
    const dentalContext : IDental = {inventory: dentInv, updateInventory: setDentInv, morphology, updateMorphology: setMorphology}
    async function handleSave() {
        if (!userData) {
            alert("Save error - Invalid User");
            return;
        }
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        let specimenId = PageManager.getDatabaseID("dental-editor"); //will be -1 if new
        const specimenBody = getSpecimenBody(formContext, localityContext, userData);
        let resultSpecimenId = await saveSpecimen(specimenBody, specimenId); //automatically handles -1 by doing POST without id
        await saveDentalInventory(dentalContext.inventory, resultSpecimenId);
        await saveMorphology(dentalContext.morphology, resultSpecimenId);
        PageManager.switchToEditModeAfterSave("dental-editor", resultSpecimenId);
        alert("Save completed - check console for details");
    }
    async function handleLoad() {
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        let specimenId = PageManager.getDatabaseID("dental-editor");
        await loadSpecimen(specimenId, formContext, localityContext);
        await loadDental(specimenId, dentalContext);
    }
    return <DentalEditorContext.Provider value={{userData, formContext, localityContext, dentalContext, handleSave}}>
        {children}
    </DentalEditorContext.Provider>
}

export function useDentalEditorContext() {
    const context = useContext(DentalEditorContext);
    if (context === undefined) {
        throw new Error('useSkullContext must be used within a SkullProvider... you know what I mean');
    }
    return context;
}