import { _id } from 'src/_mock/assets'

// ----------------------------------------------------------------------

const MOCK_ID = '30331959-3c59-4127-af0a-6b4a37e1ae75'

const ROOTS = {
    AUTH: '/auth',
    DASHBOARD: '/dashboard',
}

// ----------------------------------------------------------------------

export const paths = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    page403: '/error/403',
    page404: '/error/404',
    page500: '/error/500',

    // AUTH
    auth: {
        jwt: {
            login: `${ROOTS.AUTH}/jwt/login`,
            register: `${ROOTS.AUTH}/jwt/register`,
            forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
        },
    },

    // DASHBOARD
    dashboard: {
        root: ROOTS.DASHBOARD,
        user: {
            root: `${ROOTS.DASHBOARD}/user`,
            new: `${ROOTS.DASHBOARD}/user/new`,
            list: `${ROOTS.DASHBOARD}/user/list`,
            account: `${ROOTS.DASHBOARD}/user/account`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
            demo: {
                edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
            },
        },
        product: {
            root: `${ROOTS.DASHBOARD}/product`,
            new: `${ROOTS.DASHBOARD}/product/new`,
            details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
            demo: {
                details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
                edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
            },
        },
        order: {
            root: `${ROOTS.DASHBOARD}/order`,
            details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
            demo: {
                details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
            },
        },
    },
}
