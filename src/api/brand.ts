import useSWR from 'swr'
import { useMemo } from 'react'

import axios, { fetcher, endpoints } from 'src/utils/axios'

import { IBrandItem } from 'src/types/brand'

interface GetBrandsProps {
    page: number
    rowsPerPage: number
}

const accessToken = sessionStorage.getItem('accessToken')

export async function createBrand({
    data,
}: {
    data: Omit<IBrandItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>
}) {
    const payload = JSON.stringify({
        name: data.name,
        image: data.image,
    })
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.post(endpoints.brand.create, payload, {
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

//---------------------------------------------------------------------

export function useGetBrands({ page, rowsPerPage }: GetBrandsProps) {
    const url = endpoints.brand.list
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

    const brands: IBrandItem[] = response?.data.data.map(
        (dataItem: IBrandItem) => ({
            id: dataItem.id,
            name: dataItem.name,
            image: dataItem.image,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
            status: dataItem.status,
        })
    )

    const memoizedValue = useMemo(
        () => ({
            brands: (brands as IBrandItem[]) || [],
            brandsLoading: isLoading,
            brandsError: error,
            brandsValidating: isValidating,
            brandsEmpty: !false && !brands?.length,
        }),
        [response, isLoading, error, isValidating] // eslint-disable-line
    )

    return memoizedValue
}

//---------------------------------------------------------------------

export async function updateBrand({
    data,
}: {
    data: Omit<IBrandItem, 'status' | 'createdAt' | 'updatedAt'>
}) {
    const payload = JSON.stringify({
        id: data.id,
        name: data?.name,
        image: data?.image,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(
            `${endpoints.brand.edit}/${data.id}`,
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

//---------------------------------------------------------------------

export function useGetBrand(id: string) {
    const url = endpoints.brand.edit

    const { data: res, error } = useSWR(`${url}${id}`, fetcher, {
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount >= 10) return

            if (err.status === 404) return

            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })

    const data = res?.data

    const brand: IBrandItem | undefined = data
        ? {
              id: data?.id,
              name: data?.name,
              image: data?.image,
              updatedAt: data?.updated_at,
              createdAt: data?.created_at,
              status: data?.status,
          }
        : undefined

    const memoizedValue = useMemo(
        () => ({
            brand,
            error,
        }),
        [data, error] // eslint-disable-line
    )

    return memoizedValue
}

export async function deleteBrand(id: string) {
    const url = endpoints.brand.delete

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.delete(`${url}${id}`, {
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
