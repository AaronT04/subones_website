"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useConfirmDialog } from "@/components/confirm-dialog-context";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { DataTable } from "./data-table";
import { Individual, createIndColumns } from "./columns/ind-columns";
import { Bone, createBoneColumns } from "./columns/bone-columns";
import { Dental, createDentalColumns } from "./columns/dental-columns";
import { Skull, createSkullColumns } from "./columns/skull-columns";

// ────────────────────────────────
// Fetch helpers
// ────────────────────────────────
// ────────────────────────────────
// Fetch helpers (Updated to fetch ALL data via CRUD endpoints)
// ────────────────────────────────
async function getAllData() {
  const limit = 10000;

  // Use Promise.allSettled to enable partial success
  const results = await Promise.allSettled([
    api.get<any[]>(`/api/bone?limit=${limit}`),
    api.get<any[]>(`/api/skeleton?limit=${limit}`),
    api.get<any[]>(`/api/skull?limit=${limit}`),
    api.get<any[]>(`/api/specimen?limit=${limit}`),
    api.get<any[]>(`/api/museum?limit=${limit}`)
  ]);

  const [bonesRes, skeletonsRes, skullsRes, specimensRes, museumsRes] = results;

  const bones = bonesRes.status === "fulfilled" ? bonesRes.value : [];
  const skeletons = skeletonsRes.status === "fulfilled" ? skeletonsRes.value : [];
  const skulls = skullsRes.status === "fulfilled" ? skullsRes.value : [];
  const specimens = specimensRes.status === "fulfilled" ? specimensRes.value : [];
  const museums = museumsRes.status === "fulfilled" ? museumsRes.value : [];

  // Create lookup maps
  const specMap = new Map(specimens.map(s => [s.specimen_id, s]));
  const museumMap = new Map(museums.map(m => [m.museum_id, m.museum_name]));

  // 1. Bones
  // dashboard.js: s.specimen_id AS id
  const boneList: Bone[] = bones.map((b: any) => {
    const s = specMap.get(b.specimen_id);
    return {
      id: b.bone_id,
      menuID: s ? `B-${s.specimen_number}` : `B-${b.bone_id}`,
      name: b.bone_name || b.bone_type || 'Bone',
      museum: s ? (museumMap.get(s.museum_id) || '') : '',
      user: s ? `User ${s.user_id}` : ''
    };
  }).filter(b => b.name !== 'Skull');

  // 2. Individuals
  // dashboard.js: s.skeleton_id AS id
  const indList: Individual[] = skeletons.map((sk: any) => {
    const s = specMap.get(sk.specimen_id);
    return {
      id: sk.skeleton_id,
      menuID: `I-${sk.skeleton_id}`,
      name: sk.skeleton_name,
      museum: s ? (museumMap.get(s.museum_id) || '') : '',
      user: s ? `User ${s.user_id}` : ''
    };
  });

  // 3. Skulls
  // dashboard.js: s.specimen_id AS id
  const skullList: Skull[] = skulls.map((sk: any) => {
    const s = specMap.get(sk.specimen_id);
    return {
      id: sk.specimen_id, // mapped from specimen_id in crud
      menuID: s ? `SK-${s.specimen_number}` : `SK-${sk.specimen_id}`,
      name: (s && (s.specimen_name || s.specimen_number)) || 'Skull',
      museum: s ? (museumMap.get(s.museum_id) || '') : '',
      user: s ? `User ${s.user_id}` : ''
    };
  });

  // 4. Dental
  // Cannot reliably fetch dental without tooth_inventory access
  const dentalList: Dental[] = [];

  return { boneList, indList, skullList, dentalList };
}

// ────────────────────────────────
// Component
// ────────────────────────────────
export default function Main() {
  const router = useRouter();
  const confirm = useConfirmDialog();

  const [indData, setIndData] = useState<Individual[]>([]);
  const [boneData, setBoneData] = useState<Bone[]>([]);
  const [dentalData, setDentalData] = useState<Dental[]>([]);
  const [skullData, setSkullData] = useState<Skull[]>([]);
  const [loading, setLoading] = useState(true);

  // ────────────────────────────────
  // Fetch all data
  // ────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const { boneList, indList, skullList, dentalList } = await getAllData();

        if (cancelled) return;

        setIndData(indList);
        setBoneData(boneList);
        setDentalData(dentalList);
        setSkullData(skullList);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ────────────────────────────────
  // Delete handler - FIXED: using singular endpoint names
  // ────────────────────────────────
  async function handleDelete(
    type: "bone" | "individual" | "dental" | "skull",
    id: string | number
  ) {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);
      console.log('Token value:', token);

      const confirmed = await confirm({
        title: "Delete Entry?",
        description: `This will permanently remove this ${type} entry.`,
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (!confirmed) return;

      // Map frontend types to backend endpoints
      const endpointMap: Record<string, string> = {
        bone: "bone",
        individual: "skeleton",
        skull: "skull",
        dental: "dental"
      };

      const endpoint = endpointMap[type] || type;
      console.log(`Deleting ${type} with ID ${id} at endpoint ${endpoint}`);
      await api.del(`/api/${endpoint}/${id}`);

      // Now compare with consistent types
      if (type === "bone") setBoneData(prev => prev.filter(b => String(b.id) !== String(id)));
      if (type === "individual") setIndData(prev => prev.filter(i => String(i.id) !== String(id)));
      if (type === "dental") setDentalData(prev => prev.filter(d => String(d.id) !== String(id)));
      if (type === "skull") setSkullData(prev => prev.filter(s => String(s.id) !== String(id)));
    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
    }
  }

  // ────────────────────────────────
  // Column configs
  // ────────────────────────────────
  const boneColumns = React.useMemo(
    () => createBoneColumns((id) => handleDelete("bone", id)),
    []
  );
  const indColumns = React.useMemo(
    () => createIndColumns((id) => handleDelete("individual", id)),
    []
  );
  const dentalColumns = React.useMemo(
    () => createDentalColumns((id) => handleDelete("dental", id)),
    []
  );
  const skullColumns = React.useMemo(
    () => createSkullColumns((id) => handleDelete("skull", id)),
    []
  );

  // ────────────────────────────────
  // Navigation
  // ────────────────────────────────
  const goBone = (b: Bone) => router.push(`/bones/${b.id}`);
  const goInd = (i: Individual) => router.push(`/individuals/${i.id}`);
  const goDent = (d: Dental) => router.push(`/dental/${d.id}`);
  const goSkull = (s: Skull) => router.push(`/bones/${s.id}`);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <div className="rounded-md">
        <Tabs defaultValue="bone" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bone">Bone</TabsTrigger>
            <TabsTrigger value="individual">Individuals</TabsTrigger>
            <TabsTrigger value="skull">Skull</TabsTrigger>
            <TabsTrigger value="dental">Dental</TabsTrigger>
          </TabsList>

          <TabsContent value="bone">
            <div>
              <DataTable
                columns={boneColumns}
                data={boneData}
                type="Bone"
                onAddClick={() => router.push('/add-bone')}
                onRowClick={goBone}
              />
            </div>
          </TabsContent>

          <TabsContent value="individual">
            <div>
              <DataTable
                columns={indColumns}
                data={indData}
                type="Individual"
                onAddClick={() => router.push('/add-individual')}
                onRowClick={goInd}
              />
            </div>
          </TabsContent>

          <TabsContent value="skull">
            <div>
              <DataTable
                columns={skullColumns}
                data={skullData}
                type="Skull"
                onAddClick={() => router.push(`/bone-editor?boneName=Skull`)}
                onRowClick={goSkull}
              />
            </div>
          </TabsContent>

          <TabsContent value="dental">
            <div>
              <DataTable
                columns={dentalColumns}
                data={dentalData}
                type="Dental"
                onAddClick={() => router.push("/dental-editor")}
                onRowClick={goDent}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}