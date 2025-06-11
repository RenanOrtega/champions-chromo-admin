"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { School } from "@/types/school"

export const columns: ColumnDef<School>[] = [
    {
        accessorKey: "name",
        header: "Nome",
    },
    {
        accessorKey: "city",
        header: "Cidade",
    },
    {
        accessorKey: "state",
        header: "Estado",
    },
    {
        accessorKey: "shippingCost",
        header: () => {
            return (
                <div className="flex justify-center">
                    Frete
                </div>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex justify-center">
                    R$ {row.getValue("shippingCost") ?? 0}
                </div>
            )
        },
    }
]
