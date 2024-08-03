import { StringNullableChain } from 'lodash'

export type IBrandItem = {
    id: string
    name: string
    image: string
    status: string
    createdAt: Date
    updatedAt: Date
    created_at?: string
    updated_at?: string
}

export type IBrandTableFilters = {
    name: string
    status: string[]
}

export type IBrandTableFilterValue = string | string[]
