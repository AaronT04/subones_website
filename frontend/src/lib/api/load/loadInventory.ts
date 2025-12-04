import { IInventory } from "../componentTypes";
import {InventoryBody} from "@/lib/api/apiTypes"
import { Inventory } from "../dataTypes";

export async function loadInventory(specimenId : number, category : string, ctx: IInventory) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${category}_inventory/${specimenId}`);
    if(res.ok) {
        const body : InventoryBody[] = await res.json();
        const frontendData : Record<string, Inventory> = {}
        for(const i of body) {
            frontendData[i.inv_entry_name] = {inv_entry_name: i.inv_entry_name, value: i.value, isChecked: true}
        }
        ctx.update(frontendData)
    }
}