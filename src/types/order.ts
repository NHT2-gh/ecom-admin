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
}

export type IOrderProductItem = {
    id: string
    name: string
    price: number
    image: string
    quantity: number
}

export type IOrderItem = {
    id: string
    status: string
    shippingAddress: string
    shippingCity: string
    recipientFirstName?: string
    recipientLastName?: string
    recipientName: string
    recipientEmail: string
    recipientPhone: string
    shippingMethod: string
    paymentMethod: string
    paymentStatus: string
    trackingNumber: string
    created_at?: Date
    updated_at?: Date
    createdAt: Date
    updatedAt: Date
    totalAmount: number
    totalItem: number
    items: IOrderProductItem[]
}
