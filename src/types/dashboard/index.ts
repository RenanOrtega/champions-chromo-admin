export type Metrics = {
    albumsCount: number,
    schoolsCount: number,
    orderMetrics: OrderMetrics,
    dailySales: DailySales[],
    stickerTypeDistribution: StickerTypeDistribution[]
}

type OrderMetrics = {
    totalOrders: number,
    totalRevenue: number,
    averageOrderValue: number,
    totalStickersOrdered: number
}

type DailySales = {
    date: Date,
    ordersCount: number,
    revenue: number
}

type StickerTypeDistribution = {
    type: number,
    typeName: string,
    quantity: number,
    percentage: number
}