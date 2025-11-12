import TCheckbox from "@/components/ui/TCheckbox";
import React, {useState, useContext} from 'react';
import {taphonomy_options} from "@/components/editor/taphonomy-options-list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trimTagsFromBoneName } from "./postcranial-inventory-list";
import { useEditSkeletonAPI } from "@/app/skeleton-editor/EditSkeletonAPIContext";
import type {Taphonomy, EditSkeletonAPI }from "@/app/skeleton-editor/skeleton-editor-types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useConfirmDialog } from '@/components/confirm-dialog-context';

function Taphonomy(props) {
    let [activeSubmenu, setActiveSubmenu] = useState("bone color");
    
    let [boneCond, setBoneCond] = useState("");
    //const boneName = trimTagsFromBoneName(props.boneName);
    const {api, updateField} = useEditSkeletonAPI();
    const getAPIInstance = () => {return api?.taphonomy.find((taph) => taph.bone_name === props.boneName)}
    const apiInstance = getAPIInstance();
    const [comment, setComment] = useState(apiInstance?.comments ?? "");
    
    let [surfChecked, setSurfChecked] = useState(apiInstance?.surface_exposure ?? false);
    
    const confirm = useConfirmDialog();
    const showBoneConditionInfo = async() => {
        const confirmed = await confirm({
        title:"",
        description:"bone condition info...",
        confirmText:"OK"
        })
        return;
    }

    const getContents = () => {
        if(activeSubmenu == "bone color") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.bone_color.map((color, i) => <HorizontalRadioButton name={color} key={i} onChange={() => 
                updateField("taphonomy", {
                    bone_name: props.boneName,
                    bone_color: color
                }, "bone_name")}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "staining") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.staining.map((name, i) => <TCheckbox name={name} key={i} 
                    checked={getAPIInstance()?.staining.includes(name)}
                    onChange={() => updateField("taphonomy", {bone_name: props.boneName, staining: name}, "bone_name")}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "surface damage") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.surface_damage.map((name, i) => <TCheckbox name={name} key={i} onChange={() => updateField("taphonomy", {
                    bone_name: props.boneName,
                    surface_damage: name
                }, "bone_name")}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "adherent materials") {
            return (<div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.adherent_materials.map((name, i) => <TCheckbox name={name} key={i} onChange={() => updateField("taphonomy", {
                    bone_name: props.boneName,
                    adherent_materials: name
                }, "bone_name")}/>)}
                </div>
            </div>)
        }
        if(activeSubmenu == "modifications") {
            return (<div>
                <div className="flex flex-col justify-center gap-10">
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal">Curation Modifications</h3>
                        {taphonomy_options.curation_modifications.map((name, i) => <TCheckbox name={name} key={i} onChange={() => updateField("taphonomy", {
                    bone_name: props.boneName,
                    modifications: name
                }, "bone_name")}/>)}
                    </div>
                    
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal" >Cultural Modifications</h3>
                        {taphonomy_options.cultural_modifications.map((name, i) => <TCheckbox name={name} key={i} onChange={() => updateField("taphonomy", {
                    bone_name: props.boneName,
                    modifications: name
                }, "bone_name")}/>)}
                    </div>
                </div>
            </div>)
        }
        if(activeSubmenu == "comments") {
            return (<div>
                <div className="flex flex-col">
                    <h3>Comments:</h3>
                    <textarea placeholder={getAPIInstance()?.comments ?? ""}className="p-1 h-40 border-1 border-gray-200 rounded-lg resize-none"
                    onChange={(e) => setComment(e.target.value)}/>
                    <Button className="w-34 ml-auto mt-4 bg-maroon hover:bg-maroon/90" onClick={() => {
                    updateField("taphonomy", {
                        bone_name: props.boneName,
                        comments: comment
                    }, "bone_name")
                    }}>
                    Save Comments</Button>
                </div>
            </div>)
        }
    }

        return(
            <div className="w-full">
                <h3>{props.boneName}</h3>

                <div className = "w-1/2 justify-left">
                    <div className="flex items-center">
                <label htmlFor="bone-cond">Bone Condition: </label>
                <Select value={getAPIInstance()?.bone_condition ?? ""} onValueChange={(value) => {setBoneCond(value); 
                updateField("taphonomy", {
                        bone_name: props.boneName,
                        bone_condition: value
                    }, "bone_name");

                }}>
                        <SelectTrigger className="h-[40px] w-[100px] max-w-sm bg-white ml-[20]">
                            <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">Stage 0</SelectItem>
                            <SelectItem value="1">Stage 1</SelectItem>
                            <SelectItem value="2">Stage 2</SelectItem>
                            <SelectItem value="3">Stage 3</SelectItem>
                            <SelectItem value="4">Stage 4</SelectItem>
                            <SelectItem value="5">Stage 5</SelectItem>
                        </SelectContent>
                </Select>
                <Button className="bg-maroon hover:bg-maroon/90 ml-[20]" onClick={showBoneConditionInfo}>?</Button>
            </div>
                    <div className="flex mt-4 gap-2">
                        <input type="checkbox" checked={surfChecked} onChange={ () => {
                            setSurfChecked(!surfChecked);
                            updateField("taphonomy", {
                                bone_name: props.boneName,
                                surface_exposure: !surfChecked
                            }, "bone_name")}}/>
                        <p className = "" >Surface Exposure </p>
                    </div>
                </div>
                <div>
                    <div className="flex flex-wrap w-full gap-2 justify-center">
                        <Button variant="outline" onClick={() => setActiveSubmenu("bone color")}>Bone Color</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("staining")}>Staining</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("surface damage")}>Surface Damage</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("adherent materials")}>Adherent Materials</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("modifications")}>Modifications</Button>
                        <Button variant="outline" onClick={() => setActiveSubmenu("comments")}>Comments</Button>
                    </div>

                </div>
                {getContents()}
            </div>
        );
    
}
export default Taphonomy