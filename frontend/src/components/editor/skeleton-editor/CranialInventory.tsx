import { useState } from "react";
import { Table, TextField } from "@radix-ui/themes";
import * as Checkbox from "@radix-ui/react-checkbox";
import { cranial_inventory_list, CranialInventoryList, CranialInventoryRow } from "./cranial-inventory-list";
import Taphonomy from "./SmallTaphonomy"
import "./InventoryStyles.css"
import { excludeCategoriesFromTaphonomy, doesNotRequireBoneSideDropdown } from "./cranial-inventory-list";
import InventorySelect from "@/components/InventorySelect";
import TaphonomyDropdown from "@/components/editor/TaphonomyDropdown"

export default function CranialInventory(props) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [selectedBone, setSelectedBone] = useState("")


  function buildEntryName(row: CranialInventoryRow, label?: string): string {
      const parts: string[] = [];
      if (row.boneName) parts.push(row.boneName); // e.g., "L", "R"
      if (label) parts.push(label); // e.g., "Prox 1/3"
      return parts.join(" ").trim();
    }

  function getCheckboxLabels(numBoxes: number): string[] {
    if (numBoxes === 1) return [];
    if (numBoxes === 2) return ["L", "R"];
    if (numBoxes === 3) return ["L", "Body", "R"];
    return [];
  }

  function createCheckboxes(bone : CranialInventoryRow) {
    const numBoxes : number = bone.numBoxes;
    const labels = getCheckboxLabels(bone.numBoxes);
    const entryName = (idx) => labels[idx] ? bone.boneName + " " + labels[idx] : bone.boneName;
    //const apiInstance = (idx) => api.cranial_inventory.find((inv) => inv.inv_entry_name === entryName(idx))
    return Array.from({ length: numBoxes }).map((_, idx) => (
        <InventorySelect apiPath={["cranial_inventory", `${entryName(idx)}`]} />
    ));
  }

  return (
    <div className="bone-container">
      <div className="grid w-full grid-cols-2">
        <div className="flex flex-col">
          <h3>Cranial Inventory</h3>
          <Table.Root className="table-root">
            <Table.Header>
              <Table.ColumnHeaderCell className="table-header-cell bone">Bone</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="table-header-cell inventory">Inventory Options</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="table-header-cell edit">Taphonomy</Table.ColumnHeaderCell>
            </Table.Header>
            <Table.Body>
              {cranial_inventory_list.contents.map((bone, i) => {
                const labels = getCheckboxLabels(bone.numBoxes);

                return (
                  <Table.Row
                    key={i}
                    onMouseEnter={() => setHoveredRowIndex(i)}
                    className="align-top" // Ensure vertical alignment at top
                  >
                    <Table.RowHeaderCell className="table-row-header-cell bone">{bone.boneName}</Table.RowHeaderCell>
                    <Table.Cell className="table-cell inventory">
                      <div className="flex flex-col items-center">
                        {/* Labels row */}
                        {labels.length > 0 && (
                          <div className="flex justify-center gap-8 mb-1 w-full ">
                            {labels.map((label, idx) => (
                              <span
                                key={idx}
                                className="text-sm font-medium text-gray-700"
                                style={{ width: "48px", textAlign: "center", whiteSpace: "nowrap" }}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Checkboxes row */}
                        <div className="flex justify-center gap-6 w-full ">
                          {createCheckboxes(bone)}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="table-cell edit flex justify-center items-center">
                      {hoveredRowIndex === i && !excludeCategoriesFromTaphonomy(bone) && (
                        <TaphonomyDropdown 
                          doesNotRequireBoneSide={doesNotRequireBoneSideDropdown(bone)}
                          filteredDropdownTags={["L", "R"]}
                          onEditClick={() => setSelectedBone(buildEntryName(bone))}
                          onSideClick={(side) => setSelectedBone(buildEntryName(bone, side))}
                          />
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
        {selectedBone != "" && <Taphonomy boneName={selectedBone}/>}
      </div>
      
    </div>
  );
}
