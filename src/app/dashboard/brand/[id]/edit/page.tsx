import BrandEditView from 'src/sections/brand/view/brand-details-view'

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: Brand Edit',
}

type Props = {
    params: {
        id: string
    }
}

export default function BrandEditPage({ params }: Props) {
    const { id } = params

    return <BrandEditView id={id} />
}
