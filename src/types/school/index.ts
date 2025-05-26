"use client"

import { z } from "zod"

export type School = {
    id: string
    name: string
    city: string
    state: string
}

export const schoolCreateForm = z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
})

export const schoolUpdateForm = z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
})

export type SchoolCreateInput = z.infer<typeof schoolCreateForm>;
export type SchoolUpdateInput = z.infer<typeof schoolUpdateForm>;