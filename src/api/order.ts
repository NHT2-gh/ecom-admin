import { useMemo } from 'react'
import { IOrderItem } from 'src/types/order'
import useSWR from 'swr'
import axios, { endpoints, fetcher } from 'src/utils/axios'
import { status } from 'nprogress'

// ----------------------------------------------------------------------
interface GetOrdersProps {
    page: number
    rowsPerPage: number
}
const accessToken = sessionStorage.getItem('accessToken')

export function useGetOrders({ page, rowsPerPage }: GetOrdersProps) {
    const url = endpoints.order.list

    const {
        data: response,
        error,
        isLoading,
        isValidating,
    } = useSWR(
        () => [
            url,
            {
                params: { limit: rowsPerPage * (page + 2) },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        ],
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

    const orders: IOrderItem[] = response?.data.data.map(
        (dataItem: IOrderItem) => ({
            id: dataItem.id,
            recipientName: `${dataItem.recipientFirstName} ${dataItem.recipientLastName}`,
            items: dataItem.items,
            recipientPhone: dataItem.recipientPhone,
            recipientEmail: dataItem.recipientEmail,
            shippingAddress: dataItem.shippingAddress,
            shippingCity: dataItem.shippingCity,
            shippingMethod: dataItem.shippingMethod,
            shippingStatus: dataItem.status,
            paymentMethod: dataItem.paymentMethod,
            trackingNumber: dataItem.trackingNumber,
            createdAt: dataItem.created_at,
            updatedAt: dataItem.updated_at,
            status: dataItem.status,
            totalItem: dataItem.items.length,
            totalAmount: dataItem.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            ),
        })
    )

    const memoizedValue = useMemo(
        () => ({
            orders: (orders as IOrderItem[]) || [],
            ordersLoading: isLoading,
            ordersError: error,
            ordersValidating: isValidating,
            ordersEmpty: !false && !orders?.length,
        }),
        [response, isLoading, error, isValidating] // eslint-disable-line
    )

    return memoizedValue
}

// ----------------------------------------------------------------------

export async function updateOrder(id: string, statusOrder: string) {
    const payload = JSON.stringify({
        status: statusOrder,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(
            `${endpoints.order.details}${id}`,
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
// ----------------------------------------------------------------------

export function useGetOrder(id: string) {
    const url = endpoints.order.details

    const { data: res, error } = useSWR(`${url}${id}`, fetcher, {
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount >= 10) return

            if (err.status === 404) return

            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })

    const data = res?.data

    const order: IOrderItem | undefined = data
        ? {
              id: data.id,
              recipientName: `${data.recipientFirstName} ${data.recipientLastName}`,
              items: data.items,
              recipientPhone: data.recipientPhone,
              recipientEmail: data.recipientEmail,
              shippingAddress: data.shippingAddress,
              shippingCity: data.shippingCity,
              shippingMethod: data.shippingMethod,
              trackingNumber: data.trackingNumber,
              status: data.status,
              paymentMethod: data.paymentMethod,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              paymentStatus: data.paymentStatus,
              totalItem: data.items.length,
              totalAmount: data.items.reduce(
                  (total: number, item: { price: number; quantity: number }) =>
                      total + item.price * item.quantity,
                  0
              ),
          }
        : undefined

    const memoizedValue = useMemo(
        () => ({
            order,
            error,
        }),
        [data, error] // eslint-disable-line
    )

    return memoizedValue
}

// ----------------------------------------------------------------------
