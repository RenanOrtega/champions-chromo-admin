"use client"

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getSchools } from "@/services/school";

export default function SchoolsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['schools'],
        queryFn: getSchools,
    });

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

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data || []} />
        </div>
    );
} 