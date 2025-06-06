"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Package, Eye } from "lucide-react";
import { getOrdersSummary } from "@/services/order";
import { columns } from "./columns";
import type { OrderSummary } from "@/types/order";
import { useNavigate } from "react-router";

export default function OrderSummaryPage() {
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ['ordersSummary'],
        queryFn: getOrdersSummary,
    });

    const queryClient = useQueryClient()

    const goDetails = (id: string) => {
        navigate(`${id}`)
    }

    // Criar colunas com as ações
    const columnsWithActions: ColumnDef<OrderSummary>[] = [
        ...columns,
        {
            id: "actions",
            size: 100,
            header: () => (
                <div className="flex justify-center">
                    Figurinhas
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Button variant="outline" size="sm" onClick={() => goDetails(row.original.id)}>
                        <Eye className="h-4 w-4 text-green-500" /> Ver Detalhes
                    </Button>
                </div>
            )
        },
        {
            accessorKey: "priceTotal",
            size: 100,
            header: "Valor",
            cell: ({ row }) => (
                <div>
                    R$ {row.original.priceTotal}
                </div>
            )
        }
    ]

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <Package className="h-12 w-12 text-gray-400 animate-pulse" />
                    <div className="text-lg text-gray-600">Carregando pedidos...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="text-lg text-red-600">Erro ao carregar pedidos</div>
                    <Button
                        variant="outline"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['ordersSummary'] })}
                    >
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Pedidos</h1>
                <p className="text-gray-600 mt-1">
                    {data?.length || 0} pedido{(data?.length || 0) !== 1 ? 's' : ''} encontrado{(data?.length || 0) !== 1 ? 's' : ''}
                </p>
            </div>

            <DataTable columns={columnsWithActions} data={data || []} />
        </div>
    );
}