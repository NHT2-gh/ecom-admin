'use client'

import { IProductItem } from 'src/types/product'
import React, { createContext, useState, useContext } from 'react'

interface ProductsContextType {
    products: IProductItem[]
    setProducts: React.Dispatch<React.SetStateAction<IProductItem[]>>
}

const ProductsContext = createContext<ProductsContextType | undefined>(
    undefined
)

export const ProductsProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [products, setProducts] = useState<IProductItem[]>([])

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <ProductsContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = (): ProductsContextType => {
    const context = useContext(ProductsContext)
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider')
    }
    return context
}
