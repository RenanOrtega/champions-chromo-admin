import { api } from "@/lib/axios";
import type { Album, AlbumCreateInput } from "@/types/album";

export async function createAlbum(data: AlbumCreateInput, schoolId: string) {
    const response = await api.post("/album", {...data, schoolId: schoolId})
    return response.data;
}

export async function getAlbums(): Promise<Album[]> {
    const response = await api.get("/album");
    return response.data;
}

export async function deleteAlbum(id: string) {
    const response = await api.delete(`/album/${id}`);
    return response.data;
}