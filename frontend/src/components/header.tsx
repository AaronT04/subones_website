import "dotenv/config";
import {basePath} from "@/lib/basePath"

export default function Header(){ 
    console.log(process.env.ASSET_BASEPATH);
    return (   
        <div className="absolute top-0 left-0 flex items-start gap-4 border-b-2 w-full bg-gradient-to-r from-maroon to-maroon2">
            <img src={basePath('/sammy_logo.svg')} alt="Logo" width="50" height="20" className="ml-5 mt-1" />
            <h1 className="text-xl text-white font-medium ml-10">Salisbury University Bone Database</h1>
            {/*
            <div className="ml-[300] mt-[5]">
                <p className="text-white">Username: {decoded.name || "<none>"}</p>
                <p className="text-white">Email: {decoded.email || "<none>"} </p>
            </div>*/}
        </div>
    )
}