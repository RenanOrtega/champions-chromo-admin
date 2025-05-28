import z from "zod"

export type Cupom = {
    id: string
    code: string
    type: 'percent' | 'fixed' | 'freeShipping'
    value: number
    usageLimit: number
    usedCount: number
    expiresAt: Date
    minPurchaseValue: number
    isActive: boolean
}

export const cupomCreateForm = z.object({
    code: z.string(),
    type: z.string(),
    value: z.coerce.number(),
    usageLimit: z.coerce.number(),
    minPurchaseValue: z.coerce.number(),
    isActive: z.boolean()
});

export const cupomUpdateForm = z.object({
    type: z.string(),
    value: z.coerce.number(),
    usageLimit: z.coerce.number(),
    minPurchaseValue: z.coerce.number(),
    isActive: z.boolean()
});

export type CupomCreateInput = z.infer<typeof cupomCreateForm>;
export type CupomUpdateInput = z.infer<typeof cupomUpdateForm>;