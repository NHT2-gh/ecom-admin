// ----------------------------------------------------------------------

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
            root: `${ROOTS.DASHBOARD}/user/list`,
            new: `${ROOTS.DASHBOARD}/user/new`,
            list: `${ROOTS.DASHBOARD}/user/list`,
            account: `${ROOTS.DASHBOARD}/user/account`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
        },
        product: {
            root: `${ROOTS.DASHBOARD}/product`,
            new: `${ROOTS.DASHBOARD}/product/new`,
            details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
        },

        order: {
            root: `${ROOTS.DASHBOARD}/order`,
            details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
        },
        brand: {
            root: `${ROOTS.DASHBOARD}/brand`,
            list: `${ROOTS.DASHBOARD}/brand/list`,
            new: `${ROOTS.DASHBOARD}/brand/new`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/brand/${id}/edit`,
        },
        category: {
            root: `${ROOTS.DASHBOARD}/category`,
            list: `${ROOTS.DASHBOARD}/category/list`,
            new: `${ROOTS.DASHBOARD}/category/new`,
            edit: (id: string) => `${ROOTS.DASHBOARD}/category/${id}/edit`,
        },
    },
}
