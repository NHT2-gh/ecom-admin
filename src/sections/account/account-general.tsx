import * as Yup from 'yup'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

import { useMockedUser } from 'src/hooks/use-mocked-user'

import { fData } from 'src/utils/format-number'

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
    RHFTextField,
    RHFUploadAvatar,
} from 'src/components/hook-form'

// ----------------------------------------------------------------------

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar()

    const { user } = useMockedUser()

    const UpdateUserSchema = Yup.object().shape({
        displayName: Yup.string().required('Name is required'),
        email: Yup.string()
            .required('Email is required')
            .email('Email must be a valid email address'),
        photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
        phoneNumber: Yup.string().required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        about: Yup.string().required('About is required'),
    })

    const defaultValues = {
        displayName: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || null,
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        about: user?.about || '',
    }

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    })

    const {
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500))
            enqueueSnackbar('Update success!')
            console.info('DATA', data)
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
                setValue('photoURL', newFile, { shouldValidate: true })
            }
        },
        [setValue]
    )

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
                        <RHFUploadAvatar
                            name="photoURL"
                            maxSize={3145728}
                            onDrop={handleDrop}
                            helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 3,
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
                            <RHFTextField name="displayName" label="Name" />
                            <RHFTextField name="email" label="Email Address" />
                            <RHFTextField
                                name="phoneNumber"
                                label="Phone Number"
                            />
                            <RHFTextField name="address" label="Address" />
                        </Box>

                        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                            <RHFTextField
                                name="about"
                                multiline
                                rows={4}
                                label="About"
                            />

                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                Save Changes
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
