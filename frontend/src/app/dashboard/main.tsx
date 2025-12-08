// main.tsx
"use client"

import * as PageManager from "@/lib/pageManager";
import { api } from "@/lib/api"
import type {DecodedToken} from "@/lib/api/dataTypes"
import {loadUser} from "@/lib/loadUser";
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

async function getIndData(user? : DecodedToken): Promise<Individual[]> {
  try {
    console.log(user);
    const result = api.get<Individual[]>(`/api/list/individuals?id=${user?.id}`);
    return result;
  }
  catch(err) {
    return [];
  }
  
}

async function getBoneData(user? : DecodedToken): Promise<Bone[]> {
  try {
    const result = api.get<Bone[]>(`/api/list/bones?id=${user?.id}`);
    return result;
  }
  catch(err) {
    return [];
  }
}

async function getDentalData(user? : DecodedToken): Promise<Dental[]> {
  try {
    const result = api.get<Dental[]>(`/api/list/dental?id=${user?.id}`);
    return result;
  }
  catch(err) {
    return [];
  }
}

async function getSkullData(user? : DecodedToken): Promise<Skull[]> {
  try {
    const result = api.get<Skull[]>(`/api/list/skull?id=${user?.id}`);
    return result;
  }
  catch(err) {
    return [];
  }
}



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
      const user = loadUser();
      const [ind, bone, dental, skull] = await Promise.allSettled([
        getIndData(user),
        getBoneData(user),
        getDentalData(user),
        getSkullData(user)
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

  // NEW: row click handlers to push to detail pages
  const goBone = (b: Bone) => PageManager.handleEditBone(b.id, b.name);
  const goInd  = (i: Individual) => PageManager.handleEditSkeleton(i.id);
  const goDent = (d: Dental) => PageManager.handleEditDental(d.id);
  const goSkull = (s: Skull) => {PageManager.handleEditSkull(s.id)}

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
                //onAddClick={confirmAddIndividual}
                onAddClick={() => PageManager.handleCreateSkeleton()}
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
                onAddClick={() => PageManager.handleCreateSkull()}
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
