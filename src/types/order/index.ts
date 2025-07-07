export type OrderSummary = {
    id: string
    schools: SchoolsOrder[]
    customer: Customer
    totalAlbums: number
    totalStickers: number
    priceTotal: number
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