"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { morphology_list } from "./morphology_list";
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";

export type SidedToothBox = {
  unsidedBox: UnsidedToothBox;
  sideLR: "L" | "R";
};

export type UnsidedToothBox = {
  unsidedName: string;
  xNorm: number;  
  yNorm: number;  
};

const PADDING = -0.05;

function signedX(box: SidedToothBox) {
  return box.sideLR === "L" ? -box.unsidedBox.xNorm : box.unsidedBox.xNorm;
}

function normalizedToPaddedPercent(xNorm: number, yNorm: number) {
  const x01 = (xNorm + 1) / 2;
  const y01 = yNorm;

  const xPct = (PADDING + x01 * (1 - 2 * PADDING)) * 100;
  const yPct = (PADDING + y01 * (1 - 2 * PADDING)) * 100;

  return { xPct, yPct };
}

export const tooth_boxes_generic: UnsidedToothBox[] = [
  { unsidedName: "UM3", xNorm: 1, yNorm: 0.45 },
  { unsidedName: "UM2", xNorm: 0.95, yNorm: 0.37 },
  { unsidedName: "UM1", xNorm: 0.9, yNorm: 0.31 },
  { unsidedName: "UP2", xNorm: 0.86, yNorm: 0.25 },
  { unsidedName: "UP1", xNorm: 0.77, yNorm: 0.19 },
  { unsidedName: "UC", xNorm: 0.67, yNorm: 0.13 },
  { unsidedName: "UI2", xNorm: 0.4, yNorm: 0.07 },
  { unsidedName: "UI1", xNorm: 0.1, yNorm: 0.05 },
  { unsidedName: "LM3", xNorm: 1, yNorm: 0.58 },
  { unsidedName: "LM2", xNorm: 0.95, yNorm: 0.66 },
  { unsidedName: "LM1", xNorm: 0.9, yNorm: 0.74 },
  { unsidedName: "LP2", xNorm: 0.83, yNorm: 0.8 },
  { unsidedName: "LP1", xNorm: 0.7, yNorm: 0.86 },
  { unsidedName: "LC", xNorm: 0.55, yNorm: 0.9 },
  { unsidedName: "LI2", xNorm: 0.35, yNorm: 0.94 },
  { unsidedName: "LI1", xNorm: 0.1, yNorm: 0.96 },
];

export const tooth_boxes: SidedToothBox[] = tooth_boxes_generic.flatMap((box) => [
  { unsidedBox: box, sideLR: "L" as const },
  { unsidedBox: box, sideLR: "R" as const },
]);

const toothName = (tooth_box: SidedToothBox) => {
  return tooth_box.sideLR + tooth_box.unsidedBox.unsidedName;
};

export default function ToothDisplay(props) {
  const { api, updateField } = useEditSkeletonAPI();
  const [selectedToothIndex, setSelectedToothIndex] = useState<number>(0);

  const selectedToothName = toothName(tooth_boxes[selectedToothIndex]);
  const selectedRecord =
    api?.dental_inventory?.find((t) => t.tooth_name === selectedToothName) ||
    null;

  // Handles all per-tooth updates
  const handleChange = (tooth_name, field, rawValue) => {
    const value = rawValue === "" ? null : Number(rawValue);
    updateField(
      "dental_inventory",
      { tooth_name, [field]: value },
      "tooth_name"
    );
  };

  return (
    <>
      <div
        className="
        relative  
        w-[275px] 
        h-[475px] 
        mx-auto 
        mt-[15px] 
        bg-[url('/permdent.bmp')]
        bg-contain 
        bg-center 
        bg-no-repeat
      "
      >
        {/* --- CENTER PANEL (Metrics + selected tooth info) --- */}
        {props.displayMode === "Metrics" ? (
          <div
            className="
            absolute
            top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[120px] h-[150px]
            bg-white/80
            border border-gray-600
            rounded-md
            z-50
          "
          >
            <div className="flex flex-col items-center">
              <p className="mb-[5px]">{selectedToothName}</p>

              <label>Width:</label>
              <input
                type="number"
                className="w-20 border border-gray-400 rounded px-1 bg-white text-black mb-[5px]"
                value={selectedRecord?.tooth_width ?? ""}
                onChange={(e) =>
                  handleChange(selectedToothName, "tooth_width", e.target.value)
                }
              />

              <label>Height:</label>
              <input
                type="number"
                className="w-20 border border-gray-400 rounded px-1 bg-white text-black"
                value={selectedRecord?.tooth_height ?? ""}
                onChange={(e) =>
                  handleChange(selectedToothName, "tooth_height", e.target.value)
                }
              />
            </div>
          </div>
        ) : props.displayMode !== "Morphology" ? (
          <div
            className="
            absolute
            top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[120px] h-auto
            bg-white/80
            border border-gray-600
            rounded-md
            z-50
          "
          >
            <div className="flex flex-col items-center">
              <p>{selectedToothName}</p>
            </div>
          </div>
        ) : null}

        {/* --- TOOTH INPUT BOXES / RADIO BUTTONS --- */}
        {tooth_boxes.map((box, i) => {
          const name = toothName(box);
          const record =
            api?.dental_inventory?.find((t) => t.tooth_name === name) || null;

          const xSigned = signedX(box);
          const { xPct, yPct } = normalizedToPaddedPercent(
            xSigned,
            box.unsidedBox.yNorm
          );

          const isMetricsMode = props.displayMode === "Metrics";
          const isMorphology = props.displayMode === "Morphology";

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {isMetricsMode ? (
                /* ---- RADIO BUTTON MODE ---- */
                <input
                  type="radio"
                  name="selected-tooth"
                  checked={selectedToothIndex === i}
                  onChange={() => setSelectedToothIndex(i)}
                  className="
                    h-5 w-5 
                    rounded-full
                    border border-gray-600
                    accent-blue-600
                    cursor-pointer
                  "
                />
              ) : !isMorphology ? (
                /* ---- INPUT BOX MODE ---- */
                <input
                  type="number"
                  className="
                    w-6 h-6 
                    border border-gray-500 
                    bg-white 
                    text-center
                  "
                  value={
                    props.displayMode === "Inventory"
                      ? record?.tooth_inv_code ?? ""
                      : props.displayMode === "Development"
                      ? record?.tooth_dev_code ?? ""
                      : props.displayMode === "Wear"
                      ? record?.tooth_wear_code ?? ""
                      : ""
                  }
                  onClick={() => setSelectedToothIndex(i)}
                  onChange={(e) => {
                    const field =
                      props.displayMode === "Inventory"
                        ? "tooth_inv_code"
                        : props.displayMode === "Development"
                        ? "tooth_dev_code"
                        : "tooth_wear_code";

                    handleChange(name, field, e.target.value);
                  }}
                />
              ) : (
                /* ---- MORPHOLOGY MODE ---- */
                (() => {
                  const allowed =
                    morphology_list.options[props.trait]?.[1] ?? [];
                  if (!allowed.includes(box.unsidedBox.unsidedName)) {
                    return null;
                  }

                  return (
                    <input
                      type="number"
                      className="
                        w-6 h-6 
                        border border-gray-500 
                        bg-white 
                        text-center
                        cursor-pointer
                      "
                      value={
                        api.morphology?.find(
                          (m) =>
                            m.tooth_name === name &&
                            m.morph_name === props.trait
                        )?.morph_value ?? ""
                      }
                      onChange={(e) =>
                        updateField(
                          "morphology",
                          {
                            tooth_name: name,
                            morph_name: props.trait,
                            morph_value: e.target.value === "" ? null : Number(e.target.value)
                          },
                          ["tooth_name", "morph_name"]   // <<-- NEW: composite key array
                        )
                      }
                    />
                  );
                })()
              )}
            </div>
            
          );
        })}
      </div>
      {/* --- MORPHOLOGY TRAIT LABEL (NO CSS CHANGES) --- */}
            {props.displayMode === "Morphology" && (
        <div
          className="
          text-center
          mt-[30px]
            text-black
            text-sm
            font-medium
            z-50
          "
        >
          Trait: {props.trait}
        </div>
      )}
    </>
  );
}
