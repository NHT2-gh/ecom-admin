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
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import FormControlLabel from '@mui/material/FormControlLabel'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { fData } from 'src/utils/format-number'

import Label from 'src/components/label'
import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
    RHFTextField,
    RHFUploadAvatar,
} from 'src/components/hook-form'

import { IBrandItem } from 'src/types/brand'
import { uploadImage } from 'src/api/image'
import { createBrand } from 'src/api/brand'

// ----------------------------------------------------------------------

type Props = {
    currentBrand?: IBrandItem
}

export default function BrandNewEditForm({ currentBrand }: Props) {
    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar()

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        image: Yup.mixed<any>().nullable().required('Image is required'),
        status: Yup.string(),
        // isVerified: Yup.boolean(),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentBrand?.name || '',
            status: currentBrand?.status || '',
            image: currentBrand?.image || null,
        }),
        [currentBrand]
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

    const onSubmit = handleSubmit(async ({ name, image }) => {
        try {
            // const fullURL = await uploadImage(image);
            const payload = { data: { name, image: 'image.png' } }
            await createBrand(payload)
            reset()
            enqueueSnackbar(
                currentBrand ? 'Update success!' : 'Create success!'
            )
            router.push(paths.dashboard.brand.list)
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
                setValue('image', newFile, { shouldValidate: true })
            }
        },
        [setValue]
    )

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        {currentBrand && (
                            <Label
                                color={
                                    (values.status === 'active' && 'success') ||
                                    (values.status === 'banned' && 'error') ||
                                    'warning'
                                }
                                sx={{
                                    position: 'absolute',
                                    top: 24,
                                    right: 24,
                                }}
                            >
                                {values.status}
                            </Label>
                        )}

                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="image"
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
                        </Box>
                        {currentBrand && (
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mt: 3 }}
                            >
                                <Button variant="soft" color="error">
                                    Delete Brand
                                </Button>
                            </Stack>
                        )}
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={1}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="name" label="Brand Name" />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                {!currentBrand
                                    ? 'Create Brand'
                                    : 'Save Changes'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
