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
    product: icon('ic_product'),
    invoice: icon('ic_invoice'),
    ecommerce: icon('ic_ecommerce'),
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
                            {
                                title: 'create',
                                path: paths.dashboard.user.new,
                            },
                            {
                                title: 'edit',
                                path: paths.dashboard.user.demo.edit,
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
                            {
                                title: 'details',
                                path: paths.dashboard.product.demo.details,
                            },
                            {
                                title: 'create',
                                path: paths.dashboard.product.new,
                            },
                            {
                                title: 'edit',
                                path: paths.dashboard.product.demo.edit,
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
                            {
                                title: 'details',
                                path: paths.dashboard.order.demo.details,
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
