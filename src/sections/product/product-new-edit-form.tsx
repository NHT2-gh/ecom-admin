import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState, useEffect, useCallback } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import { GridRowsProp } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useResponsive } from 'src/hooks/use-responsive'

import { uploadImage } from 'src/api/image'
import { useGetBrands } from 'src/api/brand'
import { useGetCategorys } from 'src/api/category'
import { PRODUCT_GENDER_OPTIONS } from 'src/_mock'
import { createProduct, updateProduct } from 'src/api/product'
import { createProductVariants } from 'src/api/product-variants'

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
    RHFEditor,
    RHFUpload,
    RHFTextField,
    RHFMultiCheckbox,
} from 'src/components/hook-form'

import { IProductItem } from 'src/types/product'

import ProductVariantTable from './product-variant-table'

// ----------------------------------------------------------------------

type Props = {
    currentProduct?: IProductItem
}

export default function ProductNewEditForm({ currentProduct }: Props) {
    const router = useRouter()

    const { categorys } = useGetCategorys({
        page: 1,
        rowsPerPage: 100,
    })

    const { brands } = useGetBrands({
        page: 1,
        rowsPerPage: 100,
    })

    const mdUp = useResponsive('up', 'md')

    const { enqueueSnackbar } = useSnackbar()

    const NewProductSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        images: Yup.array(),
        categoryId: Yup.string().required('Category is required'),
        price: Yup.number()
            .moreThan(0, 'Price should not be $0.00')
            .required('Price is required'),
        content: Yup.string().required('Content is required'),
        description: Yup.string().required('Description is required'),
        brandId: Yup.string().required('Brand is required'),
        status: Yup.string().required('Status is required'),
        salePrice: Yup.number().moreThan(0, 'Sale price should not be $0.00'),
        gender: Yup.array().required('Gender is required'),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentProduct?.name || '',
            content: currentProduct?.content || '',
            description: currentProduct?.description || '',
            images: currentProduct?.images || [],
            price: currentProduct?.price || 0,
            status: currentProduct?.status || 'active',
            salePrice: currentProduct?.salePrice || 0,
            gender: currentProduct?.gender || [],
            categoryId: currentProduct?.category?.id || '',
            brandId: currentProduct?.brand?.id || '',
            variants: currentProduct?.variants || [],
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
        control,
        formState: { isSubmitting },
    } = methods

    const values = watch()

    const [variants, setVariants] = useState<GridRowsProp[]>([])

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues)
        }
    }, [currentProduct, defaultValues, reset])

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentProduct) {
                const productId = await updateProduct(currentProduct.id, data)
                if (variants.length > 0) {
                    // TODO: update variants await updateProductVariants(productId, variants)
                    console.log('variants', variants)
                }
            } else {
                const productId = await createProduct({
                    ...data,
                    images: data.images || [],
                })

                if (variants.length > 0) {
                    const formattedVariants = variants.map((variant) => ({
                        name: 'Variant default',
                        color: (variant as any).color,
                        size: (variant as any).size,
                        quantity: (variant as any).quantity,
                    }))
                    // TODO: await createProductVariants(productId, variants)
                    await createProductVariants(
                        productId.data,
                        formattedVariants
                    )
                }
            }

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
                    if (typeof file !== 'string') {
                        const imageUrl = await uploadImage(file)

                        files[index] = imageUrl
                    }
                })
            )
            setValue('images', files)
            enqueueSnackbar(
                files.length !== 0 ? 'Upload success!' : 'Upload failed!'
            )
        } catch (error) {
            enqueueSnackbar('Upload failed!', { variant: 'error' })
            throw new Error(error)
        }
    }, [setValue, values.images, enqueueSnackbar])

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const files = values.images || []

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
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
                values.images?.filter((file) => file !== inputFile)
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

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Content</Typography>
                            <RHFEditor simple name="content" />
                        </Stack>

                        <RHFTextField
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                        />

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
                            <Controller
                                name="categoryId"
                                control={control}
                                defaultValue={
                                    currentProduct?.category?.id || ''
                                }
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Category"
                                        placeholder="Select Category"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        {categorys.map((category) => (
                                            <MenuItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name="brandId"
                                control={control}
                                defaultValue={currentProduct?.brand?.id || ''}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Brand"
                                        fullWidth
                                        placeholder="Select Brand"
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        {brands.map((brand) => (
                                            <MenuItem
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
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

                        <Stack spacing={1}>
                            <Stack
                                sx={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Variants
                                </Typography>
                            </Stack>

                            <ProductVariantTable
                                onVariantsChange={(newVariants) =>
                                    setVariants(newVariants)
                                }
                                variants={currentProduct?.variants || []}
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
                            name="salePrice"
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
                    control={
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    {...field}
                                    checked={field.value !== 'inactive'}
                                    onChange={(event) =>
                                        field.onChange(
                                            event.target.checked
                                                ? 'active'
                                                : 'inactive'
                                        )
                                    }
                                />
                            )}
                        />
                    }
                    label={values.status === 'active' ? 'Active' : 'Inactive'}
                    sx={{ mr: 'auto' }}
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
