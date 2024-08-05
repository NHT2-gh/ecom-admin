import { useEffect, useMemo } from 'react'
import { IProductItem } from 'src/types/product'
import { _productDetails, _productList } from 'src/_mock'
import useSWR from 'swr'
import axios, { endpoints, fetcher } from 'src/utils/axios'
import { ACCESS_TOKEN } from 'src/config-global'
import { ca } from 'date-fns/locale'

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
            publish: dataItem.publish,
            category: dataItem.category,
            available: dataItem.quantity,
            priceSale: dataItem.price,
            quantity: dataItem.quantity,
            inventoryType: dataItem.quantity > 0 ? 'in stock' : 'out of stock',
            images: dataItem.images,
            tags: ['Watches'],
            code: dataItem.id,
            description: dataItem.description,
            newLabel: {
                enabled: true,
                content: 'NEW',
            },
            createdAt: new Date(dataItem.created_at),
            saleLabel: {
                enabled: false,
                content: 'SALE',
            },
            name: dataItem.name,
            price: dataItem.price,
            coverUrl: dataItem.images ? dataItem.images[0] : '',
            totalRatings: 3.7,
            totalSold: 684,
            totalReviews: 9124,
            subDescription: dataItem.description,
            colors: ['#000000', '#FFFFFF'],
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

    // const productImages: ImageItem[] = data?.images.map(
    //     (image: any) =>
    //         ({
    //             id: image.id,
    //             data: image.url,
    //         }) satisfies ImageItem
    // )

    const product: IProductItem | undefined = data
        ? {
              id: data.id,
              name: data.name,
              code: data.id,
              price: data.price,
              gender: data.gender,
              // sizes: string[]
              publish: data.publish,
              coverUrl: data.images ? data.images[0] : '',
              images: data.images || [],
              colors: data.colors,
              quantity: data.quantity,
              category: data.category,
              available: data.quantity,
              totalSold: data.quantity,
              description: data.description,
              // totalRatings: number
              // totalReviews: number
              inventoryType: 'in stock',
              subDescription: '',
              priceSale: data.salePrice,
              createdAt: data.created_at,
              saleLabel: {
                  enabled: true,
                  content: 'summber sale',
              },
              newLabel: {
                  enabled: false,
                  content: '',
              },
              created_at: data.created_at,
              update_at: data.updated_at,
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

export async function createOrUpdateProduct({
    data,
    id,
}: {
    data: any
    id?: string
}) {
    const payload = JSON.stringify({
        name: data.name,
        images: data.images.map((image: any) => image.id),
        gender: data.gender,
        price: `${data.price}`,
        salePrice: `${data.priceSale}`,
        status: data.status,
        colors: data.colors,
        quantity: `${data.quantity}`,
        brandId: data.brand.brandId || '0012ef1a-b5b8-4f16-804c-9ecfc112d06b',
        categoryId:
            data.category.categoryId || '01911749-2973-7110-b429-0dbd75465881',
        description: data.description,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    }
    try {
        if (id) {
            const res = await axios.put(
                `${endpoints.product.details}${id}`,
                payload,
                { headers }
            )
            if (res?.data.error) {
                throw new Error(`Error: ${res.data.error}`)
            }
            return res.data
        }

        const res = await axios.post(endpoints.product.list, payload, {
            headers,
        })
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
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            Accept: '*/*',
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
            Authorization: `Bearer ${ACCESS_TOKEN}`,
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
