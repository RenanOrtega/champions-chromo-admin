import { api } from "@/lib/axios";
import type { Cupom, CupomCreateInput, CupomUpdateInput } from "@/types/cupom";

export async function createCupom(data: CupomCreateInput) {
    const response = await api.post("/cupom", data)
    return response.data;
}

export async function getCupoms(): Promise<Cupom[]> {
    const response = await api.get("/cupom");
    return response.data;
}

export async function deleteCupom(id: string) {
    const response = await api.delete(`/cupom/${id}`);
    return response.data;
}

export async function getCupomById(id: string): Promise<Cupom> {
    const response = await api.get(`/cupom/${id}`);
    return response.data;
}

export async function updateCupom(id: string, data: CupomUpdateInput): Promise<Cupom> {
    const response = await api.patch(`/cupom/${id}`, data)
    return response.data;
}