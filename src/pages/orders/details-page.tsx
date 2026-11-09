import { getAlbumById } from "@/services/album";
import { getOrderSummaryById } from "@/services/order";
import { getSchoolById } from "@/services/school";
import { type AlbumOrder, type OrderSummary, type SchoolsOrder, type StickersOrder } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Check,
    Copy,
    Download,
    GraduationCap,
    Mail,
    MapPin,
} from "lucide-react";
import { getTypeBadgeColor } from "@/components/badge-sticker-type";
import * as XLSX from 'xlsx';
import { OrderStatusCard } from "./order-status-card";
import { SectionCard } from "./section-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { PAYMENT_STATUS_LABELS, formatDateTime, formatPrice, orderStatusInfo } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { useState } from "react";

const STICKER_TYPE_LABELS: Record<StickersOrder["type"], string> = {
    a4: "A4",
    common: "Comum",
    legend: "Legend",
};

const sumQuantity = (stickers: StickersOrder[]) => stickers.reduce((total, s) => total + s.quantity, 0);

function StickerChip({ sticker }: { sticker: StickersOrder }) {
    return (
        <span
            title={`Figurinha ${sticker.number} · ${STICKER_TYPE_LABELS[sticker.type]} · ${sticker.quantity} un.`}
            className="inline-flex items-center overflow-hidden rounded-md border text-xs"
        >
            <span className="px-2 py-1 font-mono font-medium">#{sticker.number}</span>
            {sticker.type !== "common" && (
                <span className={cn("px-1.5 py-1 font-medium", getTypeBadgeColor(sticker.type))}>
                    {STICKER_TYPE_LABELS[sticker.type]}
                </span>
            )}
            {sticker.quantity > 1 && (
                <span className="bg-muted px-1.5 py-1 font-semibold">×{sticker.quantity}</span>
            )}
        </span>
    );
}

function AlbumItems({ album }: { album: AlbumOrder }) {
    const { data, isLoading } = useQuery({
        queryKey: ['album', album.albumId],
        queryFn: () => getAlbumById(album.albumId),
        enabled: !!album.albumId,
    });

    const name = data?.name ?? album.albumName;
    const units = sumQuantity(album.stickers);
    const sorted = [...album.stickers].sort((a, b) =>
        a.number.localeCompare(b.number, undefined, { numeric: true }));

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {isLoading && !name
                        ? <Skeleton className="h-4 w-40" />
                        : <h4 className="truncate font-medium">{name || "Álbum"}</h4>}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                    {album.stickers.length} {album.stickers.length === 1 ? "figurinha" : "figurinhas"}
                    {units !== album.stickers.length && ` · ${units} un.`}
                </span>
            </div>
            {sorted.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {sorted.map((sticker, index) => <StickerChip key={index} sticker={sticker} />)}
                </div>
            )}
        </div>
    );
}

function SchoolItems({ school }: { school: SchoolsOrder }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['school', school.schoolId],
        queryFn: () => getSchoolById(school.schoolId),
        enabled: !!school.schoolId,
    });

    return (
        <SectionCard
            title={
                <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    {isLoading ? <Skeleton className="h-4 w-48" /> : error ? "Escola" : data?.name}
                </span>
            }
            action={data && (
                <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">{data.city} - {data.state}</span>
            )}
        >
            <div className="divide-y">
                {school.albums.map((album, index) => (
                    <div key={index} className="py-5 first:pt-0 last:pb-0">
                        <AlbumItems album={album} />
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

function CopyId({ id }: { id: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            onClick={() => {
                navigator.clipboard?.writeText(id).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                });
            }}
            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copiar ID"
        >
            {id}
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </button>
    );
}

function Row({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) {
    return (
        <div className={cn("flex items-baseline justify-between gap-3 text-sm", strong && "text-base font-semibold")}>
            <span className={cn(!strong && "text-muted-foreground")}>{label}</span>
            <span className="text-right">{children}</span>
        </div>
    );
}

function CustomerCard({ order }: { order: OrderSummary }) {
    const { customer } = order;
    const address = customer.address;
    return (
        <SectionCard title="Cliente">
            <div className="space-y-4 text-sm">
                <div>
                    <p className="font-medium">{customer.name || "Sem nome"}</p>
                    {customer.email && (
                        <a href={`mailto:${customer.email}`} className="mt-0.5 inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground break-all">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            {customer.email}
                        </a>
                    )}
                </div>
                {address && (address.street || address.city) && (
                    <div className="flex gap-2 border-t pt-4">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="leading-relaxed">
                            <p>{address.street}{address.number && `, ${address.number}`}</p>
                            {address.complement && <p>{address.complement}</p>}
                            {address.neighborhood && <p>{address.neighborhood}</p>}
                            <p>{address.city}{address.state && ` - ${address.state}`}</p>
                            {address.postalCode && <p className="text-muted-foreground">CEP {address.postalCode}</p>}
                        </div>
                    </div>
                )}
            </div>
        </SectionCard>
    );
}

function SummaryCard({ order }: { order: OrderSummary }) {
    const hasDiscount = !!order.discount && order.discount > 0;
    const hasOnlinePayment = order.paymentStatus && order.paymentStatus !== "notStarted";
    return (
        <SectionCard title="Resumo">
            <div className="space-y-2.5">
                <Row label="Álbuns">{order.totalAlbums}</Row>
                <Row label="Figurinhas">{order.totalStickers}</Row>
                {hasDiscount && (
                    <>
                        <Row label="Subtotal">{formatPrice(order.subtotal ?? order.priceTotal + order.discount!)}</Row>
                        <Row label={order.couponCode ? `Cupom ${order.couponCode}` : "Desconto"}>
                            <span className="text-green-700 dark:text-green-400">- {formatPrice(order.discount!)}</span>
                        </Row>
                    </>
                )}
                <div className="border-t pt-2.5">
                    <Row label="Total" strong>{formatPrice(order.priceTotal)}</Row>
                </div>
                {hasOnlinePayment && (
                    <div className="space-y-2.5 border-t pt-2.5">
                        <Row label="Pagamento">{PAYMENT_STATUS_LABELS[order.paymentStatus]}</Row>
                        {order.paidAt && <Row label="Pago em">{formatDateTime(order.paidAt)}</Row>}
                        {!order.paidAt && order.paymentExpiresAt && order.paymentStatus === "awaitingPayment" && (
                            <Row label="Pix expira em">{formatDateTime(order.paymentExpiresAt)}</Row>
                        )}
                        {order.paymentProviderOrderId && (
                            <Row label="ID Mercado Pago"><span className="font-mono text-xs">{order.paymentProviderOrderId}</span></Row>
                        )}
                    </div>
                )}
            </div>
        </SectionCard>
    );
}

// Função para baixar a planilha
async function downloadOrderSpreadsheet(order: OrderSummary, orderSummaryId: string) {
    try {
        // Aba 1: Resumo do Pedido
        const summaryData = [
            ['ID do Pedido', orderSummaryId],
            ['Status', orderStatusInfo(order.status).label],
            ['Nome do Cliente', order.customer.name || ''],
            ['Email do Cliente', order.customer.email || ''],
            ['Rua', order.customer.address.street || ''],
            ['Número', order.customer.address.number || ''],
            ['Complemento', order.customer.address.complement || ''],
            ['Cidade', order.customer.address.city || ''],
            ['Estado', order.customer.address.state || ''],
            ['Total de Álbuns', order.totalAlbums],
            ['Total de Figurinhas', order.totalStickers],
            ['Valor Total', `R$ ${order.priceTotal.toFixed(2)}`]
        ];

        // Aba 2: Detalhes das Figurinhas
        const stickersData = [
            ['Escola', 'Álbum', 'Número da Figurinha', 'Tipo', 'Quantidade']
        ];

        // Buscar dados das escolas e álbuns
        for (const school of order.schools) {
            const schoolData = await getSchoolById(school.schoolId);

            for (const album of school.albums) {
                const albumData = await getAlbumById(album.albumId);

                for (const sticker of album.stickers) {
                    stickersData.push([
                        schoolData?.name || 'N/A',
                        albumData?.name || 'N/A',
                        sticker.number.toString(),
                        sticker.type,
                        sticker.quantity.toString()
                    ]);
                }
            }
        }

        // Criar workbook
        const wb = XLSX.utils.book_new();

        // Criar worksheet do resumo
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo do Pedido');

        // Criar worksheet das figurinhas
        const wsStickers = XLSX.utils.aoa_to_sheet(stickersData);
        XLSX.utils.book_append_sheet(wb, wsStickers, 'Figurinhas');

        // Ajustar largura das colunas
        const maxWidth = 20;
        wsSummary['!cols'] = [{ wch: maxWidth }, { wch: maxWidth }];
        wsStickers['!cols'] = [
            { wch: 25 }, // Escola
            { wch: 25 }, // Álbum
            { wch: 15 }, // Número
            { wch: 15 }, // Tipo
            { wch: 10 }  // Quantidade
        ];

        // Gerar arquivo Excel e fazer download
        const fileName = `pedido_${orderSummaryId}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

    } catch (error) {
        console.error('Erro ao gerar planilha:', error);
        alert('Erro ao gerar a planilha. Tente novamente.');
    }
}

// Goes back so the list keeps its filters; falls back to the list when the page was opened directly.
function BackLink() {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate("/orders"))}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
            <ArrowLeft className="h-4 w-4" />
            Pedidos
        </button>
    );
}

export default function DetailsPage() {
    const { orderSummaryId } = useParams<{ orderSummaryId: string }>();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['orderSummary', orderSummaryId],
        queryFn: () => getOrderSummaryById(orderSummaryId!),
    });

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-72" />
                <div className="grid gap-6 lg:grid-cols-3">
                    <Skeleton className="h-96 rounded-xl lg:col-span-2" />
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="mx-auto max-w-6xl space-y-4">
                <BackLink />
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Não foi possível carregar os detalhes do pedido. Tente novamente.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const shortId = order.id.slice(-8);

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="space-y-3">
                <BackLink />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold">Pedido #{shortId}</h1>
                            <OrderStatusBadge status={order.status} className="text-sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            {order.createdAt && <span>Criado em {formatDateTime(order.createdAt)}</span>}
                            <CopyId id={order.id} />
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => downloadOrderSpreadsheet(order, order.id)} className="cursor-pointer">
                        <Download className="h-4 w-4" />
                        Baixar planilha
                    </Button>
                </div>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-lg font-semibold">Itens do pedido</h2>
                        <span className="text-sm text-muted-foreground">
                            {order.totalAlbums} {order.totalAlbums === 1 ? "álbum" : "álbuns"} · {order.totalStickers} figurinhas
                        </span>
                    </div>
                    {order.schools.map((school, index) => <SchoolItems key={index} school={school} />)}
                </div>

                <aside className="order-1 space-y-6 lg:order-2">
                    <OrderStatusCard key={`${order.id}-${order.status}`} order={order} />
                    <CustomerCard order={order} />
                    <SummaryCard order={order} />
                </aside>
            </div>
        </div>
    );
}
