import { useMemo } from 'react'
import { IProductItem } from 'src/types/product'
import { _productDetails, _productList } from 'src/_mock'
import useSWR from 'swr'
import axios, { endpoints, fetcher } from 'src/utils/axios'
import { ACCESS_TOKEN } from 'src/config-global'

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

    const products: IProductItem[] = response?.data.map((dataItem: IProductItem) => ({
        id: dataItem.id,
        gender: 'Men',
        publish: 'published',
        category: 'Shose',
        available: dataItem.quantity,
        priceSale: dataItem.price,
        quantity: dataItem.quantity,
        inventoryType: 'in stock',
        images: dataItem.images,
        tags: ['Shoes'],
        code: '38BEE271',
        description:
            '\n<h6>Specifications</h6>\n<br/>\n<ol>\n  <li>Category</li>\n  <li>Shoes</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Manufacturer</li>\n  <li>Nike</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Serial Number</li>\n  <li>358607726380311</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Ships From</li>\n  <li>United States</li>\n</ol>\n\n<br/>\n<br/>\n\n<h6>Product Details</h6>\n<br/>\n<ul>\n  <li><p>The foam sockliner feels soft and comfortable</p></li>\n  <li><p>Pull tab</p></li>\n  <li><p>Not intended for use as Personal Protective Equipment</p></li>\n  <li><p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p></li>\n  <li><p>Style: 921826-109</p></li>\n  <li><p>Country/Region of Origin: China</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Benefits</h6>\n<br/>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li><p>The foam midsole feels springy and soft.</p></li>\n  <li><p>The rubber outsole adds traction and durability.</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Delivery and Returns</h6>\n<br/>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<br/>\n<ul>\n  <li><p>Standard delivered 4-5 Business Days</p></li>\n  <li><p>Express delivered 2-4 Business Days</p></li>\n</ul>\n<br/>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n',
        newLabel: {
            enabled: true,
            content: 'NEW',
        },
        createdAt: new Date('2024-06-29T11:51:00.060Z'),
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
    }))

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
              id: data?.id,
              gender: 'Men',
              publish: 'published',
              category: 'Shose',
              available: 0,
              priceSale: data?.price,
              quantity: data?.quantity,
              inventoryType: 'in stock',
              images: data?.images,
              code: '38BEE271',
              description:
                  '\n<h6>Specifications</h6>\n<br/>\n<ol>\n  <li>Category</li>\n  <li>Shoes</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Manufacturer</li>\n  <li>Nike</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Serial Number</li>\n  <li>358607726380311</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Ships From</li>\n  <li>United States</li>\n</ol>\n\n<br/>\n<br/>\n\n<h6>Product Details</h6>\n<br/>\n<ul>\n  <li><p>The foam sockliner feels soft and comfortable</p></li>\n  <li><p>Pull tab</p></li>\n  <li><p>Not intended for use as Personal Protective Equipment</p></li>\n  <li><p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p></li>\n  <li><p>Style: 921826-109</p></li>\n  <li><p>Country/Region of Origin: China</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Benefits</h6>\n<br/>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li><p>The foam midsole feels springy and soft.</p></li>\n  <li><p>The rubber outsole adds traction and durability.</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Delivery and Returns</h6>\n<br/>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<br/>\n<ul>\n  <li><p>Standard delivered 4-5 Business Days</p></li>\n  <li><p>Express delivered 2-4 Business Days</p></li>\n</ul>\n<br/>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n',
              newLabel: {
                  enabled: true,
                  content: 'NEW',
              },
              createdAt: new Date('2024-06-29T11:51:00.060Z'),
              saleLabel: {
                  enabled: false,
                  content: 'SALE',
              },
              name: data?.name,
              price: data?.price,
              coverUrl: data?.images[0],
            //   totalRatings: 3.7,
              totalSold: 684,
            //   totalReviews: 9124,
              subDescription: data?.description,
              colors: ['#000000', '#FFFFFF'],
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
        price: `${data.price}`,
        quantity: `${data.quantity}`,
        brandId: 'ebfabe9a-cf2f-4b44-9e06-700b1ffdc911',
        categoryId: '0012ef1a-b5b8-4f16-804c-9ecfc112d06b',
        description: 'mock description because real one is too long',
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
