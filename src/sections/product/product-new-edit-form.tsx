import * as Yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useEffect, useCallback, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    Tooltip,
} from '@mui/material'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'

import { useResponsive } from 'src/hooks/use-responsive'

import { fCurrency } from 'src/utils/format-number'

import { uploadImage } from 'src/api/image'
import { useGetBrands } from 'src/api/brand'
import { useGetCategorys } from 'src/api/category'
import { PRODUCT_GENDER_OPTIONS } from 'src/_mock'
import { createProduct, updateProduct } from 'src/api/product'

import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'
import { useSnackbar } from 'src/components/snackbar'
import FormProvider, {
    RHFEditor,
    RHFUpload,
    RHFTextField,
    RHFMultiCheckbox,
} from 'src/components/hook-form'
import {
    useTable,
    emptyRows,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
} from 'src/components/table'

import { IProductItem, IProductItemVariant } from 'src/types/product'

import ProductVariantTableRow from './product-variant-table-row'
import TableRowEmpty from './product-variant-table-row-empty'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'color', label: 'Color', width: 90 },
    { id: 'size', label: 'Size', width: 90 },
    { id: 'quantity', label: 'Quantity', width: 90 },
    { id: 'created_at', label: 'Created At', width: 90 },
    { id: 'updated_at', label: 'Updated At', width: 90 },
]

type Props = {
    currentProduct?: IProductItem
}

export default function ProductNewEditForm({ currentProduct }: Props) {
    const router = useRouter()
    const table = useTable()
    const [tableData, setTableData] = useState<IProductItemVariant[]>([])
    const denseHeight = table.dense ? 60 : 80

    useEffect(() => {
        if (currentProduct) {
            setTableData(currentProduct.variants)
        }
    }, [currentProduct])

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
        images: Yup.array().min(1, 'Images is required'),
        category: Yup.string().required('Category is required'),
        price: Yup.number().moreThan(0, 'Price should not be $0.00'),
        description: Yup.string().required('Description is required'),
        brand: Yup.string().required('Brand is required'),
        publish: Yup.string(),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentProduct?.name || '',
            description: currentProduct?.description || '',
            images: currentProduct?.images || [],
            price: currentProduct?.price || 0,
            publish: currentProduct?.status || 'active',
            priceSale: currentProduct?.salePrice || 0,
            gender: currentProduct?.gender || '',
            category: currentProduct?.category?.id || '',
            brand: currentProduct?.brand?.id || '',
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

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues)
        }
    }, [currentProduct, defaultValues, reset])

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentProduct) {
                await updateProduct(currentProduct.id, data)
            } else {
                await createProduct(data)
            }

            reset()
            enqueueSnackbar(
                currentProduct ? 'Update success!' : 'Create success!'
            )
            router.push(paths.dashboard.product.root)
        } catch (error) {
            console.log('error', error)
            enqueueSnackbar(
                currentProduct ? 'Update failed!' : 'Create failed!',
                { variant: 'error' }
            )
        }
    })

    const handleAddVariant = () => {}

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
            enqueueSnackbar('Upload failed!')

            throw new Error(`thowo ${JSON.stringify(error)}`)
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
                            <Controller
                                name="category"
                                control={control}
                                defaultValue={
                                    currentProduct?.category?.id || ''
                                }
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Category"
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
                                name="brand"
                                control={control}
                                defaultValue={currentProduct?.brand?.id || ''}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Brand"
                                        fullWidth
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

                                <Button
                                    type="button"
                                    variant="contained"
                                    size="small"
                                    onClick={handleAddVariant}
                                    sx={{ gap: 0.5 }}
                                >
                                    <Iconify icon="eva:plus-fill" /> Add Variant
                                </Button>
                            </Stack>

                            <Card>
                                <TableContainer
                                    sx={{
                                        position: 'relative',
                                        overflow: 'unset',
                                        width: '100%',
                                    }}
                                >
                                    <TableSelectedAction
                                        dense={table.dense}
                                        numSelected={table.selected.length}
                                        rowCount={tableData.length}
                                        onSelectAllRows={(checked) =>
                                            table.onSelectAllRows(
                                                checked,
                                                tableData.map((row) => row.id)
                                            )
                                        }
                                        action={
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    color="primary"
                                                    // onClick={confirm.onTrue}
                                                >
                                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    />

                                    <Scrollbar>
                                        <Table
                                            size={
                                                table.dense ? 'small' : 'medium'
                                            }
                                            sx={{ minWidth: 700 }}
                                        >
                                            <TableHeadCustom
                                                order={table.order}
                                                orderBy={table.orderBy}
                                                headLabel={TABLE_HEAD}
                                                rowCount={tableData.length}
                                                numSelected={
                                                    table.selected.length
                                                }
                                                onSort={table.onSort}
                                                onSelectAllRows={(checked) =>
                                                    table.onSelectAllRows(
                                                        checked,
                                                        tableData.map(
                                                            (row) => row.id
                                                        )
                                                    )
                                                }
                                            />

                                            <TableBody>
                                                {tableData.map((row) => (
                                                    <ProductVariantTableRow
                                                        key={row.id}
                                                        row={row}
                                                        selected={table.selected.includes(
                                                            row.id
                                                        )}
                                                        onSelectRow={() =>
                                                            table.onSelectRow(
                                                                row.id
                                                            )
                                                        }
                                                        canEdit={false}
                                                    />
                                                ))}

                                                <TableEmptyRows
                                                    height={denseHeight}
                                                    emptyRows={emptyRows(
                                                        table.page,
                                                        table.rowsPerPage,
                                                        tableData.length
                                                    )}
                                                />
                                            </TableBody>
                                        </Table>
                                    </Scrollbar>
                                </TableContainer>
                            </Card>
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
                    control={
                        <Controller
                            name="publish"
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
                    label={values.publish === 'active' ? 'Active' : 'Inactive'}
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
