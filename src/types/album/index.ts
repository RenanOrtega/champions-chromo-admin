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
    a4Price: number,
    legendPrice: number,
    commonPrice: number
}

export const albumCreateForm = z.object({
    name: z.string(),
    coverImage: z.string(),
    totalStickers: z.coerce.number().min(1, "Insira um número válido"),
    hasA4: z.boolean(),
    hasLegend: z.boolean(),
    hasCommon: z.boolean(),
    a4Price: z.coerce.number(),
    legendPrice: z.coerce.number(),
    commonPrice: z.coerce.number()
})

export const albumUpdateForm = z.object({
    name: z.string(),
    coverImage: z.string(),
    totalStickers: z.coerce.number().min(1, "Insira um número válido"),
    hasA4: z.boolean(),
    hasLegend: z.boolean(),
    hasCommon: z.boolean(),
    a4Price: z.coerce.number(),
    legendPrice: z.coerce.number(),
    commonPrice: z.coerce.number()
})

export type AlbumCreateInput = z.infer<typeof albumCreateForm>;
export type AlbumUpdateInput = z.infer<typeof albumUpdateForm>;