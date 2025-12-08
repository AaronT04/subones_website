"use client"
import {mms_list} from "@/components/editor/skeleton-editor/mms-list"
import { ICranialNonmetrics, ISkull } from "@/lib/api/componentTypes"
import { RadioGroup, TextArea } from "@radix-ui/themes"
import {useState} from 'react'
import {produce} from 'immer'


interface MacromorphoscopicsProps {
    cranialNonmetricsContext : ICranialNonmetrics
}

const getImage = (trait, code) => {
    console.log("trait: " + trait + " code: " + code);
    //console.log(mms_list.dict[trait][2][code].src);
        if(trait != null && code != null) {
            return mms_list.dict[trait][2] != null && mms_list.dict[trait][2][code].src;
        }
    }

export default function Macromorphoscopics(props : MacromorphoscopicsProps) {

    const update = props.cranialNonmetricsContext.update;
    const allNonmetrics = props.cranialNonmetricsContext.allNonmetrics;

    let [trait, selectTrait] = useState("Anterior Nasal Spine");
    let [code, selectCode] = useState(0);


     const getRadioButtons = (trait) => {
        const codes = mms_list.dict[trait][1];
        console.log(codes);
        if(!codes) return null;

        const selected = allNonmetrics["macromorphoscopics"] ? (allNonmetrics["macromorphoscopics"])[trait] ?? "" : "";
        return(
            <div className="flex gap-6">
                {codes.map((number, i) => (
                    <div key={i} className="flex flex-col items-start gap-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`codeSelect-${trait}`}
                                value={number}
                                checked={selected === number}
                                onChange={() => {
                                    selectCode(i);
                                    update(prev =>
                                        produce(prev, draft =>{
                                            draft["macromorphoscopics"] = {
                                                ...prev["macromorphoscopics"] ?? {},
                                                [trait] : number
                                            }
                                        })
                                    )
                                    }
                                }
                            />
                            {number}
                        </label>
                    </div>
                ))}
            </div>
        )
    }

    
    return(<div className = "grid w-full grid-cols-[auto_auto] gap-0">
    
                <div className = "text-left flex flex-col">
                    <div className="w-full h-full">
                    <RadioGroup.Root
                        name="traitSelect"
                        onValueChange={(traitName) => {
                        const index = Object.keys(mms_list.dict).indexOf(traitName);
                        selectTrait(traitName);
                        selectCode(0);
                        }}
                    >
                        {Object.keys(mms_list.dict).map((traitName) => (
                        <RadioGroup.Item key={traitName} value={traitName}>
                            {traitName}
                        </RadioGroup.Item>
                        ))}
                    </RadioGroup.Root>
                    </div>
                    <div>
                        <TextArea readOnly className = "w-[250px] h-[250px]" value={mms_list.trait_desc[mms_list.dict[trait][0]]}/>
                    </div>
    
                </div>
                <div className = "text-left flex flex-col items-center">
                    <img className = "mt-[10px] min-w-[300px] max-w-[600px] min-h-[300px] max-h-[300px]" src={getImage(trait, code)}/>
                    <div className = "mt-[50px] mr-[50px] h-[50px] items-center justify-center">
                            {getRadioButtons(trait)}
                        </div>
                        <div className = "mt-[10px] w-[450px] h-[85px]">
                            <TextArea readOnly className="w-[500px] h-[200px]" value={mms_list.code_desc[mms_list.dict[trait][0]][code]}/>
                        </div>
                </div>
    
        </div>)
}