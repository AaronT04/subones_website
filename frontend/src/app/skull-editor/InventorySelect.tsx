import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "@/components/ui/select"
import type {IInventory} from "@/lib/api/componentTypes"
import {produce} from 'immer'

interface InventorySelectProps {
    inventoryContext : IInventory
    entryName : string
}

export default function InventorySelect(props : InventorySelectProps) {

    const inventory = props.inventoryContext.inventory;
    const entryName = props.entryName;
    const update = props.inventoryContext.update;

    return (
    <Select
    value={inventory[entryName].value}
    onValueChange={(v) => update(prev =>
        produce(prev, draft => {
            draft[entryName] =
        {
        inv_entry_name: entryName, 
        value: v,
        isChecked: v != "Absent"}}))}
    >
        <SelectTrigger className="w-25 h-6 mx-2 border border-gray-400 rounded flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Absent"/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Absent">Absent</SelectItem>
        </SelectContent>

    </Select>
    );
}
