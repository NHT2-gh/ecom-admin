import axios, { AxiosRequestConfig } from 'axios'

import { HOST_API } from 'src/config-global'

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API })

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem('accessToken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong'
        )
)

export default axiosInstance

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
    const [url, config] = Array.isArray(args) ? args : [args]
    const res = await axiosInstance.get(url, { ...config })

    return res.data
}

// ----------------------------------------------------------------------

const VERSION_PREFIX = '/v1'

export const endpoints = {
    auth: {
        me: `${VERSION_PREFIX}/profile`,
        login: `${VERSION_PREFIX}/login`,
        forgotPassword: `${VERSION_PREFIX}/profile`,
    },
    product: {
        create: `${VERSION_PREFIX}/products`,
        list: `${VERSION_PREFIX}/products`,
        details: `${VERSION_PREFIX}/products/`,
        productVariants: `${VERSION_PREFIX}/product-variants`,
        productAttributes: `${VERSION_PREFIX}/product-attributes`,
        search: '',
    },
    image: {
        upload: `${VERSION_PREFIX}/upload-image`,
    },
    brand: {
        create: `${VERSION_PREFIX}/brands`,
        list: `${VERSION_PREFIX}/brands`,
        edit: `${VERSION_PREFIX}/brands/`,
        delete: `${VERSION_PREFIX}/brands/`,
    },
    category: {
        create: `${VERSION_PREFIX}/categories`,
        list: `${VERSION_PREFIX}/categories`,
        edit: `${VERSION_PREFIX}/categories/`,
        delete: `${VERSION_PREFIX}/categories/`,
    },
    attribute: {
        create: `${VERSION_PREFIX}/product-attributes`,
        list: `${VERSION_PREFIX}/product-attributes`,
        edit: `${VERSION_PREFIX}/product-attributes/`,
    },
    order: {
        create: `${VERSION_PREFIX}/carts/make-order`,
        list: `${VERSION_PREFIX}/orders`,
        update: `${VERSION_PREFIX}/orders`,
        details: `${VERSION_PREFIX}/orders/`,
    },
    user: {
        create: `${VERSION_PREFIX}/users`,
        list: `${VERSION_PREFIX}/users`,
        update: `${VERSION_PREFIX}/users`,
        details: `${VERSION_PREFIX}/users/`,
        delete: `${VERSION_PREFIX}/users/`,
    },
}
