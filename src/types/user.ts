import { CustomFile } from 'src/components/upload'

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[]

export type IUserTableFilters = {
    name: string
    role: string[]
    status: string
}

// ----------------------------------------------------------------------

export type IUserItem = {
    id: string
    name: string
    role: string
    email: string
    status: string
    address: string
    avatarUrl: string
    phoneNumber: string
    isVerified: boolean
}

export type IUserAccount = {
    email: string
    displayName: string
    about: string | null
    address: string | null
    phoneNumber: string | null
    photoURL: CustomFile | string | null
}

export type IUserAccountChangePassword = {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}
