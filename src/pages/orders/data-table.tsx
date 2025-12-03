"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import type { BaseData } from "@/types/table";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router";

interface DataTableProps<TData extends BaseData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
}

export function DataTable<TData extends BaseData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Ler valores iniciais da URL
    const initialPage = Number(searchParams.get("page")) || 0;
    const initialIdFilter = searchParams.get("filterId") || "";
    const initialAlbumFilter = searchParams.get("filterAlbum") || "";

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        const filters: ColumnFiltersState = [];
        if (initialIdFilter) filters.push({ id: "id", value: initialIdFilter });
        if (initialAlbumFilter) filters.push({ id: "albumName", value: initialAlbumFilter });
        return filters;
    });
    const [pagination, setPagination] = useState({
        pageIndex: initialPage,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            if (columnId === 'albumName') {
                const data = row.original as any;
                const albums = data.schools?.flatMap((school: any) => school.albums) || [];
                return albums.some((album: any) =>
                    album.albumName?.toLowerCase().includes(filterValue.toLowerCase())
                );
            }
            return true;
        }
    });

    // Sincronizar estado com URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (pagination.pageIndex > 0) {
            params.set("page", pagination.pageIndex.toString());
        }

        const idFilter = columnFilters.find(f => f.id === "id");
        if (idFilter?.value) {
            params.set("filterId", String(idFilter.value));
        }

        const albumFilter = columnFilters.find(f => f.id === "albumName");
        if (albumFilter?.value) {
            params.set("filterAlbum", String(albumFilter.value));
        }

        setSearchParams(params, { replace: true });
    }, [pagination.pageIndex, columnFilters, setSearchParams]);

    return (
        <div>
            <div className="flex justify-start items-center py-4 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Filtrar por ID</Label>
                    <Input
                        placeholder="Filtrar ID..."
                        value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("id")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm bg-primary-foreground"
                    />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                    <Label>Filtrar por álbum</Label>
                    <Input
                        placeholder="Filtrar por nome do álbum..."
                        value={(table.getColumn("albumName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("albumName")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm bg-primary-foreground"
                    />
                </div>
            </div>
            <div className="rounded-md border bg-primary-foreground">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
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
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    {" "}({table.getFilteredRowModel().rows.length} resultado{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''})
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Primeira
                    </Button>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        Última
                    </Button>
                </div>
            </div>
        </div>
    )
}