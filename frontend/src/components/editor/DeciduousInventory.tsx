"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DentalTable from "./DentalTable";
import ToothDisplay from "./ToothDisplay";
import {dental_help_text} from "@/components/lists/DentalHelp";
import {useState} from 'react'
import { Button } from "@/components/ui/button";
import {morphology_list} from "@/components/lists/morphology_list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import type {ISkull, IDental} from "@/lib/api/componentTypes"

interface DeciduousInventoryProps {
    skullContext? : ISkull
    dentalContext : IDental
}
export default function DeciduousInventory(props : DeciduousInventoryProps) {
  const [displayMode, setDisplayMode] = useState("Inventory");
  const [trait, selectTrait] = useState("Shoveling");
  const dentalContext = props.dentalContext;

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

  const displayModeNames = ["Inventory", "Metrics", "Wear", "Development"]

  const commonTraits = Object.keys(morphology_list.options).slice(0, 6);
  const maxillaryTraits = Object.keys(morphology_list.options).slice(6, 21);
  const mandibularTraits = Object.keys(morphology_list.options).slice(21, 33);

  return (
    <div className="bone-container h-[700px] flex flex-col overflow-hidden">
          <div className="grid w-full grid-cols-[3fr_4fr_3fr] h-full">
            <div className="ml-[5%] h-full flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto border border-black rounded-md">
                    <DentalTable dentition="dec" skullContext={props.skullContext} dentalContext={dentalContext} />
                </div>
            </div>

            <div>
                
                <Tabs  className="flex items-center" value={displayMode} onValueChange={setDisplayMode}>
                    <TabsList>
                        {displayModeNames.map((mode, i) => <TabsTrigger value={mode}>{mode}</TabsTrigger>)}
                    </TabsList>
                </Tabs>
                <ToothDisplay dentition="dec" displayMode={displayMode} trait={trait}
                skullContext={props.skullContext} dentalContext={dentalContext} />
            </div>
            <div className="w-[350px] h-full min-h-0 overflow-y-auto">
                <div className="h-full overflow-y-auto">
                    {getDentalHelpTable()}
                </div>
            </div>

          </div>

    </div>
  );
}
