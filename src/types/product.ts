// ----------------------------------------------------------------------


export type IProductItem = {
    id: string
    name: string
    code: string
    price: number
    gender: string
    // sizes: string[]
    publish: string
    coverUrl: string
    images: string[]
    colors: string[]
    quantity: number
    category: string
    available: number
    totalSold: number
    description: string
    // totalRatings: number
    // totalReviews: number
    inventoryType: string
    subDescription: string
    priceSale: number | null
    createdAt: Date
    saleLabel: {
        enabled: boolean
        content: string
    }
    newLabel: {
        enabled: boolean
        content: string
    }
}

export type IProductTableFilterValue = string | string[]

export type IProductTableFilters = {
    name: string
    stock: string[]
    publish: string[]
}
