import { api } from "@/lib/axios";
import type { OrderStatus, OrderSummary } from "@/types/order";

export async function getOrdersSummary(includeArchived = false): Promise<OrderSummary[]> {
    const response = await api.get("/order", { params: includeArchived ? { includeArchived: true } : undefined });
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


// Archive = soft delete: the order leaves the list but stays saved (payment history, Pix webhooks).
export async function setOrdersArchived(ids: string[], archived: boolean): Promise<number> {
    const response = await api.post("/order/archive", { ids, archived });
    return response.data?.updated ?? 0;
}
