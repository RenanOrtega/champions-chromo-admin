"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { deleteSchool, getSchools } from "@/services/school";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import { CreateForm as CreateAlbumForm } from "../albums/create-form";
import type { ColumnDef } from "@tanstack/react-table";
import type { School } from "@/types/school";
import { Link } from "react-router";

export default function SchoolsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['schools'],
        queryFn: getSchools,
    });

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSchool(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schools"] });
        }
    })

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Carregando escolas...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg text-red-500">Erro ao carregar escolas</div>
                </div>
            </div>
        );
    }

    const columnsWithActions: ColumnDef<School>[] = [
        ...columns,
        {
            id: "actions",
            header: () => {
                return (
                    <div className="flex justify-center">
                        Ações
                    </div>
                )
            },
            size: 120,
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 text-green-500" /> Adicionar álbum
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Criar álbum</DialogTitle>
                                <DialogDescription>
                                    Adicione um álbum nesta escola.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateAlbumForm schoolId={row.original.id} />
                        </DialogContent>
                    </Dialog>
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
                                    <div className="flex flex-col">
                                        Essa ação não pode ser desfeita. Tem certeza que deseja apagar permanentemente esse dado?
                                        <span className="mt-2 font-bold">Todos os albuns relacionados a está escola serão deletados!</span>
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

    return (
        <DataTable columns={columnsWithActions} data={data || []} />
    );
} 