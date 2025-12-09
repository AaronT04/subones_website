import { Suspense } from "react";
import { useBoneEditorContext } from "./context";
import { boneCategories } from "@/components/lists/handsfeet"
import SmallTaphonomy from "@/components/editor/SmallTaphonomy";
import Measurements from "@/components/editor/Measurements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function InnerRight() {
    const {boneContext, taphonomyContext, measurementsContext} = useBoneEditorContext();
    const boneName = boneContext.data.boneName;
    const isHandsAndFeetBone = () => {
        if (!boneName || boneName === "Talus" || boneName === "Calcaneus") {
            return false;
        }
        
        return boneCategories.some(category => 
            category.items.includes(boneName)
        );
    };
     return(
        <div className = "flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
            <div className="w-full flex h-[10%] px-20"><h1>{boneName}</h1></div>
            <div className="flex justify-center px-4">
                {isHandsAndFeetBone() ? (
                    // Hands and feet bones (except Talus/Calcaneus): only Taphonomy, no tabs
                    <div className="bone-container w-full">
                        <SmallTaphonomy boneName={boneName} taphonomyContext={taphonomyContext}/>
                    </div>
                ) : (

                    // Other bones (including Talus/Calcaneus): render with tabs structure
                    <Tabs 
                        defaultValue="measurements" 
                        className="relative w-[800px]"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="measurements">Measurements</TabsTrigger>
                            <TabsTrigger value="taphonomy">Taphonomy</TabsTrigger>
                        </TabsList>
                        <TabsContent value="measurements">
                            <div className="bone-container">
                                <Measurements boneName={boneName} measurementsContext={measurementsContext} />
                            </div>
                        </TabsContent>
                        <TabsContent value="taphonomy">
                            <div className="bone-container">
                                <SmallTaphonomy boneName={boneName} taphonomyContext={taphonomyContext}/>
                            </div>
                        </TabsContent>
                    </Tabs>
                )
                }
            </div>
        </div>
     );
}

function Right() {
  return (
    <div className="flex flex-col h-screen col-span-2 lg:col-span-4 space-y-4 bg-gray-100/10">
      <Suspense fallback={<div>Loading search params...</div>}>
        <InnerRight />
      </Suspense>
    </div>
  );
}

export default Right