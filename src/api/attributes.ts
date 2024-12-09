import useSWR from 'swr'

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios'

import { IAttribute } from 'src/types/product'

// ----------------------------------------------------------------------

interface IQueryProps {
    page: number
    itemsPerPage: number
}

export function useGetAttributes({ page, itemsPerPage }: IQueryProps) {
    const url = endpoints.attribute.list

    const {
        data: response,
        error,
        isLoading,
        isValidating,
    } = useSWR([url, { params: { page, limit: itemsPerPage } }], fetcher, {
        headers: {
            'Content-Type': 'application/json',
        },
        revalidateOnFocus: false,
        keepPreviousData: true,
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount > 1) return
            if (err.status === 404) return
            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })
    const attributes: IAttribute[] =
        response?.data.data.map((dataItem: IAttribute) => ({
            id: dataItem.id,
            type: dataItem.type,
            displayName: dataItem.displayName,
            displayValues: dataItem.displayValue,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
        })) || []
    return {
        colors: attributes.filter((attribute) => attribute.type === 'color'),
        sizes: attributes.filter((attribute) => attribute.type === 'size'),
        attributesLoading: isLoading,
        attributesError: error,
        attributesValidating: isValidating,
        attributesEmpty: attributes.length === 0,
    }
}

export async function createAttributes(
    data: Omit<IAttribute, 'id' | 'created_at' | 'updated_at'>
) {
    const payload = JSON.stringify({
        displayName: data.displayName,
        displayValue: data.displayValue,
        type: data.type,
    })
    const headers = {
        'Content-Type': 'application/json',
    }
    try {
        const res = await axiosInstance.post(
            endpoints.product.productAttributes,
            payload,
            {
                headers,
            }
        )
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }

        return res.data.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}
