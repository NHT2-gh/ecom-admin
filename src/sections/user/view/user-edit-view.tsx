'use client'

import Container from '@mui/material/Container'

import { paths } from 'src/routes/paths'

import { useGetUser } from 'src/api/user'

import { useSettingsContext } from 'src/components/settings'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'

import UserNewEditForm from '../user-new-edit-form'

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default function UserEditView({ id }: Props) {
    const settings = useSettingsContext()

    const { user, error } = useGetUser(id)

    console.log(user)

    if (user?.id === undefined) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const currentUser = user

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
                        name: 'Users',
                        href: paths.dashboard.user.list,
                    },
                    { name: currentUser?.name },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <UserNewEditForm currentUser={currentUser} />
        </Container>
    )
}
