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

export type SchoolCreateInput = z.infer<typeof schoolCreateForm>;

export const schoolsMock: School[] = [
    {
        "id": "67e46b4d335556bea30379bf",
        "name": "Colégio São Paulo",
        "city": "São Paulo",
        "state": "SP"
    }
]