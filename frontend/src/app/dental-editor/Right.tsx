
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/editor/skeleton-editor/craniometrics-list"
import Craniometrics from "../../components/temp-allcomponents/Craniometrics"
import CranialNonmetrics from "../../components/temp-allcomponents/CranialNonmetrics"
import CranialInventory from '../../components/temp-allcomponents/CranialInventory'
import Dental from '../../components/temp-allcomponents/Dental'
import { useDentalEditorContext } from "./DentalEditorContext"

function Right(props) {
    const {dentalContext} = useDentalEditorContext();
    return(
            <div>   
                <Dental dentalContext={dentalContext}/>
            </div>

    )
} export default Right