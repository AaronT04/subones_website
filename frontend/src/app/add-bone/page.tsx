"use client"

import { BoneMenu } from "./add_bone" 
import Header from "@/components/header"

import { useRouter } from 'next/navigation'
import { useState } from "react"

import {
    Button
} from "@/components/ui/button"


export default function Home(){


    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return(
    <div>
        <div className="flex justify-between items-start p-5">
          <Button 
            variant="outline" 
            className="rounded-2xl bg-maroon text-white border-maroon hover:bg-maroon/90 hover:text-white w-24"
            onClick={() => {setLoading(true); router.push("/dashboard")}}>
            Exit
          </Button>
        </div>
        <div className="add-bone-container">
            <BoneMenu></BoneMenu>
        </div>
    </div>
    )
}

