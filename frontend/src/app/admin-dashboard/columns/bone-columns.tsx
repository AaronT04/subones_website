"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Bone = {
  id: string
  menuID: string
  name: string
  museum: string
  user: string
}

export const createBoneColumns = (
  onDelete: (id: string) => void
): ColumnDef<Bone>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const id = parseFloat(row.getValue("id"))
        return <div className="text-right font-medium">{id}</div>
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-left ml-3 font-medium">
            {row.getValue("name")}
          </div>
        )
      },
    },

    {
      accessorKey: "museum",
      header: () => <div className="text-left">Museum</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("museum")}
          </div>
        )
      },
    },

    {
      accessorKey: "user",
      header: () => <div className="text-left">User</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left font-medium">
            {row.getValue("user")}
          </div>
        )
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const entry = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(entry.menuID)}
              >
                Copy Entry ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Entry</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault(); // Prevent closing immediately if that helps, or just standard. 
                  // Actually, we want it to close. But we need to stop row click.
                  // Since passing 'e' to stopPropagation might be tricky with custom events bubbling:
                  // The row click is React. If this is a native event, React bubbling might still happen?
                  // Let's safe-guard:
                  // Actually, Radix prevents bubbling?
                  onDelete(String(entry.id));
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
