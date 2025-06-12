"use client"

import { z } from "zod"

export type School = {
    id: string
    name: string
    city: string
    state: string
    warning: string
    bgWarningColor: string
    shippingCost: number
    imageUrl: string
}

export const schoolCreateForm = z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
    shippingCost: z.coerce.number(),
    imageUrl: z.string().optional()
})

export const schoolUpdateForm = z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
    warning: z.string(),
    bgWarningColor: z.string(),
    shippingCost: z.coerce.number(),
    imageUrl: z.string()
})

export type SchoolCreateInput = z.infer<typeof schoolCreateForm>;
export type SchoolUpdateInput = z.infer<typeof schoolUpdateForm>;