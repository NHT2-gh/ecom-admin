import axiosInstance, { endpoints } from 'src/utils/axios'

//----------------------------------------------------------------------

export const createProductVariants = async (
    productId: string,
    variants: {
        name: string
        color: string
        size: string
        quantity: number
    }[]
) => {
    try {
        const promises = variants.map((variant) => {
            const payload = {
                productId,
                name: `${variant.color} - ${variant.size}`,
                colorId: variant.color,
                sizeId: variant.size,
                quantity: variant.quantity,
            }

            return axiosInstance.post(
                endpoints.product.productVariants,
                payload
            )
        })

        const results = await Promise.all(promises)
        return results.map((result) => result.data)
    } catch (error: any) {
        console.error('Error processing product variants:', error)
        throw error
    }
}
