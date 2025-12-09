import { Button } from "@/components/ui/button"
interface SaveButtonProps {
    handleSave: () => Promise<void>
}
export default function SaveButton(props: SaveButtonProps) {
    return(
    <div className = "flex w-full max-w-md mx-auto p-4">
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-maroon hover:bg-maroon/90 text-white hover:text-white 
                    h-16 w-full text-base sm:text-lg md:text-xl font-medium transition-all duration-200"
                    onClick={() => {
                        props.handleSave()
                    }}
                >Save
                </Button>
            </div>
    )
}