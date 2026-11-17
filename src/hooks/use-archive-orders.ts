import { setOrdersArchived } from "@/services/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const plural = (n: number) => `${n} pedido${n === 1 ? "" : "s"}`;

// Archives or unarchives orders. After archiving, the toast offers "Desfazer".
export function useArchiveOrders() {
    const queryClient = useQueryClient();

    const refresh = (ids: string[]) => {
        queryClient.invalidateQueries({ queryKey: ["ordersSummary"] });
        ids.forEach(id => queryClient.invalidateQueries({ queryKey: ["orderSummary", id] }));
    };

    const mutation = useMutation({
        mutationFn: ({ ids, archived }: { ids: string[]; archived: boolean }) => setOrdersArchived(ids, archived),
        onSuccess: (_updated, { ids, archived }) => {
            refresh(ids);
            if (archived) {
                toast.success(ids.length === 1 ? "Pedido arquivado" : `${plural(ids.length)} arquivados`, {
                    action: {
                        label: "Desfazer",
                        onClick: () => {
                            setOrdersArchived(ids, false)
                                .then(() => {
                                    refresh(ids);
                                    toast.success(ids.length === 1 ? "Pedido desarquivado" : `${plural(ids.length)} desarquivados`);
                                })
                                .catch(() => toast.error("Não foi possível desfazer"));
                        },
                    },
                });
            } else {
                toast.success(ids.length === 1 ? "Pedido desarquivado" : `${plural(ids.length)} desarquivados`);
            }
        },
        onError: (_error, { archived }) =>
            toast.error(archived ? "Não foi possível arquivar" : "Não foi possível desarquivar"),
    });

    return mutation;
}
