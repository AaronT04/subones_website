
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/lists/craniometrics-list"
import Craniometrics from "../../components/editor/Craniometrics"
import CranialNonmetrics from "../../components/editor/CranialNonmetrics"
import CranialInventory from '../../components/editor/CranialInventory'
import PostcranialInventory from "@/components/editor/PostcranialInventory"
import PostcranialMetrics from "@/components/editor/PostcranialMetrics"
import Dental from '../../components/editor/Dental'
import { useSkeletonEditorContext } from "./context"

function Right(props) {
    const {craniometricsContext, cranialNonmetricsContext, postcranialInventoryContext,
         cranialInventoryContext, taphonomyContext, dentalContext, postcranialMetricsContext} = useSkeletonEditorContext();
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
                                <Craniometrics craniometricsContext={craniometricsContext}/>
                            </TabsContent>
                            <TabsContent value="Cranial Nonmetrics">
                                <CranialNonmetrics cranialNonmetricsContext={cranialNonmetricsContext}/>
                            </TabsContent>
                            <TabsContent value="Cranial Inventory">
                                <CranialInventory taphonomyContext={taphonomyContext} cranialInventoryContext={cranialInventoryContext}/>
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
                                <PostcranialMetrics postcranialMetricsContext={postcranialMetricsContext}/>
                            </TabsContent>
                            <TabsContent value="Postcranial Inventory">
                                <PostcranialInventory postcranialInventoryContext={postcranialInventoryContext} taphonomyContext={taphonomyContext}/>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="dental">
                            <Dental dentalContext={dentalContext}/>
                    </TabsContent>
            </Tabs>
        </div>

    </div>  

    );
} export default Right