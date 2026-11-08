export type OrderSummary = {
    id: string
    schools: SchoolsOrder[]
    customer: Customer
    totalAlbums: number
    totalStickers: number
    priceTotal: number
    subtotal?: number
    discount?: number
    couponCode?: string | null
    status: OrderStatus
    statusHistory: OrderStatusChange[]
    paymentStatus: PaymentStatus
    paymentProviderOrderId?: string | null
    paymentExpiresAt?: string | null
    paidAt?: string | null
    createdAt: string
}

export type OrderStatus =
    | 'new'
    | 'awaitingPayment'
    | 'paid'
    | 'inPreparation'
    | 'shipped'
    | 'delivered'
    | 'expired'
    | 'cancelled'
    | 'refunded'

export type PaymentStatus =
    | 'notStarted'
    | 'awaitingPayment'
    | 'paid'
    | 'expired'
    | 'cancelled'
    | 'refunded'

export type OrderStatusChange = {
    status: OrderStatus
    at: string
    by: string
    note?: string | null
}

export type Customer = {
    name: string
    email: string
    address: CustomerAddress
}

export type CustomerAddress = {
    street: string
    number: string
    neighborhood: string
    postalCode: string
    city: string
    state: string
    complement: string
}

export type SchoolsOrder = {
    schoolId: string
    albums: AlbumOrder[]
}

export type AlbumOrder = {
    albumId: string
    albumName: string
    stickers: StickersOrder[]
}

export type StickersOrder = {
    type: 'a4' | 'common' | 'legend'
    number: string
    quantity: number
}