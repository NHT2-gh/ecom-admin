import axios, { AxiosRequestConfig } from 'axios'

import { HOST_API } from 'src/config-global'

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API })

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
        me: '',
        login: `${VERSION_PREFIX}/login`,
        register: '',
        forgotPassword: '',
    },
    product: {
        list: `${VERSION_PREFIX}/products`,
        details: `${VERSION_PREFIX}/products/`,
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
}
