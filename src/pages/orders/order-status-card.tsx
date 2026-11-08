import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateOrderStatus } from "@/hooks/use-update-order-status";
import { NEXT_STEP, ORDER_STATUSES, PAYMENT_STATUS_LABELS, formatDateTime } from "@/lib/order-status";
import type { OrderStatus, OrderSummary } from "@/types/order";
import { ArrowRight, ClipboardList, History } from "lucide-react";
import { useState } from "react";

const BY_LABELS: Record<string, string> = {
    system: "Sistema",
    mercadopago: "Mercado Pago",
};

export function OrderStatusCard({ order }: { order: OrderSummary }) {
    const currentStatus: OrderStatus = order.status ?? "new";
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [note, setNote] = useState("");

    const mutation = useUpdateOrderStatus();
    const next = NEXT_STEP[currentStatus];

    const history = [...(order.statusHistory ?? [])].reverse();

    return (
        <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <ClipboardList className="h-4 w-4" /> Status do pedido
                        </div>
                        <OrderStatusBadge status={currentStatus} className="text-sm" />
                        {next && (
                            <div className="pt-2">
                                <Button
                                    disabled={mutation.isPending}
                                    onClick={() => mutation.mutate({ id: order.id, status: next.to })}
                                    className="cursor-pointer"
                                >
                                    {next.label} <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="text-sm text-gray-600 space-y-1 pt-1">
                            <p>Criado em: {formatDateTime(order.createdAt)}</p>
                            <p>Pagamento: {PAYMENT_STATUS_LABELS[order.paymentStatus ?? "notStarted"]}</p>
                            {order.paidAt && <p>Pago em: {formatDateTime(order.paidAt)}</p>}
                            {order.paymentProviderOrderId && (
                                <p className="font-mono text-xs">Mercado Pago: {order.paymentProviderOrderId}</p>
                            )}
                        </div>
                    </div>

                    <form
                        className="flex flex-col gap-3 w-full md:max-w-sm"
                        onSubmit={(e) => {
                            e.preventDefault();
                            mutation.mutate({ id: order.id, status, note }, { onSuccess: () => setNote("") });
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="order-status">Outro status</Label>
                            <select
                                id="order-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                            >
                                {ORDER_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="order-status-note">Observação (opcional)</Label>
                            <Input
                                id="order-status-note"
                                value={note}
                                maxLength={500}
                                placeholder="Ex.: código de rastreio, combinado no WhatsApp..."
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={mutation.isPending || status === currentStatus}>
                            {mutation.isPending ? "Salvando..." : "Salvar status"}
                        </Button>
                    </form>
                </div>

                {history.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                            <History className="h-4 w-4" /> Histórico
                        </div>
                        <ul className="space-y-2">
                            {history.map((change, index) => (
                                <li key={index} className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-gray-500 w-32 shrink-0">{formatDateTime(change.at)}</span>
                                    <OrderStatusBadge status={change.status} />
                                    <span className="text-gray-500">por {BY_LABELS[change.by] ?? change.by}</span>
                                    {change.note && <span className="text-gray-700">· {change.note}</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
