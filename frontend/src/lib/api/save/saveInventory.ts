import type { Inventory } from "@/lib/api/dataTypes";
import {extractColumnsAndSave} from "@/lib/api/extractColumnsAndSave"

export async function saveInventory(type: string, data : Record<string, Inventory>, specimenId : number) {
    const inventoryArray = Object.values(data);
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${type}_inventory/${specimenId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inventory: inventoryArray.filter(i => i.isChecked == true) }),
    });
    if (!res.ok) {
      console.warn(`⚠️ Failed to save ${type} inventory: ${res.status} ${res.statusText}`);
      return { ok: false };
    }
    return await res.json();
  } catch (err: any) {
    console.error(`❌ Error saving ${type} inventory:`, err.message || err);
    return { ok: false };
  }
}