import { Button } from "@/components/ui/button"
import "@/app/globals.css"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type {IForm} from "@/lib/api/componentTypes"
import type {DecodedToken} from "@/lib/api/dataTypes"

interface SpecimenProps {
    formContext: IForm
    userData: DecodedToken | undefined
}

function Specimen(props : SpecimenProps) {
    const formContext = props.formContext;
    const userData = props.userData;
    
    const handleChange = (field: string, value: string) => {
        formContext.update(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className = "flex flex-col ml-5 space-y-5 m-auto">
            
            <div className="flex items-center justify-between space-x-2">
                <p>Specimen #: </p>
                <Input 
                    className="h-[40px] w-2/3 max-w-sm bg-white"
                    type="number"
                    value={formContext.specimenNumber}
                    onChange={(e) => handleChange('specimenNumber', e.target.value)}
                    placeholder="Enter specimen number"
                />
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Museum: </p>
                <Select 
                    value={formContext.museumId} 
                    onValueChange={(value) => handleChange('museumId', value)}
                >
                    <SelectTrigger className="h-[40px] w-2/3 max-w-sm bg-white">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">SUB</SelectItem>
                        {/* Add more museums here as needed */}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>Sex: </p>
                <Select 
                    value={formContext.sex} 
                    onValueChange={(value) => handleChange('sex', value)}
                >
                    <SelectTrigger className="h-[40px] w-2/3 max-w-sm bg-white">
                        <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <p>User: </p>
                <p className="h-[40px] w-2/3 max-w-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                {userData?.name}
                </p>
            </div>
        </div>
    )   
} 

export default Specimen