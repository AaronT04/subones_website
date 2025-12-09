import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "@/components/editor/Left/Specimen"
import Taxonomy from "@/components/editor/Left/Taxonomy"
import Locality from "@/components/editor/Left/Locality"
import { useSkeletonEditorContext } from "./context"
import {useState} from 'react'
import { Input } from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SaveButton from "@/components/editor/Left/SaveButton"
import ExitButton from "@/components/editor/Left/ExitButton"

function Left() {
    const [loading, setLoading] = useState(false);
    const { handleSave, localityContext, formContext, skeletonContext, userData} = useSkeletonEditorContext();
    
    const router = useRouter();
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return(
        <div className = "flex-col h-screen overflow-y-scroll">

            <ExitButton setLoading={setLoading} router={router}/>

            <div className="flex flex-col items-center justify-between h-[50px] w-[90%]">
                <p>Individual: </p>
                <Input
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    value={skeletonContext.skeleton_name}
                    onChange={(e) => skeletonContext.update({skeleton_name : e.target.value})}
                />
            </div>

            <div className="flex flex-col items-center w-[90%] h-[300px]">
                <Specimen formContext={formContext} userData={userData}/>
            </div>
            
            

            <div className="flex-col justify-center items-center max-w-md p-4">

                <Taxonomy/>
                <Locality localityContext={localityContext} formContext={formContext}/>

            </div>

            <SaveButton handleSave={handleSave}/>
        </div>
    );
} 



export default Left