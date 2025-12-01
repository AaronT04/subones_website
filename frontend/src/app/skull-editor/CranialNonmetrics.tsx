
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import React from 'react'
import {produce} from 'immer'

import {Table, Select} from '@radix-ui/themes'

import { cranial_nonmetrics_list } from "@/components/editor/skeleton-editor/cranial-nonmetrics-list"
import type { CranialNonmetricRow } from "@/components/editor/skeleton-editor/cranial-nonmetrics-list"
import Macromorphoscopics from "./Macromorphoscopics"
import type { ICranialNonmetrics, ISkull } from "@/lib/api/componentTypes"

interface CranialNonmetricsProps{
    cranialNonmetricsContext: ICranialNonmetrics
    skullContext : ISkull
}


function CranialNonmetrics(props : CranialNonmetricsProps) {
    const update = props.cranialNonmetricsContext.update;
    const allNonmetrics = props.cranialNonmetricsContext.allNonmetrics;
    const hasCranium = props.skullContext ? props.skullContext.hasCranium : true;
    const hasMandible = props.skullContext ? props.skullContext.hasMandible : true;

    
    const tabCondition = (tab : string) => {
        return (hasCranium && ["facial", "lateral", "basilar", "macromorphoscopics"].includes(tab)) || 
                (hasMandible && tab === "mandibular")
    }

    function renderTable(tab_str : string) {
        const info: CranialNonmetricRow[] = cranial_nonmetrics_list[tab_str];
        return (
            <Table.Root>
            <Table.Body>
            {info.map((row, i) => (
                <Table.Row key={i}>
                    <Table.RowHeaderCell>{row[0]}</Table.RowHeaderCell>
                    <Table.Cell className="w-200">
                        <Select.Root
                        value={allNonmetrics[row[0]]?.value_str}
                        onValueChange={(value) => {update(prev =>
                            produce(prev, draft => {
                                draft[row[0]] = {
                                    category: tab_str,
                                    nonmetric_name: row[0],
                                    value_str: value
                                };
                            }))}}>
                            <Select.Trigger/>
                            <Select.Content>
                                {Array.isArray(row[1]) ? (
                                    row[1].map((option, j) =>
                                        <Select.Item key={j} value={option}>{option}</Select.Item>
                                    )
                                ) : (
                                    <Select.Item value={row[1]}>{row[1]}</Select.Item>
                                )}
                            </Select.Content>
                        </Select.Root>
                    </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table.Root>
        )
    }
    const tab_values = ["facial", "lateral", "basilar", "mandibular", "macromorphoscopics"];

    return(<div className = "bone-container">
                <h3 className = "text-center">Cranial Nonmetrics</h3>
                    <Tabs defaultValue = "facial">
                        <TabsList>
                            {tab_values.map((tab, i) => tabCondition(tab) &&
                            <TabsTrigger value={tab}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</TabsTrigger>)}
                            
                        </TabsList>
                        {tab_values.map((tab, i) => tab != "macromorphoscopics" &&
                        tabCondition(tab) &&
                            <TabsContent value={tab}>
                                {renderTable(tab)}
                            </TabsContent>
                        )}
                        {tabCondition("macromorphoscopics") &&
                        <TabsContent value="macromorphoscopics">
                            <Macromorphoscopics
                            cranialNonmetricsContext={props.cranialNonmetricsContext}/>
                        </TabsContent>
                        }
                    </Tabs>
            </div>)
}

export default CranialNonmetrics