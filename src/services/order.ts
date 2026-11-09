import { api } from "@/lib/axios";
import type { OrderStatus, OrderSummary } from "@/types/order";

export async function getOrdersSummary(): Promise<OrderSummary[]> {
    const response = await api.get("/order");
    return response.data;
}

export async function deleteOrderSummary(id: string) {
    const response = await api.delete(`/order/${id}`);
    return response.data;
}

export async function getOrderSummaryById(id: string): Promise<OrderSummary> {
    const response = await api.get(`/order/${id}`);
    return response.data;
}
export async function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
    await api.patch(`/order/${id}/status`, { status, note });
}
