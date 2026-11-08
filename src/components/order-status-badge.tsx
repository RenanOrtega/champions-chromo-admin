import { orderStatusInfo } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

export function OrderStatusBadge({ status, className }: { status: OrderStatus | undefined; className?: string }) {
    const info = orderStatusInfo(status);
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", info.className, className)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", info.dot)} />
            {info.label}
        </span>
    );
}
