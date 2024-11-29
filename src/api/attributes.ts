import useSWR from 'swr'
import { useMemo } from 'react'

import { fetcher, endpoints } from 'src/utils/axios'
import { IAttribute } from 'src/types/product'

// ----------------------------------------------------------------------

export function useGetAttributes() {
    const url = endpoints.attribute.list
    const {
        data: response,
        error,
        isLoading,
        isValidating,
    } = useSWR(
        () => [
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem(
                        'accessToken'
                    )}`,
                },
            },
        ],
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            onErrorRetry(err, key, config, revalidate, { retryCount }) {
                if (retryCount > 1) return

                if (err.status === 404) return

                setTimeout(() => revalidate({ retryCount }), 5000)
            },
        }
    )

    const attributes: IAttribute[] = response?.data.data.map(
        (dataItem: IAttribute) => ({
            id: dataItem.id,
            type: dataItem.type,
            displayName: dataItem.displayName,
            displayValues: dataItem.displayValue,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
        })
    )

    const memoizedValue = useMemo(
        () => ({
            attributes: (attributes as IAttribute[]) || [],

            // colors: attributes.filter(
            //     (attribute: IAttribute) => attribute.type === 'color'
            // ),
            // sizes: attributes?.filter(
            //     (attribute: IAttribute) => attribute.type === 'size'
            // ),
            attributesLoading: isLoading,
            attributesError: error,
            attributesValidating: isValidating,
            attributesEmpty: !false && !attributes?.length,
        }),
        [error, isLoading, isValidating, attributes]
    )
    return memoizedValue
}
