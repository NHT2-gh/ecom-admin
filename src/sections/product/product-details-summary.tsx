import { useForm } from 'react-hook-form'
import { useMemo, useEffect } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import { fCurrency } from 'src/utils/format-number'

import FormProvider from 'src/components/hook-form'

import { IProductItem } from 'src/types/product'

// ----------------------------------------------------------------------

type Props = {
    product: IProductItem
}

export default function ProductDetailsSummary({ product, ...other }: Props) {
    const { id, name, price, salePrice, coverUrl, description, inventoryType } =
        product

    const defaultValues = useMemo(
        () => ({
            id,
            name,
            coverUrl,
            salePrice,
            price,
            description,
        }),
        [id, name, coverUrl, salePrice, price, description]
    )

    const methods = useForm({
        defaultValues,
    })

    const { reset, watch, control, setValue, handleSubmit } = methods

    const values = watch()

    useEffect(() => {
        if (product) {
            reset(defaultValues)
        }
    }, [defaultValues, product, reset])

    const renderPrice = (
        <Box sx={{ typography: 'h5' }}>
            {salePrice && (
                <Box
                    component="span"
                    sx={{
                        color: 'text.disabled',
                        textDecoration: 'line-through',
                        mr: 0.5,
                    }}
                >
                    {fCurrency(salePrice)}
                </Box>
            )}

            {fCurrency(price)}
        </Box>
    )

    // const renderColorOptions = (
    //     <Stack direction="row">
    //         <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
    //             Color
    //         </Typography>

    //         <Controller
    //             name="colors"
    //             control={control}
    //             render={({ field }) => (
    //                 <Box
    //                     sx={{
    //                         width: '25px',
    //                         height: '25px',
    //                         borderRadius: '8px',
    //                         bgcolor: field.value,
    //                     }}
    //                 />
    //             )}
    //         />
    //     </Stack>
    // )

    // const renderQuantity = (
    //     <Stack direction="row">
    //         <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
    //             Quantity
    //         </Typography>

    //         <Stack spacing={1}>
    //             <IncrementerButton
    //                 name="quantity"
    //                 quantity={values.quantity}
    //                 disabledDecrease={values.quantity <= 1}
    //                 disabledIncrease={values.quantity >= available}
    //                 onIncrease={() => setValue('quantity', values.quantity + 1)}
    //                 onDecrease={() => setValue('quantity', values.quantity - 1)}
    //             />

    //             <Typography
    //                 variant="caption"
    //                 component="div"
    //                 sx={{ textAlign: 'right' }}
    //             >
    //                 Available: {available}
    //             </Typography>
    //         </Stack>
    //     </Stack>
    // )

    // const renderActions = (
    //     <Stack direction="row" spacing={2}>
    //         <Button
    //             fullWidth
    //             disabled
    //             size="large"
    //             color="warning"
    //             variant="contained"
    //             startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
    //             sx={{ whiteSpace: 'nowrap' }}
    //         >
    //             Add to Cart
    //         </Button>

    //         <Button
    //             fullWidth
    //             size="large"
    //             type="submit"
    //             variant="contained"
    //             disabled
    //         >
    //             Buy Now
    //         </Button>
    //     </Stack>
    // )

    // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    //     <Stack direction="row" alignItems="center" spacing={1}>
    //         {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
    //         {saleLabel.enabled && (
    //             <Label color="error">{saleLabel.content}</Label>
    //         )}
    //     </Stack>
    // )

    const renderInventoryType = (
        <Box
            component="span"
            sx={{
                typography: 'overline',
                color:
                    (inventoryType === 'out of stock' && 'error.main') ||
                    (inventoryType === 'low stock' && 'warning.main') ||
                    'success.main',
            }}
        >
            {inventoryType}
        </Box>
    )

    return (
        <FormProvider methods={methods} onSubmit={() => {}}>
            <Stack spacing={3} sx={{ pt: 3 }} {...other}>
                <Stack spacing={2} alignItems="flex-start">
                    {renderInventoryType}

                    <Typography variant="h5">{name}</Typography>
                    {renderPrice}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>

                <Divider sx={{ borderStyle: 'dashed' }} />
            </Stack>
        </FormProvider>
    )
}
