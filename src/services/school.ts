import { api } from "@/lib/axios";
import type { School, SchoolCreateInput } from "@/types/school";

export async function createSchool(data: SchoolCreateInput) {
    const response = await api.post("/school", data)
    return response.data;
}

export async function getSchools(): Promise<School[]> {
    const response = await api.get("/school");
    return response.data;
}

export async function deleteSchool(id: string) {
    const response = await api.delete(`/school/${id}`);
    return response.data;
}