"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import { Button } from "@/components/ui/button"
  import Craniometrics from "@/components/editor/skeleton-editor/Craniometrics"
  import PostcranialMetrics from '@/components/editor/skeleton-editor/PostcranialMetrics';
  import CranialNonmetrics from "@/components/editor/skeleton-editor/CranialNonmetrics"
import CranialInventory from '@/components/editor/skeleton-editor/CranialInventory';
import PostcranialInventory from '@/components/editor/skeleton-editor/PostcranialInventory';
import Dental from '@/components/editor/skeleton-editor/Dental';
 
function Right() {
    
    return(

    <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">

        <div className="flex justify-center px-4">
            <Tabs defaultValue="cranium" className="relative w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="cranium">Cranium</TabsTrigger>
                    <TabsTrigger value="postcranial">Postcranial</TabsTrigger>
                    <TabsTrigger value="dental">Dental</TabsTrigger>
                </TabsList>
                    <TabsContent value="cranium">
                        <Tabs className="relative w-full">
                            <TabsList className = "grid w-full grid-cols-3">
                                <TabsTrigger value="Craniometrics">Metrics</TabsTrigger>
                                <TabsTrigger value="Cranial Nonmetrics">Nonmetrics</TabsTrigger>
                                <TabsTrigger value="Cranial Inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Craniometrics">
                                <Craniometrics/>
                            </TabsContent>
                            <TabsContent value="Cranial Nonmetrics">
                                <CranialNonmetrics/>
                            </TabsContent>
                            <TabsContent value="Cranial Inventory">
                                <CranialInventory/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="postcranial">
                        <Tabs className="relative w-full">
                            <TabsList className = "grid w-full grid-cols-2">
                                <TabsTrigger value="Postcranial Metrics">Metrics</TabsTrigger>
                                <TabsTrigger value="Postcranial Inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Postcranial Metrics">
                                <PostcranialMetrics/>
                            </TabsContent>
                            <TabsContent value="Postcranial Inventory">
                                <PostcranialInventory/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="dental">
                            <Dental/>
                    </TabsContent>
            </Tabs>
        </div>

    </div>  

    );
}
export default Right