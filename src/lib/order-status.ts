import type { OrderStatus, PaymentStatus } from "@/types/order";

export const ORDER_STATUSES: { value: OrderStatus; label: string; className: string }[] = [
    { value: "new", label: "Novo (aguardando contato)", className: "bg-slate-100 text-slate-700 border-slate-200" },
    { value: "awaitingPayment", label: "Aguardando pagamento", className: "bg-amber-100 text-amber-800 border-amber-200" },
    { value: "paid", label: "Pago", className: "bg-green-100 text-green-800 border-green-200" },
    { value: "inPreparation", label: "Em separação", className: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: "shipped", label: "Enviado", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    { value: "delivered", label: "Entregue", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    { value: "expired", label: "Pix expirado", className: "bg-orange-100 text-orange-800 border-orange-200" },
    { value: "cancelled", label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" },
    { value: "refunded", label: "Reembolsado", className: "bg-purple-100 text-purple-800 border-purple-200" },
];

export const orderStatusInfo = (status: OrderStatus | undefined) =>
    ORDER_STATUSES.find(s => s.value === status) ?? ORDER_STATUSES[0];

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
