"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Album } from "@/types/album"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Check, X } from "lucide-react"

export const columns: ColumnDef<Album>[] = [
    {
        accessorKey: "name",
        header: "Nome",
        size: 150,
    },
    {
        accessorKey: "hasCommon",
        size: 40,
        header: () => {
            return (
                <div className="flex justify-center">
                    Comum
                </div>
            )
        },
        cell: ({ row }) => {
            const hasCommon = row.getValue("hasCommon") as boolean
            return (
                <div className="flex justify-center ">
                    {hasCommon ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <X className="h-4 w-4 text-red-600" />
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "hasLegend",
        size: 40,
        header: () => {
            return (
                <div className="flex justify-center">
                    Legend
                </div>
            )
        },
        cell: ({ row }) => {
            const hasLegend = row.getValue("hasLegend") as boolean
            return (
                <div className="flex justify-center">
                    {hasLegend ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <X className="h-4 w-4 text-red-600" />
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "hasA4",
        size: 40,
        header: () => {
            return (
                <div className="flex justify-center">
                    A4
                </div>
            )
        },
        cell: ({ row }) => {
            const hasA4 = row.getValue("hasA4") as boolean
            return (
                <div className="flex justify-center">
                    {hasA4 ? (
                        <Check className="h-4 w-4 text-green-600" />
                    ) : (
                        <X className="h-4 w-4 text-red-600" />
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "totalStickers",
        size: 80,
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total Figurinhas
                        <ArrowUpDown className="ml-2 h-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    {row.getValue("totalStickers")}
                </div>
            )
        },
    },
]