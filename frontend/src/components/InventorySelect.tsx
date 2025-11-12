import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "@/components/ui/select"
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";

export default function InventorySelect(props) {
    
    const {api, updateField} = useEditSkeletonAPI();
    const apiInstance = api[props.apiPath[0]].find((inv) => inv.inv_entry_name === props.apiPath[1])
    return (
    <Select
    value={apiInstance?.value}
    onValueChange={(v) => {updateField(props.apiPath[0], {
        inv_entry_name: props.apiPath[1], 
        value: v,
        isChecked: v != "Absent"},
        "inv_entry_name"

    ); console.log(api)}}
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
