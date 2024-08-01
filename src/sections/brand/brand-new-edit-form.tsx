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
import image from 'src/components/image'
import { uploadImage } from 'src/api/image'

// ----------------------------------------------------------------------

type Props = {
    currentBrand?: IBrandItem
}

export default function BrandNewEditForm({ currentBrand }: Props) {
    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar()

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        // tag_line: Yup.string().required('Address is required'),
        // description: Yup.string().required('Address is required'),
        image: Yup.mixed<any>().nullable().required('Avatar is required'),
        // // not required
        status: Yup.string(),
        // isVerified: Yup.boolean(),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentBrand?.name || '',
            // role: currentBrand?.role || '',
            // email: currentBrand?.email || '',
            status: currentBrand?.status || '',
            // tag_line: currentBrand?.tag_line || '',
            // description: currentBrand?.description || '',
            image: currentBrand?.image || null,
            // phoneNumber: currentBrand?.phoneNumber || '',
            // isVerified: currentBrand?.isVerified || true,
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

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500))
            reset()
            enqueueSnackbar(currentBrand ? 'Update success!' : 'Create success!')
            router.push(paths.dashboard.brand.list)
            console.info('DATA', data)
        } catch (error) {
            console.error(error)
        }
    })

    const handleUploadImage = useCallback(async () => {
        const files = values.image || []
        if (files.length === 0) return
        try {
            await Promise.all(
                files.map(async (file, index) => {
                    if (file.id === '') {
                        const imageId = await uploadImage(file.data)
                        files[index].id = imageId
                    }
                })
            )
            setValue('image', files)
        } catch (error) {
            throw new Error(`thowo ${JSON.stringify(error)}`)
        }
    }, [setValue, values.image])

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

                        {/* {currentBrand && (
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
                        )} */}
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
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="name" label="Brand Name" /> 
                            {/* <RHFTextField name="tag_line" label="Tag Line" />    */}
                            
                            {/* <RHFTextField name="role" label="Role" /> */}
                        </Box>
                        
                        <Stack alignItems="flex-end" sx={{ mt: 2 }}> 
                            {/* <RHFTextField name="description" label="Description" /> */}
                            <RHFTextField
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                        />
                        </Stack>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                {!currentBrand ? 'Create Brand' : 'Save Changes'}
                            </LoadingButton>
                        </Stack>

                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    )
}
