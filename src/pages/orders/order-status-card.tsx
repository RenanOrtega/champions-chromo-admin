import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateOrderStatus } from "@/hooks/use-update-order-status";
import { NEXT_STEP, ORDER_STATUSES, formatDateTime } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus, OrderSummary } from "@/types/order";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { SectionCard } from "./section-card";

const BY_LABELS: Record<string, string> = {
    system: "Sistema",
    mercadopago: "Mercado Pago",
};

// Main stages shown as a progress line; the other statuses (expired, cancelled, refunded) show as a badge only.
const STAGES: { status: OrderStatus; label: string }[] = [
    { status: "paid", label: "Pago" },
    { status: "made", label: "Feito" },
    { status: "shipped", label: "Enviado" },
];

function StageProgress({ status }: { status: OrderStatus }) {
    const reached = STAGES.findIndex(s => s.status === status);
    return (
        <ol className="flex items-center gap-1">
            {STAGES.map((stage, index) => (
                <li key={stage.status} className="flex flex-1 flex-col gap-1.5">
                    <span className={cn("h-1.5 rounded-full", index <= reached ? "bg-primary" : "bg-muted")} />
                    <span className={cn("text-xs", index <= reached ? "font-medium" : "text-muted-foreground")}>
                        {stage.label}
                    </span>
                </li>
            ))}
        </ol>
    );
}

export function OrderStatusCard({ order }: { order: OrderSummary }) {
    const currentStatus: OrderStatus = order.status ?? "new";
    const [status, setStatus] = useState<OrderStatus>(currentStatus);
    const [note, setNote] = useState("");
    const [showOther, setShowOther] = useState(false);

    const mutation = useUpdateOrderStatus();
    const next = NEXT_STEP[currentStatus];
    const history = [...(order.statusHistory ?? [])].reverse();

    return (
        <SectionCard title="Status">
            <div className="space-y-4">
                <OrderStatusBadge status={currentStatus} className="text-sm" />
                <StageProgress status={currentStatus} />

                {next && (
                    <Button
                        className="w-full cursor-pointer"
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate({ id: order.id, status: next.to })}
                    >
                        {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {next.label} <ArrowRight className="h-4 w-4" />
                    </Button>
                )}

                <button
                    type="button"
                    onClick={() => setShowOther(v => !v)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showOther && "rotate-180")} />
                    Mudar para outro status
                </button>

                {showOther && (
                    <form
                        className="space-y-3 rounded-lg border p-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            mutation.mutate({ id: order.id, status, note }, { onSuccess: () => { setNote(""); setShowOther(false); } });
                        }}
                    >
                        <div className="space-y-1.5">
                            <Label htmlFor="order-status">Status</Label>
                            <select
                                id="order-status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                            >
                                {ORDER_STATUSES.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="order-status-note">Observação (opcional)</Label>
                            <Input
                                id="order-status-note"
                                value={note}
                                maxLength={500}
                                placeholder="Ex.: código de rastreio"
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="outline" className="w-full" disabled={mutation.isPending || status === currentStatus}>
                            Salvar status
                        </Button>
                    </form>
                )}

                {history.length > 0 && (
                    <div className="border-t pt-4">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Histórico</p>
                        <ol className="relative space-y-4 border-l pl-4">
                            {history.map((change, index) => (
                                <li key={index} className="relative">
                                    <span className={cn(
                                        "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                                        index === 0 ? "bg-primary" : "bg-muted-foreground/40"
                                    )} />
                                    <OrderStatusBadge status={change.status} />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDateTime(change.at)} · {BY_LABELS[change.by] ?? change.by}
                                    </p>
                                    {change.note && <p className="mt-1 text-sm">{change.note}</p>}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
