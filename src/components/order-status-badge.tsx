import { Badge } from "@/components/ui/badge";
import { orderStatusInfo } from "@/lib/order-status";
import type { OrderStatus } from "@/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus | undefined }) {
    const info = orderStatusInfo(status);
    return (
        <Badge variant="outline" className={info.className}>
            {info.label}
        </Badge>
    );
}
