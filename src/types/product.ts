// ----------------------------------------------------------------------
export type IProductItem = {
    id: string
    name: string
    price: number
    salePrice?: number | null
    gender: string
    coverUrl?: string
    images: File[]
    category?: ICategories
    brand?: IBrand
    brandId: string
    categoryId: string
    description: string
    content: string | null
    inventoryType?: string
    variants: IProductItemVariant[]
    status: string
    createdAt: string
    updatedAt: string
    created_at?: string
    updated_at?: string
}

export type IProductItemVariant = {
    id: string
    name: string
    productId: string
    colorId: string
    sizeId: string
    quantity: number
    created_at: string
    updated_at: string
    color: IAttribute
    size: IAttribute
    isNew?: boolean
}

export type IAttribute = {
    id: string
    type: string
    displayName: string
    displayValue: string
    created_at: string
    updated_at: string
}

export type ICategories = {
    id: string
    name: string
}

export type IBrand = {
    id: string
    name: string
}

export type IProductTableFilterValue = string | string[]

export type IProductTableFilters = {
    name: string
    stock: string[]
    publish: string[]
}

export type IVariantTableFilters = {
    color: string[]
    size: string[]
    quantity: string[]
}
