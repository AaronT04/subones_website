import type {Morphology} from "@/lib/api/dataTypes"
import { getMorphologyBody } from "../frontendToApi";

export async function saveMorphology(data : Morphology, specimenId : number) {
    if(!(Object.keys(data).length)) {
        //No updates were made
        return;
    }
    const body = getMorphologyBody(data);
    
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/morphology/${specimenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Morphology save failed");

  return { success: true };
}