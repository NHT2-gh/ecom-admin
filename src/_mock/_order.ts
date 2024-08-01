import { _mock } from './_mock'

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
]

const ITEMS = [...Array(3)].map((_, index) => ({
    id: _mock.id(index),
    quantity: index + 1,
    name: _mock.productName(index),
    coverUrl: '/assets/images/product_2.jpg',
    price: _mock.number.price(index),
}))

export const _orders = [...Array(20)].map((_, index) => {
    const shipping = 10

    const items =
        (index % 2 && ITEMS.slice(0, 1)) ||
        (index % 3 && ITEMS.slice(1, 3)) ||
        ITEMS

    const totalQuantity = items.reduce(
        (accumulator, item) => accumulator + item.quantity,
        0
    )

    const subTotal = items.reduce(
        (accumulator, item) => accumulator + item.price * item.quantity,
        0
    )

    const totalAmount = subTotal - shipping

    const customer = {
        id: _mock.id(index),
        name: _mock.fullName(index),
        email: _mock.email(index),
        avatarUrl: '/assets/images/avatar_14.jpg',
        ipAddress: '192.158.1.38',
    }

    const delivery = {
        shipBy: 'DHL',
        speedy: 'Standard',
        trackingNumber: 'SPX037739199373',
    }

    const history = {
        orderTime: _mock.time(1),
        paymentTime: _mock.time(2),
        deliveryTime: _mock.time(3),
        completionTime: _mock.time(4),
        timeline: [
            { title: 'Delivery successful', time: _mock.time(1) },
            { title: 'Transporting to [2]', time: _mock.time(2) },
            { title: 'Transporting to [1]', time: _mock.time(3) },
            {
                title: 'The shipping unit has picked up the goods',
                time: _mock.time(4),
            },
            { title: 'Order has been created', time: _mock.time(5) },
        ],
    }

    return {
        id: _mock.id(index),
        orderNumber: `#601${index}`,
        createdAt: _mock.time(index),
        items,
        history,
        subTotal,
        shipping,
        customer,
        delivery,
        totalAmount,
        totalQuantity,
        shippingAddress: {
            fullAddress:
                '6390 Chambersburg RdFayetteville, Pennsylvania(PA), 17222',
            phoneNumber: '(812) 283-3186',
        },
        payment: {
            cardType: 'mastercard',
            cardNumber: '**** **** **** 5678',
        },
        status:
            (index % 2 && 'completed') ||
            (index % 3 && 'pending') ||
            (index % 4 && 'cancelled') ||
            'refunded',
    }
})
