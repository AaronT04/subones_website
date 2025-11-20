"use client"

import { metrics_list } from "../metrics/fullmetricslist"
import React, {useState, useContext} from 'react';
import { useRouter } from 'next/navigation';

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

    let [boneName, setBoneName] = useState("bone name");
    const router = useRouter();

    return (
      <>
        <h1> Add Bone</h1>
        <div className="flex flex-col">
        <div className="flex flex-wrap justify-evenly max-h-150 gap-2 w-full">
                {metrics_list.postcranial_metrics.map((name, i) => 
                <Button2 className="text-left text-white bg-maroon hover:bg-maroon2" variant="default" name={name} key={i} 
                onClick={() => {
                  setBoneName(name);
                  router.push(`/bone-editor?boneName=${encodeURIComponent(name)}`);
                  }}
                > 
                {name} </Button2>)}
              </div>
        </div>
      </>
    )
  }
