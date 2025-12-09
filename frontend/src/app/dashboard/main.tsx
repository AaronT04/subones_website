// main.tsx
"use client"

import { api } from "@/lib/api"

async function getIndData(): Promise<Individual[]> {
  return api.get<Individual[]>("/list/individuals");
}

async function getBoneData(): Promise<Bone[]> {
  return api.get<Bone[]>("/list/bones");
}

async function getDentalData(): Promise<Dental[]> {
  return api.get<Dental[]>("/list/dental");
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
import { useEffect, useState } from 'react';
import { useConfirmDialog } from '@/components/confirm-dialog-context';

export default function Main(){
  const router = useRouter();

  const [indData, setIndData] = useState<Individual[]>([]);
  const [boneData, setBoneData] = useState<Bone[]>([]);
  const [dentalData, setDentalData] = useState<Dental[]>([]);
  const [loading, setLoading] = useState(true);

  const confirm = useConfirmDialog();

  useEffect(() => {
    async function fetchData() {
      const [ind, bone, dental] = await Promise.all([
        getIndData(),
        getBoneData(),
        getDentalData(),
      ]);
      setIndData(ind);
      setBoneData(bone);
      setDentalData(dental);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const confirmAddIndividual = async() => {
    const confirmed = await confirm({
      title:"",
      description:"This will create an entire skeleton. Are you sure you want to continue?",
      confirmText:"OK",
      cancelText:"Cancel"
    })
    if (!confirmed) return;
    setLoading(true);
    router.push('/skeleton-editor');
  }

  // Row click handlers
  // 👇 CHANGE IS HERE: goBone now pushes to /bone-viewer with boneId query param
  const goBone = (b: Bone) => router.push(`/bone-viewer?boneId=${b.id}`)
  const goInd  = (i: Individual) => router.push(`/individuals/${i.id}`)
  const goDent = (d: Dental) => router.push(`/dental/${d.id}`)

  return (
    <div>
      <div className="rounded-md">
        <Tabs defaultValue="bone" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bone">Bone</TabsTrigger>
            <TabsTrigger value="individual">Individuals</TabsTrigger>
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
                onAddClick={confirmAddIndividual}
                onRowClick={goInd}
              />
            </div>
          </TabsContent>

          <TabsContent value="dental">
            <div>
              <DataTable
                columns={dentalColumns}
                data={dentalData}
                type="Dental"
                onAddClick={() => router.push("/add-bone")}
                onRowClick={goDent}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
