import z from "zod"

export type Album = {
    id: string
    name: string
    coverImage: string
    totalStickers: number
}

export const albumCreateForm = z.object({
    name: z.string(),
    coverImage: z.string(),
    totalStickers: z.coerce.number().min(1, "Insira um número válido"),
})

export type AlbumCreateInput = z.infer<typeof albumCreateForm>;