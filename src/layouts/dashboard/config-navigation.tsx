import { useMemo } from 'react'

import { paths } from 'src/routes/paths'

import SvgColor from 'src/components/svg-color'

// ----------------------------------------------------------------------

const icon = (name: string) => (
    <SvgColor
        src={`/assets/icons/navbar/${name}.svg`}
        sx={{ width: 1, height: 1 }}
    />
    // OR
    // <Iconify icon="fluent:mail-24-filled" />
    // https://icon-sets.iconify.design/solar/
    // https://www.streamlinehq.com/icons
)

const ICONS = {
    blog: icon('ic_blog'),
    user: icon('ic_user'),
    order: icon('ic_order'),
    product: icon('ic_heart'),
    invoice: icon('ic_invoice'),
    ecommerce: icon('ic_ecommerce'),
    brand: icon('ic_brand'),
    category: icon('ic_category'),
}

// ----------------------------------------------------------------------

export function useNavData() {
    const data = useMemo(
        () => [
            // OVERVIEW
            // ----------------------------------------------------------------------
            {
                subheader: 'overview',
                items: [
                    {
                        title: 'ecommerce',
                        path: paths.dashboard.root,
                        icon: ICONS.ecommerce,
                    },
                ],
            },

            // MANAGEMENT
            // ----------------------------------------------------------------------
            {
                subheader: 'management',
                items: [
                    // USER
                    {
                        title: 'user',
                        path: paths.dashboard.user.root,
                        icon: ICONS.user,
                        children: [
                            {
                                title: 'list',
                                path: paths.dashboard.user.list,
                            },
                        ],
                    },

                    // PRODUCT
                    {
                        title: 'product',
                        path: paths.dashboard.product.root,
                        icon: ICONS.product,
                        children: [
                            {
                                title: 'list',
                                path: paths.dashboard.product.root,
                            },
                        ],
                    },

                    // ORDER
                    {
                        title: 'order',
                        path: paths.dashboard.order.root,
                        icon: ICONS.order,
                        children: [
                            {
                                title: 'list',
                                path: paths.dashboard.order.root,
                            },
                        ],
                    },

                    // BRAND
                    {
                        title: 'brand',
                        path: paths.dashboard.brand.root,
                        icon: ICONS.brand,
                        children: [
                            {
                                title: 'list',
                                path: paths.dashboard.brand.list,
                            },
                        ],
                    },

                    // CATEGORY
                    {
                        title: 'category',
                        path: paths.dashboard.category.root,
                        icon: ICONS.category,
                        children: [
                            {
                                title: 'list',
                                path: paths.dashboard.category.list,
                            },
                        ],
                    },
                ],
            },
        ],
        []
    )

    return data
}
