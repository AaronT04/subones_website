"use client"
import Left from "./Left"
import Right from "./Right"
import ResponsiveLayout from "@/components/editor/responsiveLayout"
import { Suspense } from "react"
import {SkullContextProvider} from "./context/SkullContext"
import { EditSkeletonAPIProvider } from "../skeleton-editor/EditSkeletonAPIContext"

function Left2() {
    return (
        <div>
            <Left />
        </div>
    )
}

function Right2() {
    return (
        <div>
            <Right />
        </div>
    )
}

function HomeContent() {
    return <ResponsiveLayout Left={Left2} Right={Right2} />
}

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
                <SkullContextProvider>
                    <HomeContent />
                </SkullContextProvider>
        </Suspense>
    )
}