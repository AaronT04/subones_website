// src/app/skeleton-editor/Right.tsx
"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Measurements from "@/components/editor/measurements";
import { Button } from "@/components/ui/button";
import Taphonomy from "@/components/editor/Taphonomy";
import Craniometrics from "@/components/editor/Craniometrics";
import PostcranialMetrics from "@/components/editor/PostcranialMetrics";
import CranialNonmetrics from "@/components/editor/CranialNonmetrics";
import CranialInventory from "@/components/editor/CranialInventory";
import PostcranialInventory from "@/components/editor/PostcranialInventory";
import PermanentInventory from "@/components/editor/PermanentInventory";
import DeciduousInventory from "@/components/editor/DeciduousInventory";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
// ✅ FIX: this context is in the same folder, not in /components
import { useEditBoneAPI } from "./EditBoneAPIContext";

function InnerRight() {
  const searchParams = useSearchParams();
  const { loadFromServer } = useEditBoneAPI();

  const boneIdParam = searchParams.get("boneId");
  const boneName = searchParams.get("boneName") || "";

  useEffect(() => {
    if (!boneIdParam) return;
    loadFromServer({ boneId: Number(boneIdParam), boneName: boneName || undefined });
  }, [boneIdParam, boneName, loadFromServer]);

  return (
    <div className="flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
      <div className="flex justify-center px-4">
        <Tabs defaultValue="cranium" className="relative w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cranium">Cranium</TabsTrigger>
            <TabsTrigger value="postcranial">Postcranial</TabsTrigger>
            <TabsTrigger value="dental">Dental</TabsTrigger>
          </TabsList>

          <TabsContent value="cranium">
            <Tabs className="relative w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="craniometrics">Metrics</TabsTrigger>
                <TabsTrigger value="cranialnonmetrics">Nonmetrics</TabsTrigger>
                <TabsTrigger value="cranialInventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="craniometrics">
                <Craniometrics />
              </TabsContent>

              <TabsContent value="cranialnonmetrics">
                <CranialNonmetrics />
              </TabsContent>

              <TabsContent value="cranialInventory">
                <CranialInventory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="postcranial">
            <Tabs className="relative w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="postMets">Metrics</TabsTrigger>
                <TabsTrigger value="taphonomy">Taphonomy</TabsTrigger>
                <TabsTrigger value="postInventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="postMets">
                <PostcranialMetrics />
              </TabsContent>

              <TabsContent value="taphonomy">
                <Taphonomy />
              </TabsContent>

              <TabsContent value="postInventory">
                <PostcranialInventory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="dental">
            <Tabs className="relative w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="permanent">Permanent</TabsTrigger>
                <TabsTrigger value="deciduous">Deciduous</TabsTrigger>
              </TabsList>

              <TabsContent value="permanent">
                <PermanentInventory />
              </TabsContent>

              <TabsContent value="deciduous">
                <DeciduousInventory />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Right() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <InnerRight />
    </Suspense>
  );
}
