'use client'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { useGetBrand } from 'src/api/brand'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import BrandNewEditForm from '../brand-new-edit-form'

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default async function BrandEditView({ id }: Props) {
    const settings = useSettingsContext()

    const { brand, error } = useGetBrand(id)

    if (brand?.id === undefined) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }
    const currentBrand = brand

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root,
                    },
                    {
                        name: 'Brand',
                        href: paths.dashboard.brand.root,
                    },
                    { name: currentBrand?.name },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <BrandNewEditForm currentBrand={currentBrand} />
        </Container>
    )
}
