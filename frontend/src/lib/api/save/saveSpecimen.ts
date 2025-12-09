import type {SpecimenBody} from '@/lib/api/apiTypes'
import {post} from "@/lib/api/post-crud"

export const saveSpecimen = async (specimenBody : SpecimenBody, specimenId) => {
// Check if specimen already exists (update) or create new
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error();
    }

    const specimenUrl =
      specimenId && specimenId > 0 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/specimen/${specimenId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/specimen`;

    const specimenRes = await fetch(specimenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json",
        "authorization": `Bearer ${token}`
       },
      body: JSON.stringify(specimenBody),
    });

    if (!specimenRes.ok) throw new Error(`Specimen save failed (${specimenRes.status})`);
    const specimenResult = await specimenRes.json();

    // If new, update the ID
    if (!specimenId || specimenId < 0) specimenId = specimenResult.specimen_id;
    return Number(specimenId);
    
}