"use client"

import { metrics_list } from "../metrics/fullmetricslist"
import React, {useState, useContext} from 'react';
import { useRouter } from 'next/navigation'
import * as PageManager from "@/lib/pageManager";

import {
  Tabs,
  TabsTrigger,
  TabsContent,
  TabsList
} from "@/components/ui/tabs"

  import {
    Button
  } from "@/components/ui/button"

  import {
    Button2 
  } from "@/components/ui/button2"
   
  export function BoneMenu() {

    const router = useRouter();
    PageManager.connectRouter(router);

    return (
      <>
        <h1> Add Bone</h1>
        <div className="flex flex-col">
        <div className="flex flex-wrap justify-evenly max-h-150 gap-2 w-full">
                {metrics_list.postcranial_metrics.map((name, i) => 
                <Button2 className="text-left text-white bg-maroon hover:bg-maroon2" variant="default" name={name} key={i} 
                onClick={() => PageManager.handleCreateBone(name)}
                > 
                {name} </Button2>)}
              </div>
        </div>
      </>
    )
  }
