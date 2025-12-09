import { Button } from "@/components/ui/button"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ExitButtonProps {
    setLoading? : React.Dispatch<React.SetStateAction<boolean>>
    router: AppRouterInstance
}

export default function ExitButton(props : ExitButtonProps) {
    return(
    <div className = "flex py-10 justify-center items-center whitespace-nowrap">
                <Button 
                    variant="outline" 
                    className="lg:w-1/2 rounded-2xl bg-maroon text-white border-maroon hover:bg-maroon/90 hover:text-white"
                    onClick={() => {
                        if(props.setLoading) props.setLoading(true);
                        props.router.push("/dashboard")}}>
                    Exit
                    
                </Button>
            </div>
    )
}