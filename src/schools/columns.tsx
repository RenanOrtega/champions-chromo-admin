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
    }
]
