import { api } from "@/lib/axios";
import type { Album, AlbumCreateInput, AlbumUpdateInput } from "@/types/album";

export async function createAlbum(data: AlbumCreateInput, schoolId: string) {
    const response = await api.post("/album", { ...data, schoolId: schoolId })
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

export async function getAlbumById(id: string): Promise<Album> {
    const response = await api.get(`/album/${id}`);
    return response.data;
}

export async function getAlbumsBySchoolId(schoolId: string): Promise<Album[]> {
    const response = await api.get(`album/schoolId/${schoolId}`);
    return response.data;
}

// Atualizar álbum
export async function updateAlbum(id: string, data: AlbumUpdateInput): Promise<Album> {
    const response = await api.patch(`/album/${id}`, data)
    return response.data;
}