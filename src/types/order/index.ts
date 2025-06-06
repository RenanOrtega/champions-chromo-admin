export type OrderSummary = {
    id: string
    schools: SchoolsOrder[]
    totalAlbums: number
    totalStickers: number
    priceTotal: number
}

export type SchoolsOrder = {
    schoolId: string
    albums: AlbumOrder[]
}

export type AlbumOrder = {
    albumId: string
    stickers: StickersOrder[]
}

export type StickersOrder = {
    type: 'a4' | 'common' | 'legend'
    number: string
    quantity: number
}