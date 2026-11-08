import type { OrderStatus, PaymentStatus } from "@/types/order";

type StatusInfo = { value: OrderStatus; label: string; className: string; dot: string };

export const ORDER_STATUSES: StatusInfo[] = [
    { value: "new", label: "Novo", className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
    { value: "awaitingPayment", label: "Aguardando pagamento", className: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900", dot: "bg-amber-500" },
    { value: "paid", label: "Pago", className: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900", dot: "bg-green-500" },
    { value: "made", label: "Feito", className: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900", dot: "bg-blue-500" },
    { value: "shipped", label: "Enviado", className: "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-900", dot: "bg-indigo-500" },
    { value: "expired", label: "Pix expirado", className: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-900", dot: "bg-orange-500" },
    { value: "cancelled", label: "Cancelado", className: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900", dot: "bg-red-500" },
    { value: "refunded", label: "Reembolsado", className: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-900", dot: "bg-purple-500" },
];

export const orderStatusInfo = (status: OrderStatus | undefined) =>
    ORDER_STATUSES.find(s => s.value === status) ?? ORDER_STATUSES[0];

// The next manual step the team usually takes from each status.
export const NEXT_STEP: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
    new: { to: "paid", label: "Marcar como pago" },
    paid: { to: "made", label: "Marcar como feito" },
    made: { to: "shipped", label: "Marcar como enviado" },
};

// Tabs on the orders list. "closed" groups the orders that left the normal flow.
export const STATUS_TABS: { key: string; label: string; statuses: OrderStatus[] | null }[] = [
    { key: "all", label: "Todos", statuses: null },
    { key: "pending", label: "Aguardando pagamento", statuses: ["new", "awaitingPayment"] },
    { key: "paid", label: "Pagos", statuses: ["paid"] },
    { key: "made", label: "Feitos", statuses: ["made"] },
    { key: "shipped", label: "Enviados", statuses: ["shipped"] },
    { key: "closed", label: "Cancelados/expirados", statuses: ["expired", "cancelled", "refunded"] },
];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    notStarted: "Sem pagamento online",
    awaitingPayment: "Pix gerado, aguardando",
    paid: "Pago via Pix",
    expired: "Pix expirado",
    cancelled: "Pix cancelado",
    refunded: "Reembolsado",
};

export const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "-";

export const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
