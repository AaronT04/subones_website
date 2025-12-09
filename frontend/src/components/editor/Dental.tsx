"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useState} from 'react'
import DeciduousInventory from "./DeciduousInventory";
import PermanentInventory from "./PermanentInventory";
import type {ISkull, IDental} from "@/lib/api/componentTypes"

const enum DentalWindow {
    NONE = -1,
    PERMANENT = 0,
    DECIDUOUS = 1
}
interface DentalProps {
    skullContext? : ISkull
    dentalContext: IDental
}
export default function Dental(props : DentalProps) {
    const [activeSubmenu, setActiveSubmenu] = useState("Permanent");
    const skullContext = props.skullContext || undefined;
    const dentalContext = props.dentalContext;
    const getWindow = () => {
        switch(activeSubmenu) {
            case "Deciduous":
                return <DeciduousInventory skullContext={skullContext} dentalContext={dentalContext}/>
            case "Permanent":
                return <PermanentInventory skullContext={skullContext}  dentalContext={dentalContext}/>
            default:
                return <></>
        }
    }
    return(<>
    <div className="flex justify-center gap-4">
    <label>Inventory Type: </label>
    <Select onValueChange={(v) => setActiveSubmenu(v)}>
        <SelectTrigger>
            <SelectValue/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="Permanent">Permanent</SelectItem>
            <SelectItem value="Deciduous">Deciduous</SelectItem>
        </SelectContent>
    </Select>
    </div>
    {getWindow()}
    </>)
}