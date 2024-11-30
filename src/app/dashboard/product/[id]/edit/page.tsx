import { ProductEditView } from 'src/sections/product/view'
import { _productList } from 'src/_mock'

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: Product Edit',
}

type Props = {
    params: {
        id: string
    }
}

export default function ProductEditPage({ params }: Props) {
    const { id } = params

    return <ProductEditView id={id} />
}

export async function generateStaticParams() {
    return _productList.map((product) => ({
        id: product.id,
    }))
}
