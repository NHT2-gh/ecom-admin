import * as Yup from 'yup'
import { useMemo, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useBoolean } from 'src/hooks/use-boolean'

import { fData } from 'src/utils/format-number'

import { uploadImage } from 'src/api/image'
import { updateUser, createUser, deleteUser } from 'src/api/user'

import Label from 'src/components/label'
import Iconify from 'src/components/iconify'
import { useSnackbar } from 'src/components/snackbar'
import { usePopover } from 'src/components/custom-popover'
import { ConfirmDialog } from 'src/components/custom-dialog'
import FormProvider, {
    RHFTextField,
    RHFUploadAvatar,
} from 'src/components/hook-form'

import { IUserItem } from 'src/types/user'

// ----------------------------------------------------------------------

type Props = {
    currentUser?: IUserItem
}

export default function UserNewEditForm({ currentUser }: Props) {
    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar()

    const confirm = useBoolean()
    const popover = usePopover()

    const password = useBoolean()

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
            .required('Email is required')
            .email('Email must be a valid email address'),
        phone: Yup.string(),
        address: Yup.string(),
        role: Yup.string(),
        avatarUrl: Yup.mixed<any>().nullable(),
        password: Yup.string().required('Password is required'),
        // not required
        status: Yup.string(),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentUser?.name || '',
            role: currentUser?.role || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || 'N/A',
            status: currentUser?.status || '',
            address: currentUser?.address || 'N/A',
            avatarUrl: currentUser?.avatar || null,
            phoneNumber: currentUser?.phone || '',
            password: currentUser?.password || '',
        }),
        [currentUser]
    )

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    })

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const values = watch()

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentUser) {
                if (data.avatarUrl !== currentUser.avatar) {
                    const resUploadImg = await uploadImage(data.avatarUrl)
                    if (resUploadImg != null) {
                        await updateUser(currentUser?.id, data, resUploadImg)
                    }
                } else {
                    await updateUser(currentUser?.id, data)
                }
            } else {
                const urlUploaded = await uploadImage(data.avatarUrl)
                await createUser(data, urlUploaded)
            }
            reset()
            enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!')
            router.push(paths.dashboard.user.list)
        } catch (error) {
            console.error(error)
        }
    })

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
            if (file) {
                setValue('avatarUrl', newFile, { shouldValidate: true })
            }
        },
        [setValue]
    )

    const handleDeleteRow = useCallback(
        (id: string) => {
            deleteUser(id)
            router.push(paths.dashboard.user.list)
            enqueueSnackbar(currentUser ? 'Delete success!' : 'Delete Fail!')
        },
        [currentUser, enqueueSnackbar, router]
    )

    return (
        <>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                            {currentUser && (
                                <Label
                                    color={
                                        (values.status === 'active' &&
                                            'success') ||
                                        (values.status === 'inactive' &&
                                            'error') ||
                                        'warning'
                                    }
                                    sx={{
                                        position: 'absolute',
                                        top: 20,
                                        right: 20,
                                    }}
                                >
                                    {values.status}
                                </Label>
                            )}

                            <Box sx={{ mb: 2 }}>
                                <RHFUploadAvatar
                                    name="avatarUrl"
                                    maxSize={3145728}
                                    onDrop={handleDrop}
                                    helperText={
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 1,
                                                mx: 'auto',
                                                display: 'block',
                                                textAlign: 'center',
                                                color: 'text.disabled',
                                            }}
                                        >
                                            Allowed *.jpeg, *.jpg, *.png, *.gif
                                            <br /> max size of {fData(3145728)}
                                        </Typography>
                                    }
                                />
                            </Box>

                            {currentUser && (
                                <FormControlLabel
                                    labelPlacement="start"
                                    control={
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <Switch
                                                    {...field}
                                                    checked={
                                                        field.value !== 'active'
                                                    }
                                                    onChange={(event) =>
                                                        field.onChange(
                                                            event.target.checked
                                                                ? 'inactive'
                                                                : 'active'
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    }
                                    label={
                                        <>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ mb: 0.5 }}
                                            >
                                                Banned
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                Apply disable account
                                            </Typography>
                                        </>
                                    }
                                    sx={{
                                        mx: 0,
                                        mb: 3,
                                        width: 1,
                                        justifyContent: 'space-between',
                                    }}
                                />
                            )}
                            {currentUser && (
                                <Stack
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ mt: 1 }}
                                >
                                    <Button
                                        variant="soft"
                                        color="error"
                                        onClick={() => {
                                            confirm.onTrue()
                                            popover.onClose()
                                        }}
                                    >
                                        Delete User
                                    </Button>
                                </Stack>
                            )}
                        </Card>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                <RHFTextField name="name" label="Full Name" />
                                <RHFTextField
                                    name="email"
                                    label="Email Address"
                                />
                                <RHFTextField
                                    name="phone"
                                    label="Phone Number"
                                />
                                <RHFTextField name="address" label="Address" />
                                {currentUser && (
                                    <RHFTextField name="role" label="Role" />
                                )}
                                <RHFTextField
                                    name="password"
                                    label="Password"
                                    type={password.value ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={password.onToggle}
                                                    edge="end"
                                                >
                                                    <Iconify
                                                        icon={
                                                            password.value
                                                                ? 'solar:eye-bold'
                                                                : 'solar:eye-closed-bold'
                                                        }
                                                    />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    loading={isSubmitting}
                                >
                                    {!currentUser
                                        ? 'Create User'
                                        : 'Save Changes'}
                                </LoadingButton>
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>
            {currentUser && (
                <ConfirmDialog
                    open={confirm.value}
                    onClose={confirm.onFalse}
                    title="Delete"
                    content="Are you sure want to delete?"
                    action={
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                handleDeleteRow(currentUser.id)
                                confirm.onFalse()
                            }}
                        >
                            Delete
                        </Button>
                    }
                />
            )}
        </>
    )
}
