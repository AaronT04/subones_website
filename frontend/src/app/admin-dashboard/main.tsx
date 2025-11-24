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
async function getIndData(): Promise<Individual[]> {
  try {
    const result = await api.get<Individual[]>("/api/list/individuals");
    return result;
  } catch (err) {
    console.error("Failed to fetch individuals:", err);
    return [];
  }
}

async function getBoneData(): Promise<Bone[]> {
  try {
    const result = await api.get<Bone[]>("/api/list/bones");
    return result;
  } catch (err) {
    console.error("Failed to fetch bones:", err);
    return [];
  }
}

async function getDentalData(): Promise<Dental[]> {
  try {
    const result = await api.get<Dental[]>("/api/list/dental");
    return result;
  } catch (err) {
    console.error("Failed to fetch dental:", err);
    return [];
  }
}

async function getSkullData(): Promise<Skull[]> {
  try {
    const result = await api.get<Skull[]>("/api/list/skull");
    return result;
  } catch (err) {
    console.error("Failed to fetch skull:", err);
    return [];
  }
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
        const [ind, bone, dental, skull] = await Promise.allSettled([
          getIndData(),
          getBoneData(),
          getDentalData(),
          getSkullData(),
        ]);
        if (cancelled) return;

        setIndData(ind.status === "fulfilled" ? ind.value : []);
        setBoneData(bone.status === "fulfilled" ? bone.value : []);
        setDentalData(dental.status === "fulfilled" ? dental.value : []);
        setSkullData(skull.status === "fulfilled" ? skull.value : []);
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

      await api.del(`/api/${type}/${id}`);

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