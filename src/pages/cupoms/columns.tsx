"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Cupom } from "@/types/cupom"
import { Badge } from "@/components/ui/badge"
    
export const columns: ColumnDef<Cupom>[] = [
    {
        accessorKey: "code",
        header: "Código",
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;

            const typeConfig = {
                "Percent": {
                    label: "Porcentagem",
                    variant: "default" as const,
                    className: "bg-blue-100 text-blue-800 hover:bg-blue-200"
                },
                "Fixed": {
                    label: "Fixo",
                    variant: "secondary" as const,
                    className: "bg-green-100 text-green-800 hover:bg-green-200"
                },
                "FreeShipping": {
                    label: "Frete Grátis",
                    variant: "outline" as const,
                    className: "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }
            };

            const config = typeConfig[type as keyof typeof typeConfig] || {
                label: type,
                variant: "default" as const,
                className: ""
            };

            return (
                <Badge
                    variant={config.variant}
                    className={config.className}
                >
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "value",
        header: "Valor",
    },
    {
        accessorKey: "usageLimit",
        header: "Limite de uso",
    },
    {
        accessorKey: "usedCount",
        header: "Quantidade de uso",
    },
    {
        accessorKey: "minPurchaseValue",
        header: "Valor mínimo de uso",
    },
]