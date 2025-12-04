import type {DentalInventory} from "@/lib/api/dataTypes"
import { getDentalInventoryBody } from "../frontendToApi";

export async function saveDentalInventory(data : Record<string, DentalInventory>, specimenId : number) {

    const body : DentalInventory[] = getDentalInventoryBody(data);

    if(!body.length) {
        return;
    }
    
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dental/${specimenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error("Dental save failed");

  return { success: true };
}