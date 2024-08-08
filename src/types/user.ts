// import { CustomFile } from 'src/components/upload'

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
    firstName?: string
    lastName?: string
    password: string
    name: string
    role: string
    email: string
    status: string
    avatar: string
    address: string
    gender: string
    birthday: Date
    phone: string
    createdAt: Date
    updatedAt: Date
    created_at?: Date
    updated_at?: Date
}

export type IUserAccountChangePassword = {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}
