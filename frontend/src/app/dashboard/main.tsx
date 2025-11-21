// main.tsx
"use client"

import { api } from "./api";
import * as PageManager from "@/lib/pageManager";

async function getIndData(): Promise<Individual[]> {
  try {
    const result = api.get<Individual[]>("/api/list/individuals");
    return result;
  }
  catch(err) {
    return [];
  }
  
}

async function getBoneData(): Promise<Bone[]> {
  try {
    const result = api.get<Bone[]>("/api/list/bones");
    return result;
  }
  catch(err) {
    return [];
  }
}

async function getDentalData(): Promise<Dental[]> {
  try {
    const result = api.get<Dental[]>("/api/list/dental");
    return result;
  }
  catch(err) {
    return [];
  }
}

async function getSkullData(): Promise<Skull[]> {
  try {
    const result = api.get<Skull[]>("/api/list/skull");
    return result;
  }
  catch(err) {
    return [];
  }
}

import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import * as React from "react"
import { DataTable } from "./data-table"
import { Individual, indColumns } from "./columns/ind-columns"
import { Dental, dentalColumns } from "./columns/dental-columns"
import { Bone, boneColumns } from "./columns/bone-columns"
import { Skull, skullColumns} from "./columns/skull-columns"
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog-context';

export default function Main(){
  const router = useRouter();
  PageManager.connectRouter(router);

  const [indData, setIndData] = useState<Individual[]>([]);
  const [boneData, setBoneData] = useState<Bone[]>([]);
  const [dentalData, setDentalData] = useState<Dental[]>([]);
  const [skullData, setSkullData] = useState<Skull[]>([]);
  const [loading, setLoading] = useState(true);

  const confirm = useConfirmDialog();

  useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    try {
      const [ind, bone, dental, skull] = await Promise.allSettled([
        getIndData(),
        getBoneData(),
        getDentalData(),
        getSkullData()
      ]);

      if (cancelled) return;

      setIndData(ind.status === "fulfilled" ? ind.value : []);
      setBoneData(bone.status === "fulfilled" ? bone.value : []);
      setDentalData(dental.status === "fulfilled" ? dental.value : []);
      setSkullData(skull.status === "fulfilled" ? skull.value : []);
    } catch (err) {
      console.error("Unexpected error fetching data:", err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  // Safety timeout: stop loading even if backend is unresponsive
  const timeout = setTimeout(() => {
    if (!cancelled) {
      console.warn("Fetch timeout: backend may be down, showing empty data");
      setLoading(false);
    }
  }, 6000); // 6 seconds fallback

  fetchData();

  return () => {
    cancelled = true;
    clearTimeout(timeout);
  };
}, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const confirmAddIndividual = async() => {
    const confirmed = await confirm({
      title:"",
      description:"This will create an entire skeleton. Are you sure you want to continue? (It doesn't really matter though you can do whatever you want it's your life)",
      confirmText:"OK",
      cancelText:"Cancel"
    })
    if (!confirmed) return;
    setLoading(true);
    PageManager.handleCreateSkeleton();
  }

  // NEW: row click handlers to push to detail pages
  const goBone = (b: Bone) => PageManager.handleEditBone(b.id, b.name);
  const goInd  = (i: Individual) => PageManager.handleEditSkeleton(i.id);
  const goDent = (d: Dental) => PageManager.handleEditDental(d.id);
  const goSkull = (s: Skull) => {PageManager.handleEditBone(s.id, "Skull")}

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
                onRowClick={goBone}            // NEW
              />
            </div>
          </TabsContent>

          <TabsContent value="individual">
            <div>
              <DataTable
                columns={indColumns}
                data={indData}
                type="Individual"
                onAddClick={confirmAddIndividual}
                onRowClick={goInd}             // NEW
              />
            </div>
          </TabsContent>
          <TabsContent value="skull">
            <div>
              <DataTable
                columns={skullColumns}
                data={skullData}
                type="Skull"
                onAddClick={() => PageManager.handleCreateBone("Skull")}
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
                onAddClick={() => PageManager.handleCreateDental()}
                onRowClick={goDent}            // NEW
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
