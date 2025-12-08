"use client"

import { metrics_list } from "../metrics/fullmetricslist"
import { boneCategories } from "../metrics/handsfeet" // Update this import path
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
    const [loading, setLoading] = useState(false);
    PageManager.connectRouter(router);

    return (
      <>
        <h1 className="flex-1">Add Bone</h1>
        <div className="flex flex-col">
          <Tabs defaultValue="cranial" className="w-full">
            <TabsList className="w-full mt-4 mb-5">
              <TabsTrigger value="cranial">Cranial</TabsTrigger>
              <TabsTrigger value="postcranial">Postcranial</TabsTrigger>
              <TabsTrigger value="hands-feet">Hands and Feet</TabsTrigger>
            </TabsList>
            <TabsContent value="cranial">
              <div className="flex flex-wrap max-h-150 gap-2 w-full">
                <div>
                  {metrics_list.cranial_metrics.map((name, i) => 
                <Button2 className="text-left text-white bg-maroon hover:bg-maroon2" variant="default" name={name} key={i} 
                  onClick={() => 
                    PageManager.handleCreateBone(name)}
                > 
                {name} </Button2>)}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="postcranial">
              <div className="flex flex-wrap justify-evenly max-h-150 gap-2 w-full">
                {metrics_list.postcranial_metrics.map((name, i) => 
                <Button2 className="text-left text-white bg-maroon hover:bg-maroon2" variant="default" name={name} key={i} 
                  onClick={() => 
                    PageManager.handleCreateBone(name)}
                > 
                {name} </Button2>)}
              </div>
            </TabsContent>
            <TabsContent value="hands-feet">
              <div className="flex flex-col gap-6 w-full">
                {boneCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIndex) => (
                        <Button2 
                          className="text-left text-white bg-maroon hover:bg-maroon2" 
                          variant="default" 
                          key={itemIndex}
                          onClick={() => {
                            PageManager.handleCreateBone(item)
                          }}
                        >
                          {item}
                        </Button2>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  }