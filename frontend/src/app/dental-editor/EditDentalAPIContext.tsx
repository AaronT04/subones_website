"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { produce } from "immer";
import { DentalAPI, DEFAULT_DENTAL_API } from "./dental-types";
import {saveDentalData} from "./api/saveDental"
import {loadDentalData} from "./api/loadDental"
import {loadUser} from "@/lib/loadUser"


const EditDentalAPIContext = createContext<any>(null);
const API_URL_ROOT = process.env.NEXT_PUBLIC_API_URL;

export const EditDentalAPIProvider = ({children} : {children: React.ReactNode}) => {
    const [api, setAPI] = useState<DentalAPI>(DEFAULT_DENTAL_API);
    
    useEffect(() => {
        loadUser(setAPI);
        //loadDentalData(API_URL_ROOT!, setAPI); //test with specimen_id = 7
    }, [])
    
    
    async function handleSave() {
        const result = await saveDentalData(API_URL_ROOT!, api, setAPI);
        alert(result.message);
    }
    function updateField<T extends keyof DentalAPI>(
        section: T,
        fieldOrItem: keyof DentalAPI[T] | any,
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
    
            //
            // --- CASE 1: SECTION IS AN ARRAY (inventory, taphonomy, etc.) ---
            //
            if (Array.isArray(target)) {
              // -----------------------------------------------
              // SUPPORT COMPOSITE KEYS (e.g. ["tooth_name", "morph_name"])
              // -----------------------------------------------
              if (Array.isArray(valueOrKey) && typeof fieldOrItem === "object") {
                const keys: string[] = valueOrKey;
    
                const index = target.findIndex(row =>
                  keys.every(k => String(row[k]) === String(fieldOrItem[k]))
                );
    
                if (index !== -1) {
                  // merge into existing row
                  Object.assign(target[index], fieldOrItem);
                } else {
                  // insert new morphology row
                  target.push(fieldOrItem);
                }
    
                return; // VERY IMPORTANT
              }
              const newItem = fieldOrItem;
              const key = valueOrKey;
    
              // Example call:
              // updateField("taphonomy", { bone_name: "Humerus", staining: "Blue" }, "bone_name")
              if (typeof newItem === "object" && typeof key === "string") {
                const index = target.findIndex((item: any) => item[key] === newItem[key]);
    
                //
                // --- SPECIAL LOGIC FOR TAPHONOMY ---
                //
                /*
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
    
                  // Existing entry
                  if (index !== -1) {
                    const entry = target[index];
    
                    for (const k in newItem) {
                      const val = newItem[k];
    
                      // If this field is one of the known taphonomy array fields,
                      // toggle the value inside the existing array.
                      if (Array.isArray(entry[k])) {
                        entry[k] = toggle(entry[k], val);
                      } else {
                        // Otherwise merge normally
                        entry[k] = val;
                      }
                    }
    
                    return;
                  }
    
                  // New entry → initialize defaults + merge
                  const entry = { ...defaults, ...newItem };
    
                  // Ensure all array fields are arrays
                  for (const k in entry) {
                    if (Array.isArray(defaults[k]) && !Array.isArray(entry[k])) {
                      entry[k] = [entry[k]];
                    }
                  }
    
                  target.push(entry);
                  return;
                }
                  */
    
                //
                // --- GENERAL LOGIC FOR OTHER ARRAY SECTIONS ---
                //
                if (index !== -1) {
                  Object.assign(target[index], newItem);
                } else {
                  target.push(newItem);
                }
                return;
              }
    
              // Fallback for legacy call pattern
              const keyName = matchKey;
              if (keyName && typeof fieldOrItem === "object") {
                const index = target.findIndex((item: any) => item[keyName] === fieldOrItem[keyName]);
                if (index !== -1) target[index] = fieldOrItem;
                else target.push(fieldOrItem);
                return;
              }
    
              const index = target.findIndex((item: any) => item[valueOrKey] === fieldOrItem[valueOrKey]);
              if (index !== -1) target[index] = fieldOrItem;
              else target.push(fieldOrItem);
              return;
            }
    
            //
            // --- CASE 2: SECTION IS A PLAIN OBJECT (specimen, taxonomy, locality, etc.) ---
            //
            const field = fieldOrItem as keyof DentalAPI[T];
            const value = valueOrKey;
            const current = (target as any)[field];
    
            if (Array.isArray(current)) {
              // toggle logic for fields like specimen.interments[] if needed
              const idx = current.indexOf(value);
              if (idx === -1) current.push(value);
              else current.splice(idx, 1);
              return;
            }
    
            (target as any)[field] = value;
          })
        );
    }
    return(
        <EditDentalAPIContext.Provider 
        value={{api, 
        updateAPI: setAPI,
        updateField,
        handleSave
        }}>
            {children}
        </EditDentalAPIContext.Provider>
    )
}

export function useDentalAPI() {
    const ctx = useContext(EditDentalAPIContext);
    if (!ctx)
        throw new Error("useDentalAPI must be used within an EditDentalAPIProvider");
    return ctx;
}