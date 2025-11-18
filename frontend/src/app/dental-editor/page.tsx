"use client"

import Left from "./Left"
import Right from "./Right"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditDentalAPIProvider } from "./EditDentalAPIContext"
import ResponsiveLayout from "@/components/editor/responsiveLayout"

function Left2(){
    return(
        <div>
            <Left/>
        </div>
    )
}

function Right2(){
    return(
        <div>
            <Right/>
        </div>
    )
}

export default function Home(){

    const router = useRouter();


    return (
        <EditDentalAPIProvider>
            <ResponsiveLayout Left={Left2} Right={Right2}/>
        </EditDentalAPIProvider>
     )
}
