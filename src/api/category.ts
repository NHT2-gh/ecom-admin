import { useMemo } from 'react'
import useSWR from 'swr'
import { ICategoryItem } from 'src/types/categorys'
import axios, { endpoints, fetcher } from 'src/utils/axios'
// import { status } from 'nprogress'
import { ACCESS_TOKEN } from 'src/config-global'
import { de } from 'date-fns/locale'
// import { Accordion } from '@mui/material'
// import { da } from 'date-fns/locale'

interface GetCategorysProps {
    page: number
    rowsPerPage: number
}

// const STORAGE_KEY = 'accessToken'
const accessToken = sessionStorage.getItem('accessToken')

export async function createCategory({
    data,
}: {
    data: Omit<ICategoryItem, 'id' | 'status' | 'createdAt' | 'updatedAt'>
}) {
    const payload = JSON.stringify({
        name: data.name,
        description: data.description,
    })
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.post(endpoints.category.create, payload, {
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

export function useGetCategorys({ page, rowsPerPage }: GetCategorysProps) {
    const url = endpoints.category.list
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

    const Categorys: ICategoryItem[] = response?.data.map(
        (dataItem: ICategoryItem) => ({
            id: dataItem.id,
            name: dataItem.name,
            description: dataItem.description,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
            status: dataItem.status,
        })
    )

    const memoizedValue = useMemo(
        () => ({
            categorys: (Categorys as ICategoryItem[]) || [],
            categorysLoading: isLoading,
            categorysError: error,
            categorysValidating: isValidating,
            categorysEmpty: !false && !Categorys?.length,
        }),
        [response, isLoading, error, isValidating] // eslint-disable-line
    )

    return memoizedValue
}

//---------------------------------------------------------------------

export async function updateCategory({
    data,
}: {
    data: Omit<ICategoryItem, 'status' | 'createdAt' | 'updatedAt'>
}) {
    const payload = JSON.stringify({
        id: data.id,
        name: data?.name,
        description: data?.description,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(
            `${endpoints.category.edit}/${data.id}`,
            payload,
            {
                headers,
            }
        )
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }
        console.log('res', res.data)
        return res.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}

//---------------------------------------------------------------------

export function useGetCategory(id: string) {
    const url = endpoints.category.edit

    const { data: res, error } = useSWR(`${url}${id}`, fetcher, {
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount >= 10) return

            if (err.status === 404) return

            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })

    const data = res?.data

    const Category: ICategoryItem | undefined = data
        ? {
              id: data?.id,
              name: data?.name,
              description: data?.description,
              updatedAt: data?.updated_at,
              createdAt: data?.created_at,
              status: data?.status,
          }
        : undefined

    const memoizedValue = useMemo(
        () => ({
            Category,
            error,
        }),
        [data, error] // eslint-disable-line
    )

    return memoizedValue
}

export async function deleteCategory(id: string) {
    const url = endpoints.category.delete

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
