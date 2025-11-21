"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { morphology_list } from "./morphology_list";
import { useDentalAPI } from "./EditDentalAPIContext";
import { morph_help } from "./morph_help_data";

export type SidedToothBox = {
  unsidedBox: UnsidedToothBox;
  sideLR: "L" | "R";
};

export type UnsidedToothBox = {
  unsidedName: string;
  xNorm: number;
  yNorm: number;
};

export const validInventoryCodes = [1, 2, 3, 4, 5, 6, 9];
export const validWearCodes = [1, 2, 3, 4, 5, 6, 7, 8];
export const validDevelopmentCodes = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 99,
];

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



function validateToothValue(displayMode: string, rawValue: string, trait? : string | null) {
  if (rawValue === "") return ""; // allow clearing

  const value = Number(rawValue);
  if (isNaN(value)) return null;

  if (displayMode === "Metrics") {
    return value > 0 ? value : null;
  }

  if (displayMode === "Inventory") {
    return validInventoryCodes.includes(value) ? value : null;
  }

  if (displayMode === "Wear") {
    return validWearCodes.includes(value) ? value : null;
  }

  if (displayMode === "Development") {
    return validDevelopmentCodes.includes(value) ? value : null;
  }
  if(displayMode === "Morphology") {
    console.log(trait);
    if(!trait) return null;
      const traitInfo = morph_help.find((m) => m.title === trait);
      console.log(traitInfo);
      return traitInfo?.valid_codes.includes(value) ? value : null;
  }

  return value;
}

/* Tooth box definitions remain unchanged */
export const perm_boxes_generic: UnsidedToothBox[] = [
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

export const perm_boxes: SidedToothBox[] = perm_boxes_generic.flatMap((box) => [
  { unsidedBox: box, sideLR: "L" as const },
  { unsidedBox: box, sideLR: "R" as const },
]);

export const dec_boxes_generic: UnsidedToothBox[] = [
  { unsidedName: "UDM2", xNorm: 1, yNorm: 0.43 },
  { unsidedName: "UDM1", xNorm: 0.95, yNorm: 0.32 },
  { unsidedName: "UDC", xNorm: 0.8, yNorm: 0.23 },
  { unsidedName: "UDI2", xNorm: 0.55, yNorm: 0.15 },
  { unsidedName: "UDI1", xNorm: 0.2, yNorm: 0.1 },
  { unsidedName: "LDM2", xNorm: 1, yNorm: 0.6 },
  { unsidedName: "LDM1", xNorm: 0.95, yNorm: 0.72 },
  { unsidedName: "LDC", xNorm: 0.8, yNorm: 0.8 },
  { unsidedName: "LDI2", xNorm: 0.55, yNorm: 0.87 },
  { unsidedName: "LDI1", xNorm: 0.2, yNorm: 0.9 },
];

export const dec_boxes: SidedToothBox[] = dec_boxes_generic.flatMap((box) => [
  { unsidedBox: box, sideLR: "L" as const },
  { unsidedBox: box, sideLR: "R" as const },
]);

const toothName = (tooth_box: SidedToothBox) => {
  return tooth_box.sideLR + tooth_box.unsidedBox.unsidedName;
};

export default function ToothDisplay(props) {
  const { api, updateField } = useDentalAPI();
  const [selectedToothIndex, setSelectedToothIndex] = useState<number>(0);

  // NEW: Track invalid values so we can red-highlight them
  const [invalidMap, setInvalidMap] = useState<Record<string, boolean>>({});

  const tooth_boxes = props.dentition === "perm" ? perm_boxes : dec_boxes;

  const selectedToothName = toothName(tooth_boxes[selectedToothIndex]);
  const selectedRecord =
    api?.dental_inventory?.find((t) => t.tooth_name === selectedToothName) ||
    null;

  // Updated handleChange with invalid highlighting
  const handleChange = (tooth_name, field, rawValue) => {
    const validated = validateToothValue(props.displayMode, rawValue, props.trait);

    if (validated === null) {
      // mark invalid
      setInvalidMap((prev) => ({ ...prev, [tooth_name + field]: true }));
      return; // do not updateField
    }

    // clear invalid state
    setInvalidMap((prev) => ({ ...prev, [tooth_name + field]: false }));

    const value = validated === "" ? null : validated;
    if(props.displayMode != "Morphology") {
      updateField(
        "dental_inventory",
        { tooth_name, [field]: value },
        "tooth_name"
      );
    }
    else {
      updateField(
        "morphology",
        {tooth_name, morph_name: props.trait, morph_value: value
        },
        ["tooth_name", "morph_name"]
      );
    }
  };

  const imageURL =
    props.dentition === "perm" ? "/permdent.bmp" : "/decdent.bmp";
  return (
    <>
    <div className="flex justify-center my-[30px]">
      <label>Autofill:</label>
      <select className="w-[50px] mx-[20px]">
      </select>
    </div>
      <div
        className={`relative w-[275px] h-[475px] mx-auto mt-[15px] bg-contain bg-center bg-no-repeat ${
          props.dentition === "perm"
            ? "bg-[url('/permdent.bmp')]"
            : "bg-[url('/decdent.bmp')]"
        }`}
      >
        {/* Center panel logic stays the same */}
        {props.displayMode === "Metrics" ? (
          <div
            className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[120px] h-[150px]
              bg-white/80 border border-gray-600
              rounded-md z-50
            "
          >
            <div className="flex flex-col items-center">
              <p className="mb-[5px]">{selectedToothName}</p>

              <label>Width:</label>
              <input
                type="number"
                className={`
                  w-20 border rounded px-1 bg-white text-black mb-[5px]
                  ${
                    invalidMap[selectedToothName + "tooth_width"]
                      ? "border-red-500"
                      : "border-gray-400"
                  }
                `}
                value={selectedRecord?.tooth_width ?? ""}
                onChange={(e) =>
                  handleChange(
                    selectedToothName,
                    "tooth_width",
                    e.target.value
                  )
                }
              />

              <label>Height:</label>
              <input
                type="number"
                className={`
                  w-20 border rounded px-1 bg-white text-black
                  ${
                    invalidMap[selectedToothName + "tooth_height"]
                      ? "border-red-500"
                      : "border-gray-400"
                  }
                `}
                value={selectedRecord?.tooth_height ?? ""}
                onChange={(e) =>
                  handleChange(
                    selectedToothName,
                    "tooth_height",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        ) : props.displayMode !== "Morphology" ? (
          <div
            className="
              absolute top-1/2 left-1/2
              -translate-x-1/2 -translate-y-1/2
              w-[120px] bg-white/80
              border border-gray-600
              rounded-md z-50 text-center
            "
          >
            {selectedToothName}
          </div>
        ) : null}

        {/* ---- TOOTH GRID ---- */}
        {tooth_boxes.map((box, i) => {
          const name = toothName(box);
          const record =
            api?.dental_inventory?.find((t) => t.tooth_name === name) || null;

          const xSigned = signedX(box);
          const { xPct, yPct } = normalizedToPaddedPercent(
            xSigned,
            box.unsidedBox.yNorm
          );

          const isMetrics = props.displayMode === "Metrics";
          const isMorph = props.displayMode === "Morphology";

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
              {isMetrics ? (
                <input
                  type="radio"
                  name="selected-tooth"
                  checked={selectedToothIndex === i}
                  onChange={() => setSelectedToothIndex(i)}
                  className="h-5 w-5 rounded-full border border-gray-600 accent-blue-600 cursor-pointer"
                />
              ) : !isMorph ? (
                <input
                  type="number"
                  className={`
                    w-6 h-6 border bg-white text-center
                    ${
                      invalidMap[name + props.displayMode]
                        ? "border-red-500"
                        : "border-gray-500"
                    }
                  `}
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
                (() => {
                  const allowed =
                    morphology_list.options[props.trait]?.[1] ?? [];
                  if (!allowed.includes(box.unsidedBox.unsidedName)) {
                    return null;
                  }

                  return (
                    <input
                      type="number"
                      className={`
                        w-6 h-6 border bg-white text-center cursor-pointer
                        ${
                          invalidMap[name + props.trait]
                            ? "border-red-500"
                            : "border-gray-500"
                        }
                      `}
                      value={
                        api.morphology?.find(
                          (m) =>
                            m.tooth_name === name &&
                            m.morph_name === props.trait
                        )?.morph_value ?? ""
                      }
                      onChange={(e) =>
                        handleChange(name, "morph_name", e.target.value)
                      }
                    />
                  );
                })()
              )}
            </div>
          );
        })}
      </div>

      {props.displayMode === "Morphology" && (
        <div className="text-center mt-[30px] text-black text-sm font-medium z-50">
          Trait: {props.trait}
        </div>
      )}
    </>
  );
}
