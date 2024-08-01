'use client'

import Container from '@mui/material/Container'

import { _productList } from 'src/_mock'
import { paths } from 'src/routes/paths'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import { useGetProduct } from 'src/api/product'
import ProductNewEditForm from '../product-new-edit-form'

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default function ProductEditView({ id }: Props) {
    const settings = useSettingsContext()

    const { product } = useGetProduct(id)

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    {
                        name: 'Product',
                        href: paths.dashboard.product.root,
                    },
                    { name: product?.name },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ProductNewEditForm currentProduct={product} />
        </Container>
    )
}
