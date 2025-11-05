"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  type: string
  onAddClick: () => void
  onRowClick?: (row: TData) => void
}

// Small debounced input so filtering feels smooth
function useDebouncedState<T>(value: T, delay = 250) {
  const [state, setState] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setState(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return state
}

export function DataTable<TData, TValue>({
  columns,
  data,
  type,
  onAddClick,
  onRowClick
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [filterType, setFilterType] = React.useState<"name" | "id" | "user">("name")
  const [rawFilter, setRawFilter] = React.useState<string>("")
  const debouncedFilter = useDebouncedState(rawFilter, 200)

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Keep only the active column's filter; clear others when changing filterType
  React.useEffect(() => {
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id === filterType)
      return next.length ? next : []
    })
    // clear the text box when switching which field we filter by
    setRawFilter("")
    // focus the input for faster workflow
    inputRef.current?.focus()
  }, [filterType])

  // Apply debounced filter value to the selected column
  React.useEffect(() => {
    table.getAllColumns().forEach((col) => {
      if (col.id !== filterType) col.setFilterValue(undefined)
    })
    table.getColumn(filterType)?.setFilterValue(debouncedFilter)
  }, [debouncedFilter, filterType, table])

  const placeholder =
    filterType === "id" ? "Search by ID (e.g., 15)" :
    filterType === "user" ? "Search by User" :
    "Search by Name"

  return (
    <div>
      <div className="flex w-full space-x-1">
        <Select
          value={filterType}
          onValueChange={(v) => setFilterType(v as "name" | "id" | "user")}
        >
          <SelectTrigger className="w-[160px]">
            <p className="text-muted-foreground -mr-1">Filter by:</p>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={rawFilter}
          onChange={(e) => setRawFilter(e.target.value)}
          className="w-full"
          inputMode={filterType === "id" ? "numeric" : "text"}
        />

        <Button
          className="bg-maroon hover:bg-maroon/90 text-white hover:text-white"
          variant="outline"
          onClick={onAddClick}
        >
          Add {type}
        </Button>
      </div>

      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/40" : ""}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end space-x-2 py-4 mr-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
