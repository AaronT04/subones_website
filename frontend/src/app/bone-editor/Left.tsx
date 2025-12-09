"use client"

import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "@/components/editor/Specimen"
import Taxonomy from "@/components/editor/Taxonomy"
import Locality from "@/components/editor/Locality"
import { useBoneEditorContext } from "./context"
import {useState} from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

function Left() {
    const [loading, setLoading] = useState(false);
    const { userData, formContext, localityContext, handleSave } = useBoneEditorContext();
    
    const router = useRouter();
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return(
        <div className = "flex-col h-screen overflow-y-scroll">

            <div className = "flex py-10 justify-center items-center whitespace-nowrap">
                <Button 
                    variant="outline" 
                    className="lg:w-1/2 rounded-2xl bg-maroon text-white border-maroon hover:bg-maroon/90 hover:text-white"
                    onClick={() => {setLoading(true); router.push("/dashboard")}}>
                    Exit
                    
                </Button>
            </div>

            <div className="w-[90%] py-20">
                <Specimen userData={userData} formContext={formContext}/>
            </div>
            

            <div className="flex-col w-full justify-center items-center max-w-md p-4">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                        >
                            Taxonomy
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Taxonomy Information</DialogTitle>
                        </DialogHeader>
                        <Taxonomy/>
                    </DialogContent>
                </Dialog>

                
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                        >
                            Locality
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Locality Information</DialogTitle>
                        </DialogHeader>
                        <Locality formContext={formContext} localityContext={localityContext}/>
                    </DialogContent>
                </Dialog>

            </div>

            <div className = "flex w-full max-w-md mx-auto p-4">
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-maroon hover:bg-maroon/90 text-white hover:text-white 
                    h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                    onClick={() => {
                        if (handleSave) {
                            handleSave();
                        } else {
                            console.error('handleSave is undefined!');
                        }
                    }}
                >Save
                </Button>
            </div>
        </div>
    );
} 

export default Left