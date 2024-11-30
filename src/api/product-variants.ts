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

export async function updateProductVariant(id: string, data: any) {
    const payload = {
        name: data.name,
        colorId: data.colorId,
        sizeId: data.sizeId,
        quantity: data.quantity,
    }

    try {
        const url = `${endpoints.product.productVariants}/${id}`

        const response = await axiosInstance.patch(url, payload)

        if (response.status !== 200) {
            throw new Error(
                `Failed to update product variant. Status code: ${response.status}`
            )
        }

        return response.data
    } catch (error: any) {
        console.error('Error updating product variant:', error)
        throw new Error(
            `Exception occurred while updating product variant: ${
                error.response?.data?.message || error.message
            }`
        )
    }
}
