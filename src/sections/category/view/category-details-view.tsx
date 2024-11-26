'use client'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import { useGetCategory } from 'src/api/category'

import CategoryNewEditForm from '../category-new-edit-form'

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default async function CategoryEditView({ id }: Props) {
    const settings = useSettingsContext()

    const { Category, error } = useGetCategory(id)

    if (Category?.id === undefined) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const currentCategory = Category

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
                        name: 'Category',
                        href: paths.dashboard.category.root,
                    },
                    { name: currentCategory?.name },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <CategoryNewEditForm currentCategory={currentCategory} />
        </Container>
    )
}
