"use client";

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { tooth_layout } from "@/components/editor/skeleton-editor/tooth_layout";
import React from "react";
import type {ISkull, IDental} from "@/lib/api/componentTypes"
import {produce} from "immer"

const border = "border border-gray-400 rounded px-1";
const smallCell = "w-7 " + border;
const bigCell = "w-10 " + border;

const headerText = "text-black";

interface DentalTableProps {
    skullContext? : ISkull
    dentalContext : IDental
    dentition : "perm" | "dec"
}

export default function DentalTable(props : DentalTableProps) {
    const dentition = props.dentition;
    const inventory = props.dentalContext.inventory;

    const updateInventory = props.dentalContext.updateInventory;
    const layout = dentition === "perm" ? tooth_layout.perm : tooth_layout.dec;


    // Helper to read a tooth record
    const getToothRecord = (tooth_name: string) => {
        return inventory[tooth_name] || {};
    };

    // Generic per-field update handler
    const handleChange = (tooth_name: string, field: string, rawValue: string) => {
        const value = rawValue === "" ? null : Number(rawValue);
        updateInventory(prev => produce(prev, draft => {draft[tooth_name] = {...getToothRecord(tooth_name), [field]: value}}))
    };

    const renderRow = (toothName: string) => {
        const rec = getToothRecord(toothName);

        return (
            <TableRow key={toothName}>
            <TableCell className="text-gray-700 font-medium w-20">{toothName}</TableCell>

            {/* Inv */}
            <TableCell>
                <input
                className={smallCell}
                type="number"
                value={rec?.tooth_inv_code ?? ""}
                onChange={(e) => handleChange(toothName, "tooth_inv_code", e.target.value)}
                />
            </TableCell>

            {/* Dev */}
            <TableCell>
                <input
                className={smallCell}
                type="number"
                value={rec?.tooth_dev_code ?? ""}
                onChange={(e) => handleChange(toothName, "tooth_dev_code", e.target.value)}
                />
            </TableCell>

            {/* Wear */}
            <TableCell>
                <input
                className={smallCell}
                type="number"
                value={rec?.tooth_wear_code ?? ""}
                onChange={(e) => handleChange(toothName, "tooth_wear_code", e.target.value)}
                />
            </TableCell>

            {/* Width */}
            <TableCell>
                <input
                className={bigCell}
                type="number"
                value={rec?.tooth_width ?? ""}
                onChange={(e) => handleChange(toothName, "tooth_width", e.target.value)}
                />
            </TableCell>

            {/* Height */}
            <TableCell>
                <input
                className={bigCell}
                type="number"
                value={rec?.tooth_height ?? ""}
                onChange={(e) => handleChange(toothName, "tooth_height", e.target.value)}
                />
            </TableCell>
            </TableRow>
        );
    };

    return (
    <div className="w-full">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className={headerText}>Tooth</TableHead>
            <TableHead className={headerText}>Inv.</TableHead>
            <TableHead className={headerText}>Dev.</TableHead>
            <TableHead className={headerText}>Wear</TableHead>
            <TableHead className={headerText}>Width</TableHead>
            <TableHead className={headerText}>Height</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {Object.keys(layout).map((toothName) => (
            <React.Fragment key={toothName}>
                {renderRow("L" + toothName)}
                {renderRow("R" + toothName)}
            </React.Fragment>
            ))}
        </TableBody>
        </Table>
    </div>
    );
}
