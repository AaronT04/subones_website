"use client"

import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "@/components/editor/Left/Specimen"
import Taxonomy from "@/components/editor/Left/Taxonomy"
import Locality from "@/components/editor/Left/Locality"
import { useBoneEditorContext } from "./context"
import {useState} from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SaveButton from "@/components/editor/Left/SaveButton"
import ExitButton from "@/components/editor/Left/ExitButton"

function Left() {
    const [loading, setLoading] = useState(false);
    const { userData, formContext, localityContext, handleSave } = useBoneEditorContext();
    
    const router = useRouter();
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return(
        <div className = "flex-col h-screen overflow-y-scroll">

            <ExitButton setLoading={setLoading} router={router}/>   

            <div className="w-[90%] py-20">
                <Specimen userData={userData} formContext={formContext}/>
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