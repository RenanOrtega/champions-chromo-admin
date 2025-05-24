"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table";
import { useState } from "react";
import { CreateForm } from "./create-form";
import { CreateForm as CreateAlbumForm } from "../albums/create-form";
import { Plus, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchool } from "@/services/school";
import type { BaseData } from "@/types/table";

interface DataTableProps<TData extends BaseData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData extends BaseData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const queryClient = useQueryClient();

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteSchool(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schools"] });
        }
    })

    return (
        <div className="m-5">
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder="Filtrar nomes..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Criar escola</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Criar escola</DialogTitle>
                            <DialogDescription>
                                Adicione uma escola ao seu sistema.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateForm />
                    </DialogContent>
                </Dialog>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                                <TableHead>
                                    Adicionar Álbum
                                </TableHead>
                                <TableHead>
                                    Deletar
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="cursor-pointer">
                                                    <Plus height={15} width={15} />
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
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="cursor-pointer">
                                                        <Trash width={15} height={15} color="red" />
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
                                                        className="cursor-pointer"
                                                    >
                                                            Sim
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Próxima
                </Button>
            </div>
        </div>
    )
}