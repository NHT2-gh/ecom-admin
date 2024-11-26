import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import Iconify from 'src/components/iconify'
import { ORDER_SHIPPING_OPTIONS } from 'src/_mock'

// ----------------------------------------------------------------------

type Props = {
    customerPhone: string
    customerEmail: string
    customerName: string
    delivery: string
    payment: string
    shippingAddress: string
    trackingNumber: string
}

const capitalizeFirstLetter = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export default function OrderDetailsInfo({
    customerPhone,
    customerEmail,
    customerName,
    delivery,
    payment,
    trackingNumber,
    shippingAddress,
}: Props) {
    const renderCustomer = (
        <>
            <CardHeader title="Customer Info" />
            <Stack direction="row" sx={{ p: 3 }}>
                {/* <Avatar
                    alt={customerName}
                    src={customer.avatarUrl}
                    sx={{ width: 48, height: 48, mr: 2 }}
                /> */}

                <Stack
                    spacing={0.5}
                    alignItems="flex-start"
                    sx={{ typography: 'body2' }}
                >
                    <Typography variant="subtitle2">{customerName}</Typography>

                    <Box sx={{ color: 'text.secondary' }}>{customerEmail}</Box>
                </Stack>
            </Stack>
        </>
    )

    const renderDelivery = (
        <>
            <CardHeader title="Delivery" />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row" alignItems="center">
                    <Box
                        component="span"
                        sx={{
                            color: 'text.secondary',
                            width: 120,
                            flexShrink: 0,
                        }}
                    >
                        Ship by
                    </Box>
                    {delivery && delivery === 'standard'
                        ? `${ORDER_SHIPPING_OPTIONS[0].shippingUnit}`
                        : `${ORDER_SHIPPING_OPTIONS[1].shippingUnit}`}
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Box
                        component="span"
                        sx={{
                            color: 'text.secondary',
                            width: 120,
                            flexShrink: 0,
                        }}
                    >
                        Speedy
                    </Box>
                    {capitalizeFirstLetter(delivery)}
                </Stack>
                <Stack direction="row" alignItems="center">
                    <Box
                        component="span"
                        sx={{
                            color: 'text.secondary',
                            width: 120,
                            flexShrink: 0,
                        }}
                    >
                        Tracking No.
                    </Box>
                    <Link underline="always" color="inherit">
                        {trackingNumber}
                    </Link>
                </Stack>
            </Stack>
        </>
    )

    const renderShipping = (
        <>
            <CardHeader title="Shipping" />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row">
                    <Box
                        component="span"
                        sx={{
                            color: 'text.secondary',
                            width: 120,
                            flexShrink: 0,
                        }}
                    >
                        Address
                    </Box>
                    {shippingAddress}
                </Stack>

                <Stack direction="row">
                    <Box
                        component="span"
                        sx={{
                            color: 'text.secondary',
                            width: 120,
                            flexShrink: 0,
                        }}
                    >
                        Phone number
                    </Box>
                    {customerPhone}
                </Stack>
            </Stack>
        </>
    )

    // const renderPayment = (
    //     <>
    //         <CardHeader title="Payment" />
    //         <Stack
    //             direction="row"
    //             alignItems="center"
    //             sx={{ p: 3, typography: 'body2' }}
    //         >
    //             <Box
    //                 component="span"
    //                 sx={{ color: 'text.secondary', flexGrow: 1 }}
    //             >
    //                 Phone number
    //             </Box>

    //             {payment.cardNumber}
    //             <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
    //         </Stack>
    //     </>
    // )

    return (
        <Card>
            {renderCustomer}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderDelivery}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderShipping}

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* {renderPayment} */}
        </Card>
    )
}
