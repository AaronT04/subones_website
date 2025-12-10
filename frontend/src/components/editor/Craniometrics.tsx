import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

import {Table, TextField} from '@radix-ui/themes'
import {craniometrics_list} from "@/components/lists/craniometrics-list"
import type { ICraniometrics, ISkull } from "@/lib/api/componentTypes"
import {produce} from 'immer'

interface CraniometricsProps {
    craniometricsContext : ICraniometrics
    skullContext? : ISkull
}

export default function Craniometrics(props : CraniometricsProps) {
    const hasCranium = props.skullContext ? props.skullContext.hasCranium : true;
    const hasMandible = props.skullContext ? props.skullContext.hasMandible : true;
    const craniumMetrics = props.craniometricsContext.craniumMetrics;
    const mandibleMetrics = props.craniometricsContext.mandibleMetrics;
    const updateCranium = props.craniometricsContext.updateCranium;
    const updateMandible = props.craniometricsContext.updateMandible;

    const displayName = (info) => info.split("\t")[0].trim(' ');
    function storageName(info: string): string {
        // Extract the part before the first tab — the descriptive label
        let name = info.split("\t")[0].trim();

        // Normalize: lowercase, remove special chars, replace spaces/dashes/slashes with underscores
        return name
            .toLowerCase()
            .replace(/[()/]/g, "")     // remove parentheses and slashes
            .replace(/[-\s]+/g, "_")   // replace spaces and dashes with underscores
            .replace(/[^a-z0-9_]/g, ""); // strip anything weird
    }
    
    return(
        <div className = "bone-container">
            <h3 className = "text-center">Craniometrics</h3>
            <Tabs defaultValue = "Cranium" className = "relative w-full">
                <TabsList className = "grid w-full grid-cols-2">
                    {hasCranium ? <TabsTrigger value="Cranium">Cranium</TabsTrigger> : null}
                    {hasMandible ? <TabsTrigger value="Mandible">Mandible</TabsTrigger> : null}
                </TabsList>
                {hasCranium ?
                <TabsContent value="Cranium">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Measurement</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Landmarks</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Abbv.</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Input</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {craniometrics_list.metrics_cranium.map((row_info, i) => 
                            <Table.Row key = {i}>
                                <Table.RowHeaderCell>{displayName(row_info)}</Table.RowHeaderCell>
                                <Table.Cell>{row_info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{row_info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number" 
                                    value={craniumMetrics[storageName(row_info)] || ''}
                                    onChange={(e) => updateCranium(prev =>
                                                        produce(prev, draft => {
                                                            draft[storageName(row_info)] = Number(e.target.value);
                                                        }))}/>
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Root>
                </TabsContent>
                : null}
                {hasMandible ?
                <TabsContent value="Mandible">
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Measurement</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Landmarks</Table.ColumnHeaderCell>
			                    <Table.ColumnHeaderCell>Abbv.</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Input</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {craniometrics_list.metrics_mandible.map((row_info, i) => 
                            <Table.Row key={i}>
                                <Table.RowHeaderCell>{displayName(row_info)}</Table.RowHeaderCell>
                                <Table.Cell>{row_info.split("\t")[1]}</Table.Cell>
                                <Table.Cell>{row_info.split("\t")[2]}</Table.Cell>
                                <Table.Cell>
                                    <TextField.Root type="number" 
                                    value={mandibleMetrics[storageName(row_info)] || ''}
                                    onChange={(e) => updateMandible(prev =>
                                                        produce(prev, draft => {
                                                            draft[storageName(row_info)] = Number(e.target.value);
                                                        }))}/>
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table.Root>
                </TabsContent>
                :null }
            </Tabs>
        </div>
    )
}