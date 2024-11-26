'use client'

import { useState, useEffect, useCallback } from 'react'

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'

import { useSnackbar } from 'notistack'

import { paths } from 'src/routes/paths'

import { updateOrder, useGetOrder } from 'src/api/order'
import { ORDER_STATUS_OPTIONS } from 'src/_mock'

import Iconify from 'src/components/iconify'

import { useSettingsContext } from 'src/components/settings'

import OrderDetailsInfo from '../order-details-info'
import OrderDetailsItems from '../order-details-item'
import OrderDetailsToolbar from '../order-details-toolbar'

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default function OrderDetailsView({ id }: Props) {
    const { order, error } = useGetOrder(id)

    const currentOrder = order

    const settings = useSettingsContext()

    const { enqueueSnackbar } = useSnackbar()

    const [status, setStatus] = useState('')

    useEffect(() => {
        setStatus(currentOrder?.status || '')
    }, [currentOrder])

    const handleChangeStatus = useCallback((newValue: string) => {
        setStatus(newValue)
    }, [])
    if (error) {
        return <div>Error: {error.message}</div>
    }

    const handleOnSubmit = async (statusOrder: string) => {
        const result = updateOrder(id, statusOrder)

        enqueueSnackbar((await result) ? 'Update success!' : 'Update fail!')
    }

    const handleShippingPrice = () => {
        if (currentOrder?.shippingMethod === 'standard') {
            return 30000
        }

        return 0
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <OrderDetailsToolbar
                backLink={paths.dashboard.order.root}
                orderNumber={`# ${(currentOrder?.id.split('-')[4] || '').toString()}`}
                createdAt={currentOrder?.createdAt || new Date()}
                status={status || ''}
                onChangeStatus={handleChangeStatus}
                statusOptions={ORDER_STATUS_OPTIONS}
            />

            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Stack
                        spacing={3}
                        direction={{ xs: 'column-reverse', md: 'column' }}
                    >
                        <OrderDetailsItems
                            items={currentOrder?.items || []}
                            shipping={
                                handleShippingPrice() !== 0
                                    ? handleShippingPrice()
                                    : 0
                            }
                            subTotal={currentOrder?.totalAmount ?? 0}
                            totalAmount={
                                (currentOrder?.totalAmount ?? 0) +
                                handleShippingPrice()
                            }
                        />
                    </Stack>
                </Grid>

                <Grid xs={12} md={4}>
                    <OrderDetailsInfo
                        customerName={currentOrder?.recipientName || ''}
                        customerEmail={currentOrder?.recipientEmail || ''}
                        customerPhone={currentOrder?.recipientPhone || ''}
                        delivery={currentOrder?.shippingMethod || ''}
                        payment={currentOrder?.paymentMethod || ''}
                        shippingAddress={currentOrder?.shippingAddress || ''}
                        trackingNumber={currentOrder?.trackingNumber || ''}
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                color="inherit"
                variant="contained"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => handleOnSubmit(status)}
            >
                Confirm Order
            </Button>
        </Container>
    )
}
