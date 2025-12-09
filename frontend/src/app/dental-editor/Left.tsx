import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "@/components/editor/Left/Specimen"
import Taxonomy from "@/components/editor/Left/Taxonomy"
import Locality from "@/components/editor/Left/Locality"
import { useDentalEditorContext } from "./context"
import {useState} from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ExitButton from "@/components/editor/Left/ExitButton"
import SaveButton from "@/components/editor/Left/SaveButton"

function Left() {
    const [loading, setLoading] = useState(false);
    const { handleSave, localityContext, formContext, userData} = useDentalEditorContext();
    
    const router = useRouter();
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return(
        <div className = "flex-col h-screen overflow-y-scroll">

            <ExitButton setLoading={setLoading} router={router}/>

            <div className="flex flex-col items-center w-[90%] h-[350px]">
                <Specimen formContext={formContext} userData={userData}/>
            </div>
            
            

            <div className="flex-col w-full justify-center items-center max-w-md p-4">

                <Taxonomy/>
                <Locality localityContext={localityContext} formContext={formContext}/>

            </div>

            <SaveButton handleSave={handleSave}/>
        </div>
    );
} 



export default Left