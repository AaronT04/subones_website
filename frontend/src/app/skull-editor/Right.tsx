
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/skeleton-editor/craniometrics-list"
import Craniometrics from "./Craniometrics"
import CranialNonmetrics from "./CranialNonmetrics"
import CranialInventory from '@/components/editor/skeleton-editor/CranialInventory';
import Dental from '@/components/editor/skeleton-editor/Dental'
import { useSkullContext } from "./context/SkullContext"

function Right(props) {
    const { skullContext,  craniometricsContext, cranialNonmetricsContext} = useSkullContext();
    return(
            <div>
                <Tabs defaultValue="Craniometrics" className="relative w-full">
                    <TabsList className = "grid w-full grid-cols-4">
                        <TabsTrigger value="Craniometrics">Metrics</TabsTrigger>
                        <TabsTrigger value="Cranial Nonmetrics">Nonmetrics</TabsTrigger>
                        <TabsTrigger value="Cranial Inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="Dental">Dental</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Craniometrics">
                        <Craniometrics skullContext={skullContext} craniometricsContext={craniometricsContext}/>
                    </TabsContent>
                    <TabsContent value="Cranial Nonmetrics">
                        <CranialNonmetrics skullContext={skullContext} cranialNonmetricsContext={cranialNonmetricsContext}/>
                    </TabsContent>
                    <TabsContent value="Cranial Inventory">
                        <CranialInventory skullProps={props}/>
                    </TabsContent>
                    <TabsContent value="Dental">
                        <Dental skullProps={props}/>
                    </TabsContent>
                </Tabs>

            </div>

    )
} export default Right