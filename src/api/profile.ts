import useSWR from 'swr'
import { useMemo } from 'react'

import axios, { fetcher, endpoints } from 'src/utils/axios'

import { IUserItem } from 'src/types/user'

const accessToken = sessionStorage.getItem('accessToken')

// ----------------------------------------------------------------------
export function ViewProfile() {
    const url = endpoints.auth.me
    const { data: response, error } = useSWR(
        () => [
            url,
            {
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

    const data = response?.data

    const user: IUserItem | undefined = data
        ? {
              id: data?.id,
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

export async function updateProfile(data: any, avatarUrl?: string) {
    const payload = JSON.stringify({
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1],
        address: data.address,
        email: data.email,
        avatar: avatarUrl ? `${avatarUrl}` : data.photoURL,
        phone: data.phone,
    })

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    try {
        const res = await axios.patch(`${endpoints.user.update}`, payload, {
            headers,
        })
        if (res?.data.error) {
            throw new Error(`Error: ${res.data.error}`)
        }
        console.log('res', res.data)
        return res.data
    } catch (error) {
        throw new Error(`Exception: ${error}`)
    }
}
