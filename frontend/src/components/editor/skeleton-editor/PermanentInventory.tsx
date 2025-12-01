"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DentalTable from "./DentalTable";
import ToothDisplay from "./ToothDisplay";
import {dental_help_text} from "./DentalHelp";
import {useState} from 'react'
import { Button } from "@/components/ui/button";
import {morphology_list} from "./morphology_list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import MorphologyHelp from "./morphology_help";

export default function PermanentInventory() {
  const [displayMode, setDisplayMode] = useState("Inventory");
  const [trait, selectTrait] = useState("Shoveling");

  const getTrait = () => {return trait;}

  const getDentalHelpTable = () => {
     switch(displayMode) {
        case "Inventory":
            return dental_help_text.inventory;
        case "Development":
            return dental_help_text.development;
        default:
            return <></>
     }
  }

  const getMorphologyHelpTable = () => {
    return <MorphologyHelp trait={trait}/>
  }

  const displayModeNames = ["Inventory", "Metrics", "Wear", "Development"]

  const commonTraits = Object.keys(morphology_list.options).slice(0, 6);
  const maxillaryTraits = Object.keys(morphology_list.options).slice(6, 21);
  const mandibularTraits = Object.keys(morphology_list.options).slice(21, 33);

  return (
    <div className="bone-container h-[650px] flex flex-col">
      {/* Tabs should fill the container */}
      <Tabs className="flex-1 flex flex-col overflow-hidden">
        {/* Header row (TabsList) sits on top, takes natural height */}
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="Inventory">Inventory</TabsTrigger>
            <TabsTrigger value="Morphology">Morphology</TabsTrigger>
          </TabsList>
        </div>

        {/* Content area should take the rest and be clipped */}
        <TabsContent
          value="Inventory"
          className="flex-1 overflow-hidden"
        >
          <div className="grid w-full grid-cols-[3fr_4fr_3fr] h-full">
            {/* Scroll only inside this column */}
            <div className="ml-[5%] h-full flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto border border-black rounded-md">
                    <DentalTable dentition="perm" />
                </div>
            </div>

            <div>
                
                <Tabs  className="flex items-center" value={displayMode} onValueChange={setDisplayMode}>
                    <TabsList>
                        {displayModeNames.map((mode, i) => <TabsTrigger value={mode}>{mode}</TabsTrigger>)}
                    </TabsList>
                </Tabs>
                <ToothDisplay key={trait} dentition="perm" displayMode={displayMode} trait={trait}/>
            </div>
            <div className="w-[350px] h-full min-h-0 overflow-y-auto">
                <div className="h-full overflow-y-auto">
                    {getDentalHelpTable()}
                </div>
            </div>

          </div>
        </TabsContent>
        <TabsContent
        value="Morphology"
        className="flex-1 overflow-hidden"
        >
            <div className="grid w-full grid-cols-[3fr_4fr_3fr] h-full ">
            {/* Scroll only inside this column */}
                <div className="flex flex-col overflow-y-scroll h-full border border-black flex-1 min-h-0">
                    <p className="font-bold text-center text-lg font-sans w-full border border-black text-black">Morphology</p>
                    <div className="text-[15px] ml-[5px]">
                        {commonTraits.map((t, i) => 
                            <HorizontalRadioButton key={i} name={t} onChange={() => selectTrait(t)}/>)}
                    </div>
                    <p className="font-bold text-lg text-center inline-block border-t-2 border-black">Maxillary</p>
                    <div className="text-[15px] ml-[5px]">
                        {maxillaryTraits.map((t, i) => 
                            <HorizontalRadioButton key={i} name={t} onChange={() => selectTrait(t)}/>)}
                    </div>
                    <p className="font-bold text-lg text-center inline-block border-t-2 border-black">Mandibular</p>
                    <div className="text-[15px] ml-[5px]">
                        {mandibularTraits.map((t, i) => 
                            <HorizontalRadioButton key={i} name={t} onChange={() => selectTrait(t)}/>)}
                    </div>
                </div>

            <div>
                
            <ToothDisplay key={"morph - " + trait} dentition="perm" displayMode={"Morphology"} trait={trait}/>

            </div>
            <div className="w-[350px] h-full min-h-0 overflow-y-auto">
                <div className="h-full overflow-y-auto">
                    {getMorphologyHelpTable()}
                </div>
            </div>

          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
