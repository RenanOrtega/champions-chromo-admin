import z from "zod"

export type Album = {
    id: string
    schoolId: string
    name: string
    coverImage: string
    totalStickers: number
    hasA4: boolean
    hasLegend: boolean
    hasCommon: boolean
}

export const albumCreateForm = z.object({
    name: z.string(),
    coverImage: z.string(),
    totalStickers: z.coerce.number().min(1, "Insira um número válido"),
    hasA4: z.boolean(),
    hasLegend: z.boolean(),
    hasCommon: z.boolean(),
})

export const albumUpdateForm = z.object({
    name: z.string(),
    coverImage: z.string(),
    totalStickers: z.coerce.number().min(1, "Insira um número válido"),
    hasA4: z.boolean(),
    hasLegend: z.boolean(),
    hasCommon: z.boolean(),
})

export type AlbumCreateInput = z.infer<typeof albumCreateForm>;
export type AlbumUpdateInput = z.infer<typeof albumUpdateForm>;