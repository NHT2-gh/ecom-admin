import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useEffect, useCallback } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Unstable_Grid2'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useResponsive } from 'src/hooks/use-responsive'

import {
    PRODUCT_SIZE_OPTIONS,
    PRODUCT_GENDER_OPTIONS,
    PRODUCT_COLOR_NAME_OPTIONS,
    PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock'

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
    RHFSelect,
    RHFEditor,
    RHFUpload,
    RHFSwitch,
    RHFTextField,
    RHFMultiSelect,
    RHFMultiCheckbox,
} from 'src/components/hook-form'

import { IProductItem } from 'src/types/product'
import { createOrUpdateProduct } from 'src/api/product'
import { ImageItem } from 'src/types/image'
import { uploadImage } from 'src/api/image'

// ----------------------------------------------------------------------

type Props = {
    currentProduct?: IProductItem
}

export default function ProductNewEditForm({ currentProduct }: Props) {
    const router = useRouter()

    const mdUp = useResponsive('up', 'md')

    const { enqueueSnackbar } = useSnackbar()

    const NewProductSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        images: Yup.array().min(1, 'Images is required'),
        category: Yup.string().required('Category is required'),
        price: Yup.number().moreThan(0, 'Price should not be $0.00'),
        description: Yup.string().required('Description is required'),
        // not required
        newLabel: Yup.object().shape({
            enabled: Yup.boolean(),
            content: Yup.string(),
        }),
        saleLabel: Yup.object().shape({
            enabled: Yup.boolean(),
            content: Yup.string(),
        }),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentProduct?.name || '',
            description: currentProduct?.description || '',
            subDescription: currentProduct?.subDescription || '',
            images: currentProduct?.images || [],
            //
            code: currentProduct?.code || '',
            price: currentProduct?.price || 0,
            quantity: currentProduct?.quantity || 0,
            priceSale: currentProduct?.priceSale || 0,
            gender: currentProduct?.gender || '',
            category:
                currentProduct?.category ||
                PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[0],
            colors: currentProduct?.colors || [],
            sizes: currentProduct?.sizes || [],
            newLabel: currentProduct?.newLabel || {
                enabled: false,
                content: '',
            },
            saleLabel: currentProduct?.saleLabel || {
                enabled: false,
                content: '',
            },
        }),
        [currentProduct]
    )

    const methods = useForm({
        resolver: yupResolver(NewProductSchema),
        defaultValues,
    })

    const {
        reset,
        setError,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    const values = watch()

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues)
        }
    }, [currentProduct, defaultValues, reset])

    const onSubmit = handleSubmit(async (data) => {
        const files = values.images
        const isNotUploadImage = files?.some((e: any) => e.id === '')
        if (isNotUploadImage) {
            setError('images', { message: 'all image must be uploaded first' })
            return
        }
        try {
            await createOrUpdateProduct({ data, id: currentProduct?.id })
            reset()
            enqueueSnackbar(
                currentProduct ? 'Update success!' : 'Create success!'
            )
            router.push(paths.dashboard.product.root)
        } catch (error) {
            enqueueSnackbar(
                currentProduct ? 'Update failed!' : 'Create failed!',
                { variant: 'error' }
            )
        }
    })

    const handleUploadImage = useCallback(async () => {
        const files = values.images || []
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
            setValue('images', files)
        } catch (error) {
            throw new Error(`thowo ${JSON.stringify(error)}`)
        }
    }, [setValue, values.images])
    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const files = values.images || []

            const newFiles: ImageItem[] = acceptedFiles.map(
                (file) =>
                    ({
                        id: '',
                        data: Object.assign(file, {
                            preview: URL.createObjectURL(file),
                        }),
                    }) satisfies ImageItem
            )
            setValue('images', [...files, ...newFiles], {
                shouldValidate: true,
            })
        },
        [setValue, values.images]
    )

    const handleRemoveFile = useCallback(
        (inputFile: File | string) => {
            const filtered =
                values.images &&
                values.images?.filter((file) => file.data !== inputFile)
            setValue('images', filtered)
        },
        [setValue, values.images]
    )

    const handleRemoveAllFiles = useCallback(() => {
        setValue('images', [])
    }, [setValue])

    const renderDetails = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Details
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Title, short description, image...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Details" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField name="name" label="Product Name" />

                        <RHFTextField
                            name="subDescription"
                            label="Sub Description"
                            multiline
                            rows={4}
                        />

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Content</Typography>
                            <RHFEditor simple name="description" />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Images</Typography>
                            <RHFUpload
                                multiple
                                thumbnail
                                name="images"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                                onUpload={handleUploadImage}
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    )

    const renderProperties = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Properties
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Additional functions and attributes...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Properties" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="code" label="Product Code" />

                            <RHFTextField
                                name="quantity"
                                label="Quantity"
                                placeholder="0"
                                type="number"
                                InputLabelProps={{ shrink: true }}
                            />

                            <RHFSelect
                                native
                                name="category"
                                label="Category"
                                InputLabelProps={{ shrink: true }}
                            >
                                {PRODUCT_CATEGORY_GROUP_OPTIONS.map(
                                    (category) => (
                                        <optgroup
                                            key={category.group}
                                            label={category.group}
                                        >
                                            {category.classify.map(
                                                (classify) => (
                                                    <option
                                                        key={classify}
                                                        value={classify}
                                                    >
                                                        {classify}
                                                    </option>
                                                )
                                            )}
                                        </optgroup>
                                    )
                                )}
                            </RHFSelect>

                            <RHFMultiSelect
                                checkbox
                                name="colors"
                                label="Colors"
                                options={PRODUCT_COLOR_NAME_OPTIONS}
                            />

                            <RHFMultiSelect
                                checkbox
                                name="sizes"
                                label="Sizes"
                                options={PRODUCT_SIZE_OPTIONS}
                            />
                        </Box>

                        <Stack spacing={1}>
                            <Typography variant="subtitle2">Gender</Typography>
                            <RHFMultiCheckbox
                                row
                                name="gender"
                                spacing={2}
                                options={PRODUCT_GENDER_OPTIONS}
                            />
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Stack direction="row" alignItems="center" spacing={3}>
                            <RHFSwitch
                                name="saleLabel.enabled"
                                label={null}
                                sx={{ m: 0 }}
                            />
                            <RHFTextField
                                name="saleLabel.content"
                                label="Sale Label"
                                fullWidth
                                disabled={!values.saleLabel.enabled}
                            />
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={3}>
                            <RHFSwitch
                                name="newLabel.enabled"
                                label={null}
                                sx={{ m: 0 }}
                            />
                            <RHFTextField
                                name="newLabel.content"
                                label="New Label"
                                fullWidth
                                disabled={!values.newLabel.enabled}
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    )

    const renderPricing = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Pricing
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Price related inputs
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Pricing" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField
                            name="price"
                            label="Regular Price"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            component="span"
                                            sx={{ color: 'text.disabled' }}
                                        >
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <RHFTextField
                            name="priceSale"
                            label="Sale Price"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            component="span"
                                            sx={{ color: 'text.disabled' }}
                                        >
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </Card>
            </Grid>
        </>
    )

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Publish"
                    sx={{ flexGrow: 1, pl: 3 }}
                />

                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                >
                    {!currentProduct ? 'Create Product' : 'Save Changes'}
                </LoadingButton>
            </Grid>
        </>
    )

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {renderDetails}

                {renderProperties}

                {renderPricing}

                {renderActions}
            </Grid>
        </FormProvider>
    )
}
