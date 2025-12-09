import { GenericEditorContextType, IAllTaphonomy, IBone, IForm, ILocality, IMeasurements} from '@/lib/api/componentTypes';
import { DecodedToken, LocalityData, FormData, TaphonomyData, Bone} from '@/lib/api/dataTypes';
import { loadUser } from '@/lib/loadUser';
import {ReactNode, createContext, useContext, useEffect, useState} from 'react'
import * as PageManager from "@/lib/pageManager"
import { loadSpecimen } from '@/lib/api/load/loadSpecimen';
import { loadAllTaphonomy } from '@/lib/api/load/loadTaphonomy';
import { getBoneBody, getSpecimenBody } from '@/lib/api/frontendToApi';
import { saveSpecimen } from '@/lib/api/save/saveSpecimen';
import { saveAllTaphonomy } from '@/lib/api/save/saveTaphonomy';
import { saveBone } from '@/lib/api/save/saveBone';
import { loadBone } from '@/lib/api/load/loadBone';
import { saveMeasurements } from '@/lib/api/save/saveMeasurements';
import { loadMeasurements } from '@/lib/api/load/loadMeasurements';

interface BoneEditorContextType extends GenericEditorContextType {
    boneContext : IBone
    measurementsContext : IMeasurements
    taphonomyContext : IAllTaphonomy
    //vertebraeContext? : IVertebrae
}

const BoneEditorContext = createContext<BoneEditorContextType | undefined>(undefined);

export function BoneEditorContextProvider({children} : {children : ReactNode}) {
    const [userData, setUserData] = useState<DecodedToken | undefined>(undefined);
    const [specimenId, setSpecimenId] = useState<number>(-1);
    const [boneId, setBoneId] = useState<number>(-1);
    const [bone, setBone] = useState<Bone>({boneName: ""})
    const boneContext = {data: bone, update: setBone}
    
    useEffect(() => {
        setUserData(loadUser());
        if(PageManager.getPageMode("bone-editor") === "Edit") {console.log("loading"); handleLoad();}
        setBone({...bone, boneName: PageManager.getBoneName()})
        
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

    const [measurements, setMeasurements] = useState<Record<string, number>>({})
    const measurementsContext : IMeasurements = {data: measurements, update: setMeasurements}
    const [allTaphonomy, setAllTaphonomy] = useState<Record<string, TaphonomyData>>({});
    const taphonomyContext : IAllTaphonomy = {data: allTaphonomy, update: setAllTaphonomy}
    async function handleLoad() {
        let token = localStorage.getItem('token');
        if(!token) {
            alert("Save error - invalid token");
            return;
        }
        console.log("got token");
        let specimenId = PageManager.getDatabaseID("bone-editor");
        setSpecimenId(specimenId);
        console.log(specimenId);
        let boneId = await loadBone(specimenId, boneContext);
        console.log("loaded bone");
        if(boneId === -1) {
            console.log("-1");
            alert("Couldn't load - Specimen was not linked to bone")
            return;
        }
        setBoneId(boneId);
        console.log(boneId);
        await loadSpecimen(specimenId, formContext, localityContext);
        await loadMeasurements(boneId, measurementsContext);
        await loadAllTaphonomy(specimenId, taphonomyContext);
    }
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

        const specimenBody = getSpecimenBody(formContext, localityContext, userData);
        let resultSpecimenId = await saveSpecimen(specimenBody, specimenId);
        setSpecimenId(resultSpecimenId);

        const boneBody = getBoneBody(boneContext.data.boneName, resultSpecimenId);
        let resultBoneId = await saveBone(boneBody, boneId);
        setBoneId(resultBoneId);
        
        await saveMeasurements(measurementsContext.data, resultBoneId);
        await saveAllTaphonomy(taphonomyContext.data, resultSpecimenId);
        PageManager.switchToEditModeAfterSave("bone-editor", resultSpecimenId);
        alert("Save completed - check console for details");

    }
    return ( <BoneEditorContext.Provider value={{userData, formContext, localityContext, boneContext, measurementsContext, taphonomyContext, handleSave}}>
        {children}
    </BoneEditorContext.Provider>

    )
}

export function useBoneEditorContext() {
    const context = useContext(BoneEditorContext);
    if(context === undefined) {
        throw new Error("bone contetxt must be used in a bone rpovider (duh...)");
    }
    return context;
}