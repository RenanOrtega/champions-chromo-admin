"use client"

import { OrderStatusBadge } from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useArchiveOrders } from "@/hooks/use-archive-orders";
import { useUpdateOrderStatus } from "@/hooks/use-update-order-status";
import { NEXT_STEP, STATUS_TABS, formatDateTime, formatPrice } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { getOrdersSummary } from "@/services/order";
import { getSchools } from "@/services/school";
import type { OrderSummary } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import {
    Archive,
    ArchiveRestore,
    ArrowDownWideNarrow,
    ArrowUpWideNarrow,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    Hammer,
    Loader2,
    Package,
    RefreshCw,
    Search,
    Send,
    Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const PAGE_SIZE = 20;

const albumNames = (order: OrderSummary) =>
    order.schools?.flatMap(school => school.albums.map(album => album.albumName)) ?? [];

const matchesSearch = (order: OrderSummary, term: string) => {
    if (!term) return true;
    const q = term.toLowerCase();
    return (
        order.id.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.customer?.email?.toLowerCase().includes(q) ||
        albumNames(order).some(name => name?.toLowerCase().includes(q))
    );
};

function SummaryCard({ label, count, total, icon: Icon, accent, active, onClick }: {
    label: string
    count: number
    total: number
    icon: typeof Wallet
    accent: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-md cursor-pointer",
                active && "ring-2 ring-primary"
            )}
        >
            <div className={cn("rounded-lg p-2.5", accent)}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold leading-tight">{count}</p>
                <p className="text-xs text-muted-foreground">{formatPrice(total)}</p>
            </div>
        </button>
    );
}

function QuickAction({ order }: { order: OrderSummary }) {
    const mutation = useUpdateOrderStatus();
    const next = NEXT_STEP[order.status ?? "new"];
    if (!next) return null;

    const Icon = next.to === "made" ? Hammer : next.to === "shipped" ? Send : CircleDollarSign;

    return (
        <Button
            size="sm"
            variant="outline"
            disabled={mutation.isPending}
            onClick={(e) => {
                e.stopPropagation();
                mutation.mutate({ id: order.id, status: next.to });
            }}
            className="cursor-pointer"
        >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
            {next.label}
        </Button>
    );
}

function ArchiveButton({ order }: { order: OrderSummary }) {
    const mutation = useArchiveOrders();
    const archived = !!order.archivedAt;
    const label = archived ? "Desarquivar" : "Arquivar";

    return (
        <Button
            size="sm"
            variant="ghost"
            title={label}
            aria-label={label}
            disabled={mutation.isPending}
            onClick={(e) => {
                e.stopPropagation();
                mutation.mutate({ ids: [order.id], archived: !archived });
            }}
            className="cursor-pointer text-muted-foreground"
        >
            {mutation.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {archived && <span>Desarquivar</span>}
        </Button>
    );
}

function ArchivedBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
            <Archive className="h-3 w-3" />
            Arquivado
        </span>
    );
}

// Archives every non-archived order currently shown for the selected school (respects tab and search).
function ArchiveSchoolButton({ orders, schoolName }: { orders: OrderSummary[]; schoolName: string }) {
    const [open, setOpen] = useState(false);
    const mutation = useArchiveOrders();
    const toArchive = orders.filter(o => !o.archivedAt);
    const notShipped = toArchive.filter(o => !["shipped", "expired", "cancelled", "refunded"].includes(o.status ?? "new")).length;
    const multiSchool = toArchive.filter(o => (o.schools?.length ?? 0) > 1).length;

    if (toArchive.length === 0) return null;

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)} className="cursor-pointer">
                <Archive className="h-4 w-4" />
                Arquivar todos desta escola ({toArchive.length})
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Arquivar {toArchive.length} pedido{toArchive.length === 1 ? "" : "s"}?</DialogTitle>
                        <DialogDescription>
                            Os pedidos de {schoolName} que aparecem na lista (com a aba e a busca atuais) vão sair da lista.
                            Eles continuam salvos e voltam com "Mostrar arquivados".
                        </DialogDescription>
                    </DialogHeader>
                    {(notShipped > 0 || multiSchool > 0) && (
                        <ul className="list-disc space-y-1 pl-5 text-sm text-amber-700 dark:text-amber-400">
                            {notShipped > 0 && (
                                <li>{notShipped} ainda não {notShipped === 1 ? "foi enviado" : "foram enviados"}.</li>
                            )}
                            {multiSchool > 0 && (
                                <li>{multiSchool} também {multiSchool === 1 ? "tem" : "têm"} álbuns de outra escola.</li>
                            )}
                        </ul>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">Cancelar</Button>
                        <Button
                            disabled={mutation.isPending}
                            onClick={() => mutation.mutate(
                                { ids: toArchive.map(o => o.id), archived: true },
                                { onSuccess: () => setOpen(false) }
                            )}
                            className="cursor-pointer"
                        >
                            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
                            Arquivar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function AlbumsCell({ order }: { order: OrderSummary }) {
    const names = albumNames(order);
    const shown = names.slice(0, 2);
    return (
        <div className="min-w-0">
            <p className="truncate text-sm">
                {shown.join(", ") || "-"}
                {names.length > shown.length && (
                    <span className="text-muted-foreground"> +{names.length - shown.length}</span>
                )}
            </p>
            <p className="text-xs text-muted-foreground">
                {order.totalAlbums} álbu{order.totalAlbums === 1 ? "m" : "ns"} · {order.totalStickers} figurinha{order.totalStickers === 1 ? "" : "s"}
            </p>
        </div>
    );
}

export default function OrderSummaryPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get("status") ?? "all";
    const search = searchParams.get("q") ?? "";
    const oldestFirst = searchParams.get("sort") === "oldest";
    const page = Math.max(0, Number(searchParams.get("page")) || 0);
    const schoolId = searchParams.get("school") ?? "";
    const showArchived = searchParams.get("archived") === "1";

    const updateParams = (changes: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams);
        for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "" || (key === "status" && value === "all")) params.delete(key);
            else params.set(key, value);
        }
        if (!("page" in changes)) params.delete("page");
        setSearchParams(params, { replace: true });
    };

    const { data: allOrders = [], isLoading, isFetching, error, refetch } = useQuery({
        queryKey: ["ordersSummary", { archived: showArchived }],
        queryFn: () => getOrdersSummary(showArchived),
    });

    const { data: schools = [] } = useQuery({
        queryKey: ["schools"],
        queryFn: getSchools,
    });

    // Only schools that have orders in the current list, sorted by name.
    const schoolOptions = useMemo(() => {
        const ids = new Set(allOrders.flatMap(o => o.schools?.map(s => s.schoolId) ?? []));
        return schools
            .filter(s => ids.has(s.id) || s.id === schoolId)
            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }, [allOrders, schools, schoolId]);
    const selectedSchool = schools.find(s => s.id === schoolId);

    // The school filter applies to the cards and tab counters too, so they describe that school.
    const data = useMemo(
        () => schoolId ? allOrders.filter(o => o.schools?.some(s => s.schoolId === schoolId)) : allOrders,
        [allOrders, schoolId]
    );

    const countFor = (statuses: string[] | null) =>
        statuses ? data.filter(o => statuses.includes(o.status ?? "new")).length : data.length;

    const sumFor = (statuses: string[]) =>
        data.filter(o => statuses.includes(o.status ?? "new")).reduce((acc, o) => acc + o.priceTotal, 0);

    const filtered = useMemo(() => {
        const statuses = STATUS_TABS.find(t => t.key === tab)?.statuses ?? null;
        const list = data.filter(o =>
            (!statuses || statuses.includes(o.status ?? "new")) && matchesSearch(o, search)
        );
        return list.sort((a, b) => {
            const diff = new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
            return oldestFirst ? diff : -diff;
        });
    }, [data, tab, search, oldestFirst]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount - 1);
    const pageItems = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const goDetails = (id: string) => navigate(id);

    const summary = [
        { key: "pending", label: "Aguardando pagamento", statuses: ["new", "awaitingPayment"], icon: Wallet, accent: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200", tab: "pending" },
        { key: "paid", label: "Pagos (a fazer)", statuses: ["paid"], icon: CircleDollarSign, accent: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200", tab: "paid" },
        { key: "made", label: "Feitos (a enviar)", statuses: ["made"], icon: Hammer, accent: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200", tab: "made" },
        { key: "shipped", label: "Enviados", statuses: ["shipped"], icon: Send, accent: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200", tab: "shipped" },
    ];

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="text-lg text-red-600">Erro ao carregar pedidos</div>
                    <Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Pedidos</h1>
                    <p className="text-muted-foreground mt-1">
                        {isLoading
                            ? "Carregando..."
                            : `${data.length} pedido${data.length !== 1 ? "s" : ""}${selectedSchool ? ` de ${selectedSchool.name}` : " no total"}${showArchived ? ", incluindo arquivados" : ""}`}
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer">
                    <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                    Atualizar
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {isLoading
                    ? summary.map(s => <Skeleton key={s.key} className="h-[92px] rounded-xl" />)
                    : summary.map(s => (
                        <SummaryCard
                            key={s.key}
                            label={s.label}
                            count={countFor(s.statuses)}
                            total={sumFor(s.statuses)}
                            icon={s.icon}
                            accent={s.accent}
                            active={tab === s.tab}
                            onClick={() => updateParams({ status: tab === s.tab ? "all" : s.tab })}
                        />
                    ))}
            </div>

            <div className="rounded-xl border bg-card">
                <div className="flex flex-col gap-3 border-b p-4">
                    <div className="flex gap-1 overflow-x-auto pb-1 -mb-1">
                        {STATUS_TABS.map(t => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => updateParams({ status: t.key })}
                                className={cn(
                                    "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                                    tab === t.key
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {t.label}
                                <span className={cn("ml-1.5 text-xs", tab === t.key ? "opacity-80" : "opacity-60")}>
                                    {countFor(t.statuses)}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[220px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => updateParams({ q: e.target.value })}
                                placeholder="Buscar por cliente, e-mail, álbum ou ID do pedido"
                                className="pl-9"
                            />
                        </div>
                        <select
                            value={schoolId}
                            onChange={(e) => updateParams({ school: e.target.value })}
                            aria-label="Filtrar por escola"
                            className="h-9 w-full sm:w-auto sm:max-w-[260px] rounded-md border border-input bg-background px-3 text-sm shadow-xs cursor-pointer"
                        >
                            <option value="">Todas as escolas</option>
                            {schoolOptions.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <Button
                            variant="ghost"
                            onClick={() => updateParams({ sort: oldestFirst ? null : "oldest" })}
                            className="cursor-pointer"
                        >
                            {oldestFirst ? <ArrowUpWideNarrow className="h-4 w-4" /> : <ArrowDownWideNarrow className="h-4 w-4" />}
                            {oldestFirst ? "Mais antigos primeiro" : "Mais recentes primeiro"}
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <Switch
                                checked={showArchived}
                                onCheckedChange={(checked) => updateParams({ archived: checked ? "1" : null })}
                            />
                            Mostrar arquivados
                        </label>
                        {selectedSchool && !isLoading && (
                            <ArchiveSchoolButton orders={filtered} schoolName={selectedSchool.name} />
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-2 p-4">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                    </div>
                ) : pageItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
                        <Package className="h-10 w-10" />
                        <p>Nenhum pedido encontrado{search ? ` para "${search}"` : ""}.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <table className="hidden md:table w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Pedido</th>
                                    <th className="px-4 py-3 font-medium">Cliente</th>
                                    <th className="px-4 py-3 font-medium">Itens</th>
                                    <th className="px-4 py-3 font-medium text-right">Valor</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Próximo passo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageItems.map(order => (
                                    <tr
                                        key={order.id}
                                        onClick={() => goDetails(order.id)}
                                        className={cn(
                                            "border-b last:border-0 hover:bg-muted/50 cursor-pointer",
                                            order.archivedAt && "opacity-60"
                                        )}
                                    >
                                        <td className="px-4 py-3 align-top">
                                            <p className="font-mono text-xs font-semibold">#{order.id.slice(-8)}</p>
                                            <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                                        </td>
                                        <td className="px-4 py-3 align-top max-w-[220px]">
                                            <p className="font-medium truncate">{order.customer?.name || "Sem nome"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{order.customer?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 align-top max-w-[260px]">
                                            <AlbumsCell order={order} />
                                        </td>
                                        <td className="px-4 py-3 align-top text-right">
                                            <p className="font-semibold">{formatPrice(order.priceTotal)}</p>
                                            {order.couponCode && (
                                                <p className="text-xs text-muted-foreground">cupom {order.couponCode}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="flex flex-col items-start gap-1">
                                                <OrderStatusBadge status={order.status} />
                                                {order.archivedAt && <ArchivedBadge />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 align-top text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {!order.archivedAt && <QuickAction order={order} />}
                                                <ArchiveButton order={order} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile */}
                        <ul className="md:hidden divide-y">
                            {pageItems.map(order => (
                                <li
                                    key={order.id}
                                    onClick={() => goDetails(order.id)}
                                    className={cn("p-4 space-y-2 cursor-pointer active:bg-muted/50", order.archivedAt && "opacity-60")}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{order.customer?.name || "Sem nome"}</p>
                                            <p className="font-mono text-xs text-muted-foreground">
                                                #{order.id.slice(-8)} · {formatDateTime(order.createdAt)}
                                            </p>
                                        </div>
                                        <p className="font-semibold shrink-0">{formatPrice(order.priceTotal)}</p>
                                    </div>
                                    <AlbumsCell order={order} />
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-1">
                                            <OrderStatusBadge status={order.status} />
                                            {order.archivedAt && <ArchivedBadge />}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!order.archivedAt && <QuickAction order={order} />}
                                            <ArchiveButton order={order} />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {!isLoading && filtered.length > 0 && (
                    <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                        <span>
                            {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={currentPage === 0}
                                onClick={() => updateParams({ page: String(currentPage - 1) })}
                            >
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                            <span className="px-2">{currentPage + 1} / {pageCount}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={currentPage >= pageCount - 1}
                                onClick={() => updateParams({ page: String(currentPage + 1) })}
                            >
                                Próxima <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
