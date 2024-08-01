// ----------------------------------------------------------------------

export type IOrderTableFilterValue = string | Date | null

export type IOrderTableFilters = {
    name: string
    status: string
    startDate: Date | null
    endDate: Date | null
}

// ----------------------------------------------------------------------

export type IOrderShippingAddress = {
    fullAddress: string
    phoneNumber: string
}

export type IOrderPayment = {
    cardType: string
    cardNumber: string
}

export type IOrderDelivery = {
    shipBy: string
    speedy: string
    trackingNumber: string
}

export type IOrderCustomer = {
    id: string
    name: string
    email: string
    avatarUrl: string
}

export type IOrderProductItem = {
    id: string
    name: string
    price: number
    coverUrl: string
    quantity: number
}

export type IOrderItem = {
    id: string
    status: string
    shipping: number
    subTotal: number
    orderNumber: string
    totalAmount: number
    totalQuantity: number
    customer: IOrderCustomer
    delivery: IOrderDelivery
    items: IOrderProductItem[]
    createdAt: Date
}
