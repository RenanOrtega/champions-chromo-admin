"use client"

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getAlbums } from "@/services/album";

export default function AlbumsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['albums'],
        queryFn: getAlbums,
    });

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
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data || []} />
        </div>
    );
} 