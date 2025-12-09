import { Button } from "@/components/ui/button"
import {useRouter} from 'next/navigation'
import "@/app/globals.css"
import Specimen from "../../components/editor/Specimen"
import Taxonomy from "../../components/editor/Taxonomy"
import Locality from "../../components/editor/Locality"
import { useDentalEditorContext } from "./DentalEditorContext"
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

function Left() {
    const [loading, setLoading] = useState(false);
    const { handleSave, localityContext, formContext, userData} = useDentalEditorContext();
    
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

            <div className="flex flex-col items-center w-[90%] h-[350px]">
                <Specimen formContext={formContext} userData={userData}/>
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
                        <Locality localityContext={localityContext} formContext={formContext}/>
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
                >
                    Save
                </Button>
            </div>
        </div>
    );
} 



export default Left