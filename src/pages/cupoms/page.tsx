"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import type { ColumnDef } from "@tanstack/react-table";
import type { Cupom, CupomUpdateInput } from "@/types/cupom";
import { deleteCupom, getCupoms, updateCupom } from "@/services/cupom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { startTransition } from "react";

export default function CupomsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['cupoms'],
        queryFn: getCupoms,
    });

    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCupom(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cupoms"] })
        }
    })

    const updateCouponMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: CupomUpdateInput }) => updateCupom(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cupoms'] });
            toast.success("Cupom atualizado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao atualizar o cupom");
        }
    });

    const columnsWithActions: ColumnDef<Cupom>[] = [
        ...columns,
        {
            accessorKey: "isActive",
            size: 40,
            header: () => {
                return (
                    <div>Status</div>
                )
            },
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean
                const cupomId = row.original.id
                
                const handleStatusChange = (checked: boolean) => {
                    startTransition(() => {
                        updateCouponMutation.mutate({
                            id: cupomId,
                            data: { ...row.original, isActive: checked }
                        });
                    });
                }
        
                const isThisRowUpdating = updateCouponMutation.isPending && 
                    updateCouponMutation.variables?.id === cupomId;
        
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 cursor-pointer"
                            checked={isActive}
                            onCheckedChange={handleStatusChange}
                            disabled={isThisRowUpdating}
                        />
                        {isThisRowUpdating && (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        )}
                    </div>
                )
            },
        },
        {
            id: "actions",
            size: 120,
            header: () => {
                return (
                    <div className="flex justify-center">
                        Ações
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Você tem certeza?</DialogTitle>
                                <DialogDescription>
                                    <div className="flex flex-col">
                                        Essa ação não pode ser desfeita. Tem certeza que deseja apagar permanentemente esse dado?
                                    </div>
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="submit"
                                    disabled={deleteMutation.isPending}
                                    onClick={() => deleteMutation.mutate(row.original.id)}
                                >
                                    Sim
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        }
    ]

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Carregando cupoms...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg text-red-500">Erro ao carregar cupom</div>
                </div>
            </div>
        );
    }

    return (
        <DataTable columns={columnsWithActions} data={data || []} />
    );
} 