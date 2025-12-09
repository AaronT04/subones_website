
import { Button } from "@/components/ui/button"
import "@/app/globals.css"
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

function Taxonomy(){
return (
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
            <div className = "flex flex-col ml-5 space-y-5 m-auto">

                <div className="flex items-center justify-between space-x-2">
                    <p>Parvorder: </p>
                    <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <p>Superfamily: </p>
                    <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <p>Family: </p>
                    <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <p>Subfamily: </p>
                    <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
                </div>

                <div className="flex items-center justify-between space-x-2">
                    <p>Genus: </p>
                    <Input className="h-[40px] w-2/3 max-w-sm bg-white"></Input>
                </div>
            </div>
        </DialogContent>
    </Dialog>

)
} export default Taxonomy