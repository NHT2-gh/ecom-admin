export type ICategoryItem = {
    id: string
    name: string
    status: string
    description: string
    createdAt: Date
    updatedAt: Date
    created_at?: string
    updated_at?: string
}

export type ICategoryTableFilters = {
    name: string
    status: string[]
}

export type ICategoryTableFilterValue = string | string[]
