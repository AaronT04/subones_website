import { postcranialmetrics_list } from "@/components/lists/postcranialmetrics"
import MeasurementsBox from "@/components/ui/measurements_box"
import { Vertebrae } from "./Vertebrae"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IMeasurements } from "@/lib/api/componentTypes";

interface MeasurementsProps {
    measurementsContext: IMeasurements
    boneName : string
}
function Measurements(props: MeasurementsProps) {

    const update = props.measurementsContext.update;
    const measurements = props.measurementsContext.data;
    const boneName = props.boneName;

    // Handle measurement changes
    const handleMeasurementChange = (name: string, value: string) => {
        update(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const normalizeBone = (boneName: string | null) => {
        return boneName?.toLowerCase().replace(/\s+/g, '_') || '';
    };

    const renderContent = () => {
        // Check if it's a vertebrae type
        if (normalizeBone(boneName) === "cervical_vertebrae") {
            return <div><Vertebrae selectedList={normalizeBone(boneName)}></Vertebrae></div>;
        } else if (boneName === "thoracic_vertebrae") {
            return <div><Vertebrae selectedList={normalizeBone(boneName)}></Vertebrae></div>;
        } else if (boneName === "lumbar_vertebrae") {
            return <div><Vertebrae selectedList={normalizeBone(boneName)}></Vertebrae></div>;
        }
        // Otherwise render appendicular bones
        else {
            return postcranialmetrics_list[normalizeBone(boneName)]?.map((name, i) => (
                <MeasurementsBox 
                    name={name} 
                    key={i}
                    value={measurements[name] || ''}
                    onChange={(e) => handleMeasurementChange(name, e.target.value)}
                />
            ));
        }
    };

    return(
        <div>
            <section>
                {renderContent()}
            </section>
        </div>
    )
} 

export default Measurements