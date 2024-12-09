export const ORDER_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
]

export const ORDER_SHIPPING_OPTIONS = [
    {
        value: 'standard',
        label: 'Standard',
        shippingUnit: 'Giao hàng tiết kiệm',
        price: 30000,
    },
    {
        value: 'free',
        label: 'Free',
        shippingUnit: 'Cửa hàng tự giao',
        price: 0,
    },
]
