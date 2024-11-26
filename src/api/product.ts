import useSWR from 'swr'
import { useMemo } from 'react'

import axios, { fetcher, endpoints } from 'src/utils/axios'

import { IProductItem } from 'src/types/product'
import { create } from 'lodash'

// ----------------------------------------------------------------------
interface GetProductsProps {
    page: number
    rowsPerPage: number
}
const accessToken = sessionStorage.getItem('accessToken')

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
                if (retryCount >= 10) return

                if (err.status === 404) return

                setTimeout(() => revalidate({ retryCount }), 5000)
            },
        }
    )
    // const products = response.data.data
    const products: IProductItem[] = response?.data?.data.map(
        (dataItem: IProductItem) => ({
            id: dataItem.id,
            gender: dataItem.gender,
            status: dataItem.status,
            category: dataItem.category,
            brand: dataItem.brand,
            priceSale: dataItem.price,
            // inventoryType: dataItem.quantity > 0 ? 'in stock' : 'out of stock',
            images: dataItem.images,
            code: dataItem.id,
            description: dataItem.description,
            name: dataItem.name,
            price: dataItem.price,
            coverUrl: dataItem.images ? dataItem.images[0] : '',
            createdAt: dataItem.created_at,
            updateAt: dataItem.update_at,
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
        [response, isLoading, error, isValidating] // eslint-disable-line
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

    const product: IProductItem | undefined = data
        ? {
              id: data.id,
              name: data.name,
              price: data.price,
              gender: data.gender,
              status: data.status,
              coverUrl: data.images ? data.images[0] : '',
              images: data.images || [],
              category: data.category,
              brand: data.brand,
              description: data.description,
              inventoryType: 'in stock',
              salePrice: data.salePrice,
              createdAt: data.created_at,
              created_at: data.created_at,
              update_at: data.updated_at,
              content: data.content || '',
              variants: data.variants || [],
          }
        : undefined

    const memoizedValue = useMemo(
        () => ({
            product,
            error,
        }),
        [data, error] // eslint-disable-line
    )

    return memoizedValue
}

export async function updateProduct(id: string, data: any) {
    const payload = JSON.stringify({
        name: data.name,
        images: data.images.map((image: any) => image),
        gender: data.gender,
        price: `${data.price}`,
        salePrice: `${data.priceSale}`,
        status: data.publish,
        colors: data.colors[0],
        quantity: `${data.quantity}`,
        brandId: data.brand.brandId || '',
        categoryId: data.category.categoryId || '',
        description: data.description,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(
            `${endpoints.product.details}${id}`,
            payload,
            { headers }
        )
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }
        return res.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}

export async function createProduct(data: any) {
    const payload = JSON.stringify({
        name: data.name,
        images: data.images,
        gender: data.gender[0],
        price: `${data.price}`,
        salePrice: `${data.priceSale}`,
        status: data.status,
        colors: data.colors[0],
        quantity: `${data.quantity}`,
        brandId: data.brand,
        categoryId: data.category,
        description: data.description,
    })

    console.log('payload', payload)
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.post(endpoints.product.create, payload, {
            headers,
        })
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }

        console.log(res.data)
        return res.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}

export async function deleteProduct(productId: string) {
    try {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
        const res = await axios.delete(
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
            Authorization: `Bearer ${accessToken}`,
            Accept: '*/*',
        }
        await productIds.map(async (id) => {
            const res = await axios.delete(
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
