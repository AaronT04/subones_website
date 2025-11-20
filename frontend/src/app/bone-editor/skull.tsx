import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/skeleton-editor/craniometrics-list"
import Craniometrics from "@/components/editor/skeleton-editor/Craniometrics"
import CranialNonmetrics from "@/components/editor/skeleton-editor/CranialNonmetrics"
import CranialInventory from '@/components/editor/skeleton-editor/CranialInventory';

function Skull(props) {
    return(

            <div>
                
                <Tabs defaultValue="Craniometrics" className="relative w-full">
                    <TabsList className = "grid w-full grid-cols-3">
                        <TabsTrigger value="Craniometrics">Metrics</TabsTrigger>
                        <TabsTrigger value="Cranial Nonmetrics">Nonmetrics</TabsTrigger>
                        <TabsTrigger value="Cranial Inventory">Inventory</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Craniometrics">
                        <Craniometrics skullProps={props}/>
                    </TabsContent>
                    <TabsContent value="Cranial Nonmetrics">
                        <CranialNonmetrics skullProps={props}/>
                    </TabsContent>
                    <TabsContent value="Cranial Inventory">
                        <CranialInventory skullProps={props}/>
                    </TabsContent>
                </Tabs>

            </div>

    )
} export default Skull