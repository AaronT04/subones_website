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

const enum DentalWindow {
    NONE = -1,
    PERMANENT = 0,
    DECIDUOUS = 1
}
export default function Dental(props) {
    const [activeSubmenu, setActiveSubmenu] = useState("");
    const getWindow = () => {
        switch(activeSubmenu) {
            case "Deciduous":
                return <DeciduousInventory/>
            case "Permanent":
                return <PermanentInventory/>
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