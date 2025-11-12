"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { produce } from "immer";
import { EditSkeletonAPI, DEFAULT_EDIT_SKELETON_API } from "./skeleton-editor-types";
import { loadSkeletonData } from "./api/loadSkeleton";
import { saveSkeletonData } from "./api/saveSkeleton";
import { linkSpecimenToSkeleton } from "./api/linkSpecimenToSkeleton";
import { saveCraniometrics } from "./api/saveCraniometrics";

const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;
const EditSkeletonAPIContext = createContext<any>(null);

export const EditSkeletonAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, setAPI] = useState<EditSkeletonAPI>(DEFAULT_EDIT_SKELETON_API);

  useEffect(() => {
    loadSkeletonData(API_URL_ROOT!, setAPI);
    
  }, []);

  //console.log(api);

  async function handleSave() {
    const result = await saveSkeletonData(API_URL_ROOT!, api);
    alert(result.message);
    //await linkSpecimenToSkeleton(API_URL_ROOT!, api);
  }

  function updateField<T extends keyof EditSkeletonAPI>(
  section: T,
  fieldOrItem: keyof EditSkeletonAPI[T] | any,
  valueOrKey?: any,
  matchKey?: string
) {
  const toggle = <U,>(arr: U[], val: U): U[] => {
    return arr.includes(val)
      ? arr.filter(item => item !== val)
      : [...arr, val];
  };
  setAPI(prev =>
    produce(prev, draft => {
      const target = draft[section];

      // --- Case 1: Section is an array (like taphonomy, inventory, etc.) ---
      if (Array.isArray(target)) {
        const newItem = fieldOrItem;
        const key = valueOrKey;

        // Pattern: updateField("taphonomy", { bone_name: "Humerus", bone_condition: 2 }, "bone_name")
        if (typeof newItem === "object" && typeof key === "string") {
          const index = target.findIndex((item: any) => item[key] === newItem[key]);

          // ✅ Taphonomy special handling: auto-init + merge
          if (section === "taphonomy") {
            const defaults = {
              bone_name: "",
              taphonomy_id: -1,
              bone_condition: 0,
              surface_exposure: false,
              bone_color: "",
              staining: [],
              surface_damage: [],
              adherent_materials: [],
              modifications: [],
              comments: "",
            };

            if (index !== -1) {
              if (Array.isArray(target[index])) {
                toggle(target[index] ?? [], newItem);
              }
              else {
                // Merge updated fields into existing entry
                Object.assign(target[index], newItem);
              }
            } else {
              // Create new entry with safe defaults merged with provided fields
              target.push({ ...defaults, ...newItem });
            }
            return;
          }

          // ✅ General merge behavior for other array sections
          if (index !== -1) {
            Object.assign(target[index], newItem);
          } else {
            target.push(newItem);
          }
          return;
        }

        // Fallback for older usage patterns
        const keyName = matchKey;
        if (keyName && typeof fieldOrItem === "object") {
          const index = target.findIndex((item: any) => item[keyName] === fieldOrItem[keyName]);
          if (index !== -1) target[index] = fieldOrItem;
          else target.push(fieldOrItem);
          return;
        }

        // Legacy fallback
        const index = target.findIndex((item: any) => item[valueOrKey] === fieldOrItem[valueOrKey]);
        if (index !== -1) target[index] = fieldOrItem;
        else target.push(fieldOrItem);
        return;
      }

      // --- Case 2: Section is a simple object (e.g., specimen, taxonomy, locality) ---
      const field = fieldOrItem as keyof EditSkeletonAPI[T];
      const value = valueOrKey;
      const current = (target as any)[field];

      if (Array.isArray(current)) {
        const idx = current.indexOf(value);
        if (idx === -1) current.push(value);
        else current.splice(idx, 1);
        return;
      }

      (target as any)[field] = value;
    })
  );
  }

  return (
    <EditSkeletonAPIContext.Provider value={{ api, updateAPI: setAPI, updateField, handleSave}}>
      {children}
    </EditSkeletonAPIContext.Provider>
  );
};

export function useEditSkeletonAPI() {
  const ctx = useContext(EditSkeletonAPIContext);
  if (!ctx)
    throw new Error("useEditSkeletonAPI must be used within an EditSkeletonAPIProvider");
  return ctx;
}
