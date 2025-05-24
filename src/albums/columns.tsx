"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Album } from "@/types/album"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Album>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "totalStickers",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Quantidade de figurinhas
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
]
