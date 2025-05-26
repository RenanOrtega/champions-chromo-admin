"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { deleteAlbum, getAlbums } from "@/services/album";
import type { ColumnDef } from "@tanstack/react-table";
import type { Album } from "@/types/album";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AlbumsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAlbum(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["albums"] })
        }
    })

    // Criar colunas com as ações
    const columnsWithActions: ColumnDef<Album>[] = [
        ...columns,
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
                <div className="flex items-center justify-center gap-2">
                    <Link to={row.original.id}>
                        <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                    </Link>

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
                                    Essa ação não pode ser desfeita. Tem certeza que deseja apagar permanentemente esse dado?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={deleteMutation.isPending}
                                    onClick={() => deleteMutation.mutate(row.original.id)}
                                    variant="destructive"
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
                    <div className="text-lg">Carregando álbuns...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg text-red-500">Erro ao carregar álbuns</div>
                </div>
            </div>
        );
    }

    return (
        <DataTable columns={columnsWithActions} data={data || []} />
    );
} 