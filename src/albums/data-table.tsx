"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAlbum } from "@/services/album";
import { Trash } from "lucide-react";
import type { BaseData } from "@/types/table";

interface DataTableProps<TData  extends BaseData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData  extends BaseData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAlbum(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["albums"] });
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
                                                    <Trash width={15} height={15} color="red" />
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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