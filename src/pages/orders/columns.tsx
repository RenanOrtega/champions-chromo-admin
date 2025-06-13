"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { OrderSummary } from "@/types/order"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<OrderSummary>[] = [
    {
        accessorKey: "id",
        header: "ID do Pedido",
        size: 100,
        cell: ({ row }) => (
            <div className="font-mono text-sm">
                {row.original.id}
            </div>
        )
    }, 
    {
        accessorKey: "order",
        header: () => {
            return (
                <div className="flex justify-center">
                    Nome do Cliente
                </div>
            )
        },
        size: 100,
        cell: ({ row }) => (
            <div className="font-mono text-sm flex justify-center">
                {row.original.customer.name == "" ? "N/A" : row.original.customer.name}
            </div>
        )
    },
    {
        accessorKey: "totalAlbums",
        header: () => {
            return (
                <div className="flex justify-center">
                    Qtd. Álbuns
                </div>
            )
        },
        size: 50,
        cell: ({ row }) => (
            <div className="text-center">
                <Badge variant="secondary">
                    {row.original.totalAlbums}
                </Badge>
            </div>
        )
    },
    {
        accessorKey: "totalStickers",
        header: () => {
            return (
                <div className="flex justify-center">
                    Total Figurinhas
                </div>
            )
        },
        size: 50,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <Badge variant="outline">
                        {row.original.totalStickers}
                    </Badge>
                </div>
            );
        }
    }
]