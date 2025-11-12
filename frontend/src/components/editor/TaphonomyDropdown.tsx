import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function TaphonomyDropdown(props) {
    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Taphonomy</DropdownMenuLabel>
            {//doesNotRequireBoneSideDropdown(row) ?
            props.doesNotRequireBoneSide ?
            <DropdownMenuItem onClick={() => {
                //setSelectedBone(buildEntryName(row));
                //setSelectedRow(row)
                props.onEditClick();
                }}>
                Edit
            </DropdownMenuItem>
            :
            //filterTaphonomyDropdownTags(row.rowType.columnText).map((label, i) =>
            props.filteredDropdownTags.map((label, i) =>
            <>
            <DropdownMenuItem
                key={i}
                //onClick={() => setSelectedBone(buildEntryName(row, label))}
                onClick={() => props.onSideClick(label)}
            >
                {label}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            </>
            )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}