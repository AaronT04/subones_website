"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Measurement {
  column: string;
  value: number;
}

interface APIState {
  specimen: any;
  taxonomy: any;
  locality: any;
  bone: any;
  taphonomy: any;
  measurements: Measurement[];
}

const EditBoneAPIContext = createContext<any>(null);

export function EditBoneAPIProvider({ children }: any) {
  const [api, setAPI] = useState<APIState>({
    specimen: {},
    taxonomy: {},
    locality: {},
    bone: {},
    taphonomy: {},
    measurements: []
  });

  const loadFromServer = useCallback(async ({ boneId }: { boneId: number }) => {
    try {
      const res = await fetch(
        `http://localhost:7286/api/get/bone/details/${boneId}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        console.error("Failed to load details:", await res.text());
        return;
      }

      const data = await res.json();

      // ------------------------------
      // FIX: Convert measurement object to array
      // ------------------------------
      let formattedMeasurements: any[] = [];

      if (data.measurements && data.measurements.length > 0) {
        const row = data.measurements[0]; // one row

        formattedMeasurements = Object.entries(row)
          .filter(([key, value]) => key !== "specimen_id" && value !== null)
          .map(([key, value]) => ({
            column: key,
            value: value
          }));
      }
      // ------------------------------

      setAPI({
        specimen: data.specimen,
        taxonomy: data.taxonomy,
        locality: data.locality,
        bone: data.bone,
        taphonomy: data.taphonomy,
        measurements: formattedMeasurements
      });

    } catch (err) {
      console.error("loadFromServer error:", err);
    }
  }, []);

  return (
    <EditBoneAPIContext.Provider value={{ api, loadFromServer }}>
      {children}
    </EditBoneAPIContext.Provider>
  );
}

export function useEditBoneAPI() {
  return useContext(EditBoneAPIContext);
}
