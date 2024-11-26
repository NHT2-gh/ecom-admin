// ----------------------------------------------------------------------

import { BaseStatus } from './other'

export type IProductItem = {
    id: string
    name: string
    price: number
    salePrice: number | null
    gender: string
    coverUrl: string
    images: Array<string | File>
    category: ICategories
    brand: IBrand
    description: string
    content: string | null
    inventoryType: string
    variants: IProductItemVariant[]
    status: BaseStatus
    createdAt: string
    created_at: string
    update_at: string
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
    color: IColor
    size: ISize
}

export type IColor = {
    id: string
    type: string
    displayName: string
    displayValue: string
    created_at: string
    updated_at: string
}

export type ISize = {
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
