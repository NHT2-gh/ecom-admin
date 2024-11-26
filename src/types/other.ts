export enum BaseStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    AVAILABLE = 'available',
    OUTOFSTOCK = 'out_of_stock',
    DELETED = 'deleted',
}

export enum UserStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    INACTIVE = 'inactive',
    BANNED = 'banned',
    DELETED = 'deleted',
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'canceled',
    REFUNDED = 'refunded',
    DELETED = 'deleted',
}

export enum PaymentMethod {
    COD = 'cod',
    ZALO = 'zalo_pay',
}

export enum ShippingMethod {
    FREE = 'free',
    STANDARD = 'standard',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum ProductGender {
    FEMALE = 'female',
    MALE = 'male',
    UNISEX = 'unisex',
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
