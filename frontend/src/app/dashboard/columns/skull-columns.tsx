"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
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

export type Skull = {
  id: number           // number for correct numeric filtering
  menuID: string
  name: string
  museum: string
  user: string
}

// Case-insensitive includes for strings
const includesCI = (a: unknown, b: unknown) =>
  String(a ?? "").toLowerCase().includes(String(b ?? "").toLowerCase())

export const skullColumns: ColumnDef<Skull>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: ({column}) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("id")}</div>,
    // Numeric-aware filter: full digits → exact; otherwise → prefix match
    filterFn: (row, _id, value) => {
      const v = String(value ?? "").trim()
      if (v === "") return true
      const idNum = Number(row.getValue("id"))
      if (Number.isNaN(idNum)) return false
      if (/^\d+$/.test(v)) return idNum === Number(v)        // exact numeric
      return String(idNum).startsWith(v)                      // prefix
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-left ml-3 font-medium">{row.getValue("name")}</div>,
    filterFn: (row, _id, value) => includesCI(row.getValue("name"), value),
  },

  {
    accessorKey: "museum",
    header: () => <div className="text-left">Museum</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("museum")}</div>,
  },

  {
    accessorKey: "user",
    header: () => <div className="text-left">User</div>,
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("user")}</div>,
    filterFn: (row, _id, value) => includesCI(row.getValue("user"), value),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(entry.menuID)}>
              Copy Entry ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Entry</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
