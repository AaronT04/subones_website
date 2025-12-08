import { ConfirmOptions } from '@/components/confirm-dialog-context'
const textStyle = "text-sm mx-[10px]"
const labelStyle = "flex my-[10px] text-black justify-center"

const stageMap : Record<number, string> = {
    0 : "Bone surface shows no sign of cracking or flaking due to weathering.",
    1 : `Outermost concentric thin layers of bone show flaking, usually associated with cracks, in that the bone edges along the cracks tend to separate and flake first.  Long thin 
flakes, with one or more sides still attached to the bone, are common in the initial part of 
Stage 2.  Deeper and more extensive flaking follows, until most of the outermost bone is gone. 
 Crack edges are usually angular in cross-section.`,
 2 : `Outermost concentric thin layers of bone show flaking, usually associated with 
cracks, in that the bone edges along the cracks tend to separate and flake first.  Long thin 
flakes, with one or more sides still attached to the bone, are common in the initial part of 
Stage 2.  Deeper and more extensive flaking follows, until most of the outermost bone is gone. 
 Crack edges are usually angular in cross-section.`,
 3 : `Bone surface is characterized by patches of rough, homogeneously weathered 
compact bone, resulting in a fibrous texture.  In these patches, all the external, concentrically 
layered bone has been removed.  Gradually the patches extend to cover the entire bone 
surface.  Weathering does not penetrate deeper than 1.0-1.5 mm at this stage, and bone fibers 
are still firmly attached to each other.  Crack edges usually are rounded in cross-section.`,
4 : `The bone surfaces is coarsely fibrous and rough in texture: large and small splinters 
occur and may be loose enough to fall away from the bone if it is moved.  Weathering 
penetrates into inner cavities.  Cracks are open and have splintered or rounded edges.
`,
5 :  `Bone is falling apart, with large splinters.  Bone easily broken by moving.  Original 
bone shape may be difficult to determine.  Cancellous bone usually exposed, when present, 
and may outlast all traces of the former more compact, outer parts of the bones.`
}

function BoneConditionInfo() {
    return(<div className="grid grid-cols-2">
        {Object.keys(stageMap).map((i) => 
        <div className="m-[10px]"><label className={labelStyle}>{`Stage ${i}`}</label><p className={textStyle}>{stageMap[i]}</p></div>)}
    </div>)
}

export async function showBoneConditionInfo(confirm : (options : ConfirmOptions) => Promise<boolean>) {
    const confirmed = await confirm({
        title:"Codes",
        description: <BoneConditionInfo/>,
        confirmText:"OK",
        styleOverride : {
            contentStyle: "fixed top-1/2 left-1/2 -translate-x-1/2 w-[80%] h-[90%] -translate-y-1/2 bg-white text-center p-6 rounded-lg shadow-lg z-50 focus:outline-none",
        }
        })
        return;
}