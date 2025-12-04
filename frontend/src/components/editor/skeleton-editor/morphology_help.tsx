import { morph_help } from "./morph_help_data"

export type MorphologyHelp = {
    title: string
    desc: string
    valid_codes: number[]
    codes_desc: string[]
}

export default function MorphologyHelp(props) {
    const data = morph_help.find((m) => m.title === props.trait);
    if (!data) 
        {
            console.log("Morphology help: no match for " + props.trait);
            return;
        }
    return(<>
    <p className="font-bold bg-[#e6e6e6] w-full border border-black text-black font-sans">{data.title}</p>
    <div className="font-sans bg-[#e6e6e6] w-full p-2.5 mb-2.5 border border-black text-black text-left">{data.desc}</div>
    <div className="font-sans bg-[#e6e6e6] w-full p-2.5 border border-black text-black text-left italic max-h-[380px] overflow-y-scroll">{data.codes_desc.map((codeText) => <>{codeText}<br/></>)}</div>
    </>)

}