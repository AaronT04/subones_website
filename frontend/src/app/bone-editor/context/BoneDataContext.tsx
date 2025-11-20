"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface FormData {
    specimenNumber: string;
    museumId: string;
    sex: string;
    user: string;
    userID: number;
}

interface LocalityData {
    broadRegion: string;
    country: string;
    locality: string;
    region: string;
}

interface TaphonomyData {
    staining: string[];
    surface_damage: string[];
    adherent_materials: string[];
    curation_modifications: string[];
    cultural_modifications: string[];
}

interface BoneDataContextType {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    localityData: LocalityData;
    setLocalityData: React.Dispatch<React.SetStateAction<LocalityData>>;
    measurements: Record<string, any>;
    setMeasurements: React.Dispatch<React.SetStateAction<Record<string, any>>>;
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
    
    const [measurements, setMeasurements] = useState<Record<string, any>>({});
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
            const { taphonomy, ...otherMeasurements } = measurements;
            
            // Get token for authorization
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bones/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include token in request
                },
                body: JSON.stringify({
                    specimenNumber: formData.specimenNumber,
                    museumId: formData.museumId,
                    boneName: selectedBone,
                    boneType: boneType,
                    sex: formData.sex,
                    userID: formData.userID,
                    localityData: localityData,
                    measurements: otherMeasurements,
                    taphonomy: taphonomy
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                alert(`Data saved successfully!\nSpecimen: ${data.specimenName}\nBone ID: ${data.boneId}`);
                setMeasurements({});
            } else {
                alert('Failed to save: ' + data.message);
            }
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