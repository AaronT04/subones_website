import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "@/components/editor/Left/Specimen"
import Taxonomy from "@/components/editor/Left/Taxonomy"
import Locality from "@/components/editor/Left/Locality"
import { useSkullEditorContext } from "./context"
import {useState} from 'react'

import SaveButton from "@/components/editor/Left/SaveButton"
import ExitButton from "@/components/editor/Left/ExitButton"



function Left() {
    const [loading, setLoading] = useState(false);
    const { handleSave, localityContext, formContext, skullContext, userData} = useSkullEditorContext();
    
    const router = useRouter();
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return(
        <div className = "flex-col h-screen overflow-y-scroll">

            <ExitButton setLoading={setLoading} router={router}/>

            <div className="flex flex-col items-center w-[90%] h-[350px]">
                <Specimen formContext={formContext} userData={userData}/>
                <div className="flex flex-row w-full justify-center">
                    <label className="mt-[10px] mx-[30px]">Has Cranium:</label>
                    <input checked={skullContext.hasCranium} 
                    onChange={(e) => skullContext.update(prev =>
                        ({...prev, hasCranium: e.target.checked}))}
                        type="checkbox"/>
                </div>
                <br/>
                <div className="flex flex-row w-full justify-center">
                    <label className="mt-[10px] mx-[30px]">Has Mandible:</label>
                    <input checked={skullContext.hasMandible} 
                    onChange={(e) => skullContext.update(prev =>
                        ({...prev, hasMandible: e.target.checked}))}
                        type="checkbox"/>
                </div>
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