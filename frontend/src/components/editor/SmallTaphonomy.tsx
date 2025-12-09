import TCheckbox from "@/components/ui/TCheckbox";
import React, {useState, useContext} from 'react';
import {taphonomy_options} from "@/components/lists/taphonomy-options-list";
import HorizontalRadioButton from "@/components/ui/HorizontalRadioButton";
import { Button } from "@/components/ui/button"
import {produce} from "immer"
import type { IAllTaphonomy } from "@/lib/api/componentTypes";
import {defaultTaphonomy} from "@/lib/api/dataTypes"
import {useEffect} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useConfirmDialog } from '@/components/confirm-dialog-context';
import { showBoneConditionInfo } from "@/components/editor/boneConditionInfo";

interface SmallTaphonomyProps {
    taphonomyContext: IAllTaphonomy
    boneName: string
}

function SmallTaphonomy(props : SmallTaphonomyProps) {
    let [activeSubmenu, setActiveSubmenu] = useState("bone color");
    let [boneCond, setBoneCond] = useState("");
    const taphonomy = props.taphonomyContext.allTaphonomy[props.boneName] || defaultTaphonomy;
    const boneName = props.boneName;
    const update = props.taphonomyContext.update;
    const confirm = useConfirmDialog();

    const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
        console.log('handleCheckboxChange called:', { category, value, checked });
        console.log('Current taphonomy state:', taphonomy);
        
        const currentArray = taphonomy[category] || [];
        const newArray = checked 
            ? [...currentArray, value]
            : currentArray.filter((item: string) => item !== value);
        
        console.log('New array for', category, ':', newArray);
        
        const newTaphonomy = {
                ...taphonomy,
                [category]: newArray
        };
        
        console.log('Setting new measurements:', newTaphonomy);
        update(prev => produce(prev, draft => {draft[boneName] = newTaphonomy}));
    };

    const [comment, setComment] = useState(taphonomy?.comments ?? "");
    let [surfChecked, setSurfChecked] = useState(taphonomy?.surface_exposure ?? false);

    const getContents = () => {
        if(activeSubmenu == "bone color") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.bone_color.map((color, i) => <HorizontalRadioButton name={color} key={i} onChange={() => 
                update(prev =>
                    produce(prev, draft => {
                        draft[boneName] = {
                    ...taphonomy,
                    bone_color: color
                        }}))}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "staining") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.staining.map((name, i) => <TCheckbox name={name} key={i} 
                    checked={taphonomy?.staining.includes(name) ?? false}
                    onChange={(checked) => handleCheckboxChange('staining', name, checked)}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "surface damage") {
            return <div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.surface_damage.map((name, i) => <TCheckbox name={name} key={i}
                checked={taphonomy?.surface_damage.includes(name)}
                 onChange={(checked) => handleCheckboxChange('surface_damage', name, checked)}/>)}
                </div>
            </div>
        }
        if(activeSubmenu == "adherent materials") {
            return (<div>
                <div className="p-2.5 flex flex-col justify-start items-start">
                {taphonomy_options.adherent_materials.map((name, i) => <TCheckbox name={name} key={i} 
                checked={taphonomy?.adherent_materials.includes(name)}
                onChange={(checked) => handleCheckboxChange('adherent_materials', name, checked)}/>)}
                </div>
            </div>)
        }
        if(activeSubmenu == "modifications") {
            return (<div>
                <div className="flex flex-col justify-center gap-10">
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal">Curation Modifications</h3>
                        {taphonomy_options.curation_modifications.map((name, i) => <TCheckbox name={name} key={i} 
                        checked={taphonomy?.modifications.includes(name)}
                        onChange={(checked) => handleCheckboxChange('modifications', name, checked)}/>)}
                    </div>
                    
                    <div className="p-2.5 flex flex-col justify-start items-start">
                        <h3 className="break-words leading-normal" >Cultural Modifications</h3>
                        {taphonomy_options.cultural_modifications.map((name, i) => <TCheckbox name={name} key={i}
                        checked={taphonomy?.modifications.includes(name)}
                         onChange={(checked) => handleCheckboxChange('modifications', name, checked)}/>)}
                    </div>
                </div>
            </div>)
        }
        if(activeSubmenu == "comments") {
            return (<div>
                <div className="flex flex-col">
                    <h3>Comments:</h3>
                    <textarea placeholder={taphonomy?.comments ?? ""}className="p-1 h-40 border-1 border-gray-200 rounded-lg resize-none"
                    onChange={(e) => setComment(e.target.value)}/>
                    <Button className="w-34 ml-auto mt-4 bg-maroon hover:bg-maroon/90" onClick={() => {
                    update(prev =>
                        produce(prev, draft => {
                            draft[boneName] = {
                                ...taphonomy,
                                comments: comment
                    }}))}}>
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
                <Select value={String(taphonomy?.bone_condition ?? "")} onValueChange={(value) => {setBoneCond(value); 
                update(prev =>
                        produce(prev, draft => {
                            draft[boneName] = {
                                ...taphonomy,
                                bone_condition: Number(value)
                    }}));

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
                <Button className="bg-maroon hover:bg-maroon/90 ml-[20]" onClick={() => showBoneConditionInfo(confirm)}>?</Button>
            </div>
                    <div className="flex mt-4 gap-2">
                        <input type="checkbox" checked={surfChecked} onChange={ () => {
                            setSurfChecked(!surfChecked);
                            update(prev =>
                                produce(prev, draft => {
                                    draft[boneName] = {
                                        ...taphonomy,
                                        surface_exposure: !surfChecked
                                    }
                                }))}}/>
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
export default SmallTaphonomy