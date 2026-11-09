import { orderStatusInfo } from "@/lib/order-status";
import { updateOrderStatus } from "@/services/order";
import type { OrderStatus } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) =>
            updateOrderStatus(id, status, note),
        onSuccess: (_data, { id, status }) => {
            toast.success(`Pedido marcado como "${orderStatusInfo(status).label}"`);
            queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
            queryClient.invalidateQueries({ queryKey: ["orderSummary", id] });
        },
        onError: () => toast.error("Não foi possível alterar o status do pedido"),
    });
}
