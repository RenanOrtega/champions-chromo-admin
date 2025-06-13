"use client"

import { getAlbumById } from "@/services/album";
import { getOrderSummaryById } from "@/services/order";
import { getSchoolById } from "@/services/school";
import { type OrderSummary, type StickersOrder } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    MapPin,
    BookOpen,
    Image,
    DollarSign,
    Package,
    AlertCircle,
    User,
    Download
} from "lucide-react";
import { BadgeStickerType } from "@/components/badge-sticker-type";
import * as XLSX from 'xlsx';

function SchoolDetails({ schoolId }: { schoolId: string }) {
    const { data: school, isLoading, error } = useQuery({
        queryKey: ['school', schoolId],
        queryFn: () => getSchoolById(schoolId),
        enabled: !!schoolId,
    });

    if (isLoading) return <Skeleton className="h-16 w-full rounded-xl" />;
    if (error) return (
        <Alert variant="destructive" className="rounded-xl border-0 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar escola</AlertDescription>
        </Alert>
    );

    return (
        <div className="rounded-xl p-4 border border-blue-100 dark:border-blue-600">
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-lg dark:bg-blue-700">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-white" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold">{school?.name}</h4>
                    <div className="flex items-center gap-1.5 text-sm mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{school?.city} - {school?.state}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StickersList({ stickers }: { stickers: StickersOrder[] }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2 w-full">
            {stickers.map((sticker, index) => (
                <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-300 rounded-lg p-2.5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium text-gray-700">#{sticker.number}</span>
                        <BadgeStickerType type={sticker.type} />
                    </div>
                    <div>
                        <span className="dark:text-blue-700">Qtd: </span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                            {sticker.quantity}x
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}

function AlbumDetails({ albumId, stickers }: { albumId: string, stickers: StickersOrder[] }) {
    const { data: album, isLoading, error } = useQuery({
        queryKey: ['album', albumId],
        queryFn: () => getAlbumById(albumId),
        enabled: !!albumId,
    });

    if (isLoading) return <Skeleton className="h-24 w-full rounded-xl" />;
    if (error) return (
        <Alert variant="destructive" className="rounded-xl border-0 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar álbum</AlertDescription>
        </Alert>
    );

    return (
        <div className="rounded-xl p-4">
            <div className="flex flex-col items-start gap-3">
                <div className="flex gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-600 p-2.5 rounded-lg">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm ">
                        <h5 className="font-semibold">{album?.name}</h5>
                        <Image className="h-4 w-4" />
                        <span className="text-gray-400">{stickers.length} figurinhas</span>
                    </div>
                </div>
                {stickers.length > 0 && (
                    <StickersList stickers={stickers} />
                )}
            </div>
        </div>
    );
}

function OrderSummaryStats({ order }: { order: OrderSummary }) {
    const stats = [
        {
            label: "Álbuns",
            value: order.totalAlbums,
            icon: BookOpen,
            color: "purple",
            iconBg: "bg-purple-100",
            darkIconBg: "dark:bg-purple-600",
            iconColor: "text-purple-600",
            darkIconColor: "dark:text-white",
            valueColor: "text-purple-700"
        },
        {
            label: "Figurinhas",
            value: order.totalStickers,
            icon: Image,
            color: "orange",
            iconBg: "bg-orange-100",
            darkIconBg: "dark:bg-orange-600",
            iconColor: "text-orange-600",
            darkIconColor: "dark:text-white",
            valueColor: "text-orange-700"
        },
        {
            label: "Total",
            value: `R$ ${order.priceTotal.toFixed(2)}`,
            icon: DollarSign,
            color: "green",
            iconBg: "bg-green-100",
            darkIconBg: "dark:bg-green-600",
            iconColor: "text-green-600",
            darkIconColor: "dark:text-white",
            valueColor: "text-green-700"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {order.customer.name && (
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-full">
                    <CardContent className={`p-6 rounded-xl`}>
                        <div className="flex items-center gap-4">
                            <div className={`bg-blue-100 dark:bg-blue-600 p-3 rounded-xl`}>
                                <User className={`h-6 w-6 text-blue-600 dark:text-white`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Cliente</p>
                                <p className={`text-lg font-semibold`}>{order.customer.name}</p>
                                <p className={`text-sm text-gray-600`}>{order.customer.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            {order.customer.name && (
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 col-span-full">
                    <CardContent className={`p-6 rounded-xl`}>
                        <div className="flex items-center gap-4">
                            <div className={`bg-yellow-100 dark:bg-yellow-600 p-3 rounded-xl`}>
                                <MapPin className={`h-6 w-6 text-yellow-600 dark:text-white`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">Endereço</p>
                                <p className={`text-sm `}><span className="text-yellow-700 font-bold">Rua: </span>{order.customer.address.street}, {order.customer.address.number}</p>
                                {order.customer.address.complement && (<p className={`text-sm`}><span className="text-yellow-700 font-bold ">Complemento: </span>{order.customer.address.complement}</p>)}
                                <p className="text-sm">{order.customer.address.state} - {order.customer.address.city}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {stats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className={`p-6 rounded-xl`}>
                        <div className="flex items-center gap-4">
                            <div className={`${stat.iconBg} ${stat.darkIconBg} p-3 rounded-xl`}>
                                <stat.icon className={`h-6 w-6 ${stat.iconColor} ${stat.darkIconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

        </div>
    );
}

// Função para baixar a planilha
async function downloadOrderSpreadsheet(order: OrderSummary, orderSummaryId: string) {
    try {
        // Aba 1: Resumo do Pedido
        const summaryData = [
            ['ID do Pedido', orderSummaryId],
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

export default function DetailsPage() {
    const { orderSummaryId } = useParams<{ orderSummaryId: string }>();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['orderSummary', orderSummaryId],
        queryFn: () => getOrderSummaryById(orderSummaryId!),
    });

    const handleDownloadSpreadsheet = () => {
        if (order && orderSummaryId) {
            downloadOrderSpreadsheet(order, orderSummaryId);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen ">
                <div className="container mx-auto p-6 max-w-6xl">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-80 rounded-xl" />
                            <Skeleton className="h-5 w-96 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                        </div>
                        <Skeleton className="h-96 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="container mx-auto p-6 max-w-6xl">
                    <Alert variant="destructive" className="rounded-xl border-0 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Não foi possível carregar os detalhes do pedido. Tente novamente.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-600 p-3 rounded-xl">
                            <Package className="h-7 w-7 text-blue-600 dark:text-white" />
                        </div>
                        <div>
                            <h1 className="text-md md:text-2xl font-bold mb-1">
                                Pedido #{orderSummaryId}
                            </h1>
                            <p className="text-gray-600">Visualize todos os detalhes do seu pedido</p>
                        </div>
                    </div>

                    {order && (
                        <Button
                            onClick={handleDownloadSpreadsheet}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar Planilha
                        </Button>
                    )}
                </div>
            </div>

            {order ? (
                <>
                    <OrderSummaryStats order={order} />
                    <div className="space-y-2">
                        {order.schools.map((school, schoolIndex) => (
                            <Card key={schoolIndex} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                                <CardContent className="rounded-xl">
                                    <div className="space-y-6">
                                        <SchoolDetails schoolId={school.schoolId} />

                                        {school.albums.length > 0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <h3 className="text-lg font-semibold">
                                                        Álbuns ({school.albums.length})
                                                    </h3>
                                                </div>
                                                <div className="space-y-2">
                                                    {school.albums.map((album, albumIndex) => (
                                                        <AlbumDetails key={albumIndex} albumId={album.albumId} stickers={album.stickers} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <Card className="border-0 shadow-sm text-center py-16 bg-white rounded-xl">
                    <CardContent>
                        <div className="text-gray-300 text-6xl mb-6">📋</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                        <p className="text-gray-600">Você ainda não possui pedidos registrados.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}