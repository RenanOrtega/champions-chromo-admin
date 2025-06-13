import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getMetrics } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
    Album,
    School,
    ShoppingCart,
    DollarSign,
    Package,
    TrendingUp,
    Calendar,
    Star
} from "lucide-react";
import { Link } from "react-router";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

// Definir cores para os gráficos
const COLORS = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899'
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.purple, COLORS.pink];

// Formatter para valores monetários
const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

// Formatter para datas
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export default function HomePage() {
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['metrics'],
        queryFn: getMetrics,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Carregando métricas...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center justify-center h-32">
                    <div className="text-lg text-red-500">Erro ao carregar métricas</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col">
                <span className="text-2xl font-bold">Bom dia, {user?.username}</span>
                <span className="text-sm text-gray-600">Administrador</span>
            </div>

            {/* KPI Cards - Primeira linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.orderMetrics.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Últimos 30 dias
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(data?.orderMetrics.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ticket médio: {formatCurrency(data?.orderMetrics.averageOrderValue || 0)}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Stickers Vendidos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.orderMetrics.totalStickersOrdered}</div>
                        <p className="text-xs text-muted-foreground">
                            Total de unidades
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foregreen" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {((data?.orderMetrics.totalStickersOrdered || 0) / (data?.orderMetrics.totalOrders || 1)).toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Stickers por pedido
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos principais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Vendas Diárias */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Vendas Diárias
                        </CardTitle>
                        <CardDescription>Pedidos e receita dos últimos dias</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data?.dailySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                />
                                <YAxis yAxisId="orders" orientation="left" />
                                <YAxis yAxisId="revenue" orientation="right" />
                                <Tooltip
                                    labelFormatter={(value) => formatDate(value as string)}
                                    formatter={(value: any, name: string) => [
                                        name === 'Receita' ? formatCurrency(value) : value,
                                        name === 'Receita' ? 'Receita' : 'Pedidos'
                                    ]}
                                />
                                <Legend />
                                <Line
                                    yAxisId="orders"
                                    type="monotone"
                                    dataKey="ordersCount"
                                    stroke={COLORS.primary}
                                    strokeWidth={2}
                                    name="Pedidos"
                                />
                                <Line
                                    yAxisId="revenue"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={COLORS.secondary}
                                    strokeWidth={2}
                                    name="Receita"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gráfico de Pizza - Tipos de Stickers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Distribuição de Stickers
                        </CardTitle>
                        <CardDescription>Por tipo de sticker</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data?.stickerTypeDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ typeName, percentage }) => `${typeName}: ${percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="quantity"
                                >
                                    {data?.stickerTypeDistribution?.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => [`${value} unidades`, 'Quantidade']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            Escolas
                        </CardTitle>
                        <CardDescription>Total de escolas cadastradas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data?.schoolsCount}</div>
                    </CardContent>
                    <CardContent className="pt-0">
                        <Link to="/schools">
                            <Button variant="outline" className="w-full">
                                <School className="h-4 w-4 mr-2" />
                                Ver Escolas
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Album className="h-5 w-5" />
                            Álbuns
                        </CardTitle>
                        <CardDescription>Total de álbuns disponíveis</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{data?.albumsCount}</div>
                    </CardContent>
                    <CardContent className="pt-0">
                        <Link to="/albums">
                            <Button variant="outline" className="w-full">
                                <Album className="h-4 w-4 mr-2" />
                                Ver Álbuns
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}