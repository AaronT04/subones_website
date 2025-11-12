import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Table, TextField, Select } from "@radix-ui/themes";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";
import type { PostcranialCategory, PostcranialRow } from "./postcranial-inventory-list";
import { postcranial_inventory_list, BoxTypeEnum, doesNotRequireBoneSideDropdown, excludeCategoriesFromTaphonomy } from "./postcranial-inventory-list";
import "./InventoryStyles.css";
import Taphonomy from "./SmallTaphonomy";
import { Button } from "@/components/ui/button"
import { filterTaphonomyDropdownTags } from "./postcranial-inventory-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import TaphonomyDropdown from '@/components/editor/TaphonomyDropdown'
import InventorySelect from "@/components/InventorySelect";

import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";

type PostcranialType = {
  name: string;
  tabs: PostcranialCategory[];
};

const pc_types: Record<string, PostcranialType> = {
  Axial: { name: "Axial", tabs: postcranial_inventory_list["Axial"] },
  Appendicular: { name: "Appendicular", tabs: postcranial_inventory_list["Appendicular"] },
  "Hands and Feet": { name: "Hands and Feet", tabs: postcranial_inventory_list["Hands and Feet"] },
};

export default function PostcranialInventory() {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [selectedBone, setSelectedBone] = useState("");
  const [selectedRow, setSelectedRow] = useState<PostcranialRow | null>(null);
  const { api, updateField } = useEditSkeletonAPI();

  // --- Helper: unified entry name builder ---
  function buildEntryName(row: PostcranialRow, label?: string): string {
    const parts: string[] = [];
    if (row.parentInfo) parts.push(row.parentInfo);
    if (row.boneName) parts.push(row.boneName); // e.g., "L", "R"
    if (label) parts.push(label); // e.g., "Prox 1/3"
    return parts.join(" ").trim();
  }

  function createBox(row: PostcranialRow, label?: string) {
    const entryName = buildEntryName(row, label);

    switch (row.rowType.boxType) {
      // --- CHECKBOX ---
      case BoxTypeEnum.CHECKBOX:
        return (
          <InventorySelect apiPath={["postcranial_inventory", `${entryName}`]}/>
        );

      // --- SELECT DROPDOWN ---
      case BoxTypeEnum.SELECT:
        return row.inputRange ? (
          <Select.Root
            value={
              api.postcranial_inventory
                .find(i => i.inv_entry_name === entryName)
                ?.value?.toString() || ""
            }
            onValueChange={(val) =>
              updateField(
                "postcranial_inventory",
                {
                  inv_entry_name: entryName,
                  value: Number(val),
                  isChecked: true,
                },
                "inv_entry_name"
              )
            }
          >
            <Select.Trigger />
            <Select.Content>
              {Array.from({ length: row.inputRange.max - row.inputRange.min }).map((_, index) => (
                <Select.Item key={index} value={String(index)}>
                  {index}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        ) : (
          <></>
        );

      // --- NUMBER INPUT ---
      case BoxTypeEnum.NUMINPUT:
        return (
          <TextField.Root
            type="number"
            className="w-20"
            value={
              api.postcranial_inventory.find(i => i.inv_entry_name === entryName)?.value || ""
            }
            onChange={(e) =>
              updateField(
                "postcranial_inventory",
                {
                  inv_entry_name: entryName,
                  value: String(e.target.value),
                  isChecked: true,
                },
                "inv_entry_name"
              )
            }
          />
        );

      default:
        return <></>;
    }
  }

  function createInventoryCell(row: PostcranialRow) {
    return (
      <Table.Cell className="table-cell inventory" colSpan={row.noNameCell ? 2 : 1}>
        <div className="flex flex-col items-center">
          {/* Column labels like Prox Epi, Prox 1/3, etc. */}
          {row.rowType.columnText.length > 0 && (
            <div className="flex justify-center gap-8 mb-1 w-full">
              {row.rowType.columnText.map((label, index) => (
                <span
                  key={index}
                  className="text-sm font-medium text-gray-700"
                  style={{ width: "48px", textAlign: "center", whiteSpace: "nowrap" }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Boxes */}
          <div className="flex flex-col gap-2 w-full">
            {Array.from({ length: row.rowType.numBoxRows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-6 w-full">
                {Array.from({ length: row.rowType.numColumns }).map((_, colIndex) => {
                  const label = row.rowType.columnText[colIndex];
                  return <div key={colIndex}>{createBox(row, label)}</div>;
                })}
              </div>
            ))}
          </div>
        </div>
      </Table.Cell>
    );
  }

  function renderInventory(pc_type: PostcranialType) {
    return (
      <div className="grid w-full grid-cols-2">
        <div className="flex flex-col">
          <h3>{pc_type.name}</h3>
          <Tabs>
            <TabsList>
              {pc_type.tabs.map((tab, i) => (
                <TabsTrigger key={i} value={tab.name}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {pc_type.tabs.map((tab, i) => (
              <TabsContent key={i} value={tab.name}>
                <Table.Root className="table-root">
                  <Table.Header>
                    <Table.ColumnHeaderCell className="table-header-cell bone">
                      Bone
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell inventory">
                      Inventory Options
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="table-header-cell edit">
                      Taphonomy
                    </Table.ColumnHeaderCell>
                  </Table.Header>
                  <Table.Body>
                    {tab.rows.map((row, j) =>
                      row.isHeader ? (
                        <Table.Row key={j}>
                          <Table.Cell colSpan={3}>
                            <p className="text-center bg-gray-800 text-white font-bold w-100">
                              {row.boneName}
                            </p>
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        <Table.Row
                          key={j}
                          onMouseEnter={() => setHoveredRowIndex(j)}
                          className="align-top"
                        >
                          {/* Leftmost bone label*/}
                          {!row.noNameCell && (
                            <Table.RowHeaderCell className="table-row-header-cell bone">
                              {row.boneName}
                            </Table.RowHeaderCell>
                          )}

                          {createInventoryCell(row)}

                          {/* Edit button */}
                          <Table.Cell className="table-cell edit flex justify-center items-center">
                            {hoveredRowIndex === j && !excludeCategoriesFromTaphonomy(row) && (
                              <TaphonomyDropdown 
                                doesNotRequireBoneSide={doesNotRequireBoneSideDropdown(row)} 
                                filteredDropdownTags={filterTaphonomyDropdownTags(row.rowType.columnText)}
                                onEditClick={() => {setSelectedBone(buildEntryName(row)); setSelectedRow(row);}}
                                onSideClick={(label) => {setSelectedBone(buildEntryName(row, label)); setSelectedRow(row);}}
                                />
                            )}
                          </Table.Cell>
                        </Table.Row>
                      )
                    )}
                  </Table.Body>
                </Table.Root>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {selectedBone != null && selectedRow != null
        && <Taphonomy boneName={selectedBone} />}
      </div>
    );
  }

  return (
    <div className="bone-container">
      <Tabs defaultValue="Axial">
        <TabsList>
          <TabsTrigger value="Axial">Axial</TabsTrigger>
          <TabsTrigger value="Appendicular">Appendicular</TabsTrigger>
          <TabsTrigger value="Hands and Feet">Hands and Feet</TabsTrigger>
        </TabsList>
        <TabsContent value="Axial">{renderInventory(pc_types["Axial"])}</TabsContent>
        <TabsContent value="Appendicular">{renderInventory(pc_types["Appendicular"])}</TabsContent>
        <TabsContent value="Hands and Feet">
          {renderInventory(pc_types["Hands and Feet"])}
        </TabsContent>
      </Tabs>
    </div>
  );
}
