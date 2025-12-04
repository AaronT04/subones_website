"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import * as PageManager from "@/lib/pageManager"
import {saveSpecimen} from "@/lib/api/save/saveSpecimen"
import {saveBone} from "@/lib/api/save/saveBone"
import type {FormData, LocalityData, TaphonomyData} from '@/lib/api/dataTypes'
import { SpecimenBody } from '@/lib/api/apiTypes';


interface BoneDataContextType {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    localityData: LocalityData;
    setLocalityData: React.Dispatch<React.SetStateAction<LocalityData>>;
    measurements: Record<string, number | null>;
    setMeasurements: React.Dispatch<React.SetStateAction<Record<string, number | null>>>;
    taphonomy: TaphonomyData,
    setTaphonomy: React.Dispatch<React.SetStateAction<TaphonomyData>>;
    selectedBone: string | null;
    boneType: string | null;
    isSaving: boolean;
    handleSave: () => Promise<void>;
    isUserLocked: boolean; // New: to track if user field should be disabled
}

const BoneDataContext = createContext<BoneDataContextType | undefined>(undefined);

// Helper function to decode JWT token
function decodeToken(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export function BoneDataProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const selectedBone = searchParams.get('boneName');
    const boneType = selectedBone?.toLowerCase().replace(/\s+/g, '_') || null;
    const [isUserLocked, setIsUserLocked] = useState(false);
    const [boneId, setBoneId] = useState(-1);

    const [formData, setFormData] = useState<FormData>({
        specimenNumber: '',
        museumId: '',
        sex: 'unknown',
        user: '',
        userID: -1
    });

    const [localityData, setLocalityData] = useState<LocalityData>({
        broadRegion: '',
        country: '',
        locality: '',
        region: ''
    });

    const [taphonomy, setTaphonomy] = useState<TaphonomyData>({
        bone_name: "n/a",
        bone_condition: -1,
        surface_exposure: false,
        bone_color: "",
        staining: [],
        surface_damage: [],
        adherent_materials: [],
        modifications: [],
        comments: ""
    });
    
    const [measurements, setMeasurements] = useState<Record<string, number | null>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Load user from token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            if (decoded && decoded.email) {
                // You can use email or any other field from the token
                // Adjust based on what your token contains
                const userName = decoded.name || decoded.email || decoded.username;
                const userID = decoded.id;
                setFormData(prev => ({
                    ...prev,
                    user: userName,
                    userID: userID
                }));
                setIsUserLocked(true);
            }
        }
        if (PageManager.getPageMode("bone-editor") === "Edit") {
            //alert("Code for loading a bone doesn't exist yet!");
            handleLoad(PageManager.getDatabaseID("bone-editor"));
        }
        else {
            //
        }
    }, []);

    // Auto-fill locality based on museum selection
    useEffect(() => {
        if (formData.museumId === '1') { // SUB museum
            setLocalityData({
                broadRegion: 'East Coast',
                country: 'United States',
                locality: 'Salisbury',
                region: 'MD'
            });
        } else {
            // Reset if different museum selected
            setLocalityData({
                broadRegion: '',
                country: '',
                locality: '',
                region: ''
            });
        }
    }, [formData.museumId]);

    const handleLoad = async (specimenId : number) => {
        const token = localStorage.getItem('token');
        try {
            const specimenRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/specimen/${specimenId}`);
            if (!specimenRes.ok) throw new Error(`Failed to fetch specimen: ${specimenRes.status}`)
            const specimenData = await specimenRes.json();
            setFormData({
                specimenNumber: specimenData.specimen_number,
                museumId: specimenData.museum_id,
                sex: specimenData.sex,
                user: formData.user,
                userID: formData.userID
            });
            setLocalityData({
                broadRegion: specimenData.broadRegion,
                country: specimenData.country,
                region: specimenData.region,
                locality: specimenData.locality
            }); 
            const boneRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone/bySpecimen/${specimenId}`);
            if(!boneRes.ok) throw new Error(`Failed to fetch bone: ${boneRes.status}`);
            const boneData = await boneRes.json();
            console.log(boneData);
            setBoneId(boneData.bone_id);
            const measurementsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone_metrics/${boneData.bone_id}}`);
            const measurementsData = await measurementsRes.json();
            setMeasurements(measurementsData); 
            console.log(measurementsData);
            console.log(boneData.bone_id);
            const boneName = boneData.bone_name;
            const taphonomyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/taphonomy/${specimenId}/${boneName}`, {
                method: "GET"
            });
            if(!taphonomyRes.ok) throw new Error(`Failed to fetch taphonomy: ${taphonomyRes.status}`);
            const taphonomyData = await taphonomyRes.json();
            if(taphonomyData != null) {setTaphonomy(taphonomyData);}
            console.log(taphonomyData);
            
        }
        catch(error : any) {
            console.log("Error loading data:", error);
        }

    }

    const handleSave = async () => {
        console.log('handleSave called!');
        console.log('formData:', formData);
        console.log('localityData:', localityData);
        console.log('measurements:', measurements);
        console.log('selectedBone:', selectedBone);
        console.log('boneType:', boneType);

        // Validate required fields
        if (!formData.specimenNumber) {
            alert('Please enter a Specimen Number');
            return;
        }
        if (!formData.museumId) {
            alert('Please select a Museum');
            return;
        }

        setIsSaving(true);
        
        try {
            console.log('Sending request to backend...');
            
            // Extract taphonomy data from measurements
            //const { taphonomy, ...otherMeasurements } = measurements;
            let specimenId = PageManager.getDatabaseID("bone-editor");
            let boneName = selectedBone;
            
            // Get token for authorization
            const token = localStorage.getItem('token');

            //save specimen
            const specimenBody : SpecimenBody = {
                museum_id: Number(formData.museumId),
                specimen_name: "SUB-" + formData.specimenNumber, // 
                specimen_number: Number(formData.specimenNumber),
                broad_region: localityData.broadRegion,
                country: localityData.country,
                locality: localityData.locality,
                region: localityData.region,
                sex: formData.sex,
                user_id: formData.userID
            }
            console.log(specimenId);
            let resultSpecimenID = await saveSpecimen(specimenBody, specimenId, token);
            console.log(resultSpecimenID);
            //save taxonomy
            //save bone
            const boneBody = {
                skeleton_id: null,
                bone_type: boneType,
                bone_name: selectedBone,
                condition: "",
                specimen_id: resultSpecimenID
            }
            let resultBoneID = await saveBone(boneBody, boneId, token);
            setBoneId(resultBoneID);
            //save measurements
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bone_metrics/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bone_id: resultBoneID,       
                    measurements: measurements
                })
            });
            //save taphonomy
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/taphonomy/${resultSpecimenID}/${selectedBone}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(taphonomy)
            });



        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data. Check console for details.');
        } finally {
            setIsSaving(false);
            console.log('handleSave finished');
        }
    };

    return (
        <BoneDataContext.Provider 
            value={{ 
                formData, 
                setFormData,
                localityData,
                setLocalityData,
                measurements, 
                setMeasurements,
                taphonomy,
                setTaphonomy,
                selectedBone,
                boneType,
                isSaving,
                handleSave,
                isUserLocked
            }}
        >
            {children}
        </BoneDataContext.Provider>
    );
}

export function useBoneData() {
    const context = useContext(BoneDataContext);
    if (context === undefined) {
        throw new Error('useBoneData must be used within a BoneDataProvider');
    }
    return context;
}