import { useMemo } from 'react'
import useSWR from 'swr'
import { IUserItem } from 'src/types/user'
import axios, { endpoints, fetcher } from 'src/utils/axios'

interface GetUsersProps {
    page: number
    rowsPerPage: number
}
const accessToken = sessionStorage.getItem('accessToken')

export async function createUser(data: any, urlAvatar: string) {
    const payload = JSON.stringify({
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1],
        phone: data.phone,
        email: data.email,
        password: data.password,
        address: data.address,
        avatar: urlAvatar,
    })
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.post(endpoints.user.create, payload, {
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

export function useGetUsers({ page, rowsPerPage }: GetUsersProps) {
    const url = endpoints.user.list
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

    const user: IUserItem[] = response?.data.data.map(
        (dataItem: IUserItem) => ({
            id: dataItem.id,
            name: `${dataItem.firstName} ${dataItem.lastName}`,
            phone: dataItem.phone,
            role: dataItem.role,
            email: dataItem.email,
            avatar: dataItem.avatar,
            createdAt: dataItem.createdAt,
            updatedAt: dataItem.updatedAt,
            status: dataItem.status,
        })
    )

    const memoizedValue = useMemo(
        () => ({
            users: (user as IUserItem[]) || [],
            usersLoading: isLoading,
            usersError: error,
            usersValidating: isValidating,
            usersEmpty: !false && !user?.length,
        }),
        [response, isLoading, error, isValidating] // eslint-disable-line
    )

    return memoizedValue
}

//---------------------------------------------------------------------

export async function updateUser(id: string, data: any, avatarUrl?: string) {
    const payload = JSON.stringify({
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1],
        status: data.status,
        address: data.address,
        email: data.email,
        avatar: avatarUrl ? `${avatarUrl}` : data.avatarUrl,
        phone: data.phone,
        role: data.role,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(
            `${endpoints.user.update}/${id}`,
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

export function useGetUser(id: string) {
    const url = endpoints.user.details

    const { data: res, error } = useSWR(`${url}${id}`, fetcher, {
        onErrorRetry(err, key, config, revalidate, { retryCount }) {
            if (retryCount >= 10) return

            if (err.status === 404) return

            setTimeout(() => revalidate({ retryCount }), 5000)
        },
    })

    const data = res?.data

    const user: IUserItem | undefined = data
        ? {
              id: data.id,
              name: `${data.firstName} ${data.lastName}`,
              phone: data.phone,
              address: data.address,
              gender: data.gender,
              birthday: data.birthday,
              role: data.role,
              email: data.email,
              avatar: data.avatar,
              updatedAt: data.updated_at,
              createdAt: data.created_at,
              status: data.status,
              password: data.password,
          }
        : undefined

    const memoizedValue = useMemo(
        () => ({
            user,
            error,
        }),
        [data, error] // eslint-disable-line
    )

    return memoizedValue
}

export async function deleteUser(id: string) {
    const url = endpoints.user.delete

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
        console.log('res', res.data)
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}
