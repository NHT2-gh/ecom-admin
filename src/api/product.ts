import useSWR from 'swr'
import { useMemo } from 'react'

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios'

import { IProductItem } from 'src/types/product'

// ----------------------------------------------------------------------
interface GetProductsProps {
    page: number
    rowsPerPage: number
}

export function useGetProducts({ page, rowsPerPage }: GetProductsProps) {
    const url = endpoints.product.list
    const {
        data: response,
        error,
        isLoading,
        isValidating,
    } = useSWR(
        () => [url, { params: { limit: rowsPerPage * (page + 2) } }],
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onErrorRetry(err, key, config, revalidate, { retryCount }) {
                if (retryCount >= 3) return
                if (err.status === 404) return
                setTimeout(() => revalidate({ retryCount }), 5000)
            },
        }
    )

    const products: IProductItem[] = response?.data?.data.map(
        (dataItem: IProductItem) => ({
            id: dataItem.id,
            gender: dataItem.gender,
            status: dataItem.status,
            category: dataItem.category,
            brand: dataItem.brand,
            priceSale: dataItem.price,
            inventoryType: dataItem.variants ? 'in stock' : 'out of stock',
            images: dataItem.images,
            code: dataItem.id,
            description: dataItem.description,
            name: dataItem.name,
            price: dataItem.price,
            coverUrl: dataItem.images ? dataItem.images[0] : '',
            createdAt: dataItem.created_at,
            updateAt: dataItem.updated_at,
        })
    )

    const memoizedValue = useMemo(
        () => ({
            products: (products as IProductItem[]) || [],
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
            productsEmpty: !false && !products?.length,
        }),
        [error, isLoading, isValidating, response] // eslint-disable-line
    )

    return memoizedValue
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
    const url = endpoints.product.details

    const { data: res, error } = useSWR(`${url}${productId}`, fetcher, {
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount >= 10) return

            if (err.status === 404) return

            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })

    const data = res?.data

    const memoizedValue = useMemo(() => {
        const product: IProductItem | undefined = data
            ? {
                  id: data.id,
                  name: data.name,
                  price: data.price,
                  gender: data.gender,
                  status: data.status,
                  images: data.images || [],
                  category: data.category,
                  brand: data.brand,
                  description: data.description,
                  brandId: data.brandId,
                  categoryId: data.categoryId,
                  inventoryType: 'in stock',
                  salePrice: data.salePrice,
                  createdAt: data.created_at,
                  updatedAt: data.update_at,
                  content: data.content || '',
                  variants: data.variants || [],
              }
            : undefined
        return {
            product,
            error,
        }
    }, [data, error])

    return memoizedValue
}

export async function updateProduct(id: string, data: any) {
    const validGenders = ['male', 'female', 'unisex']

    const gender = Array.isArray(data.gender)
        ? validGenders.find((value) => data.gender.includes(value)) || 'unisex'
        : 'unisex'

    const payload = {
        name: data.name,
        images: data.images.map((image: any) =>
            typeof image === 'string' ? image : image.url
        ),
        gender,
        price: data.price,
        salePrice: data.salePrice,
        status: data.status,
        colors: data.colors || [],
        brandId: data.brandId,
        categoryId: data.categoryId,
        description: data.description,
    }

    try {
        const response = await axiosInstance.patch(
            `${endpoints.product.details}${id}`,
            payload
        )

        if (response.status !== 200) {
            throw new Error(
                `Failed to update product. Status code: ${response.status}`
            )
        }
        return response.data
    } catch (error: any) {
        console.error('Error updating product:', error)
        throw new Error(
            `Exception occurred while updating product: ${
                error.response?.data?.message || error.message
            }`
        )
    }
}

export async function createProduct(
    data: Omit<IProductItem, 'id' | 'createdAt' | 'updatedAt' | 'variants'>
) {
    const payload = JSON.stringify({
        name: data.name,
        images: data.images ? data.images : [],
        gender: data.gender,
        price: data.price,
        salePrice: data.salePrice,
        status: data.status,
        brandId: data.brandId,
        categoryId: data.categoryId,
        content: data.content,
        description: data.description,
    })
    const headers = {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axiosInstance.post(
            endpoints.product.create,
            payload,
            {
                headers,
            }
        )
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }
        return res.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}

export async function deleteProduct(productId: string) {
    try {
        const headers = {
            // Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
        const res = await axiosInstance.delete(
            `${endpoints.product.details}${productId}`,
            { headers }
        )
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}

export async function deleteProducts(productIds: string[]) {
    try {
        const headers = {
            // Authorization: `Bearer ${accessToken}`,
            Accept: '*/*',
        }
        await productIds.map(async (id) => {
            const res = await axiosInstance.delete(
                `${endpoints.product.details}${id}`,
                { headers }
            )
            if (res?.data.error) {
                throw new Error(`Error: ${res.data.error}`)
            }
        })
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}
