import { _userList } from 'src/_mock/_user'
import CategoryEditView from 'src/sections/category/view/category-details-view'

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: Category Edit',
}

type Props = {
    params: {
        id: string
    }
}

export default function CategoryEditPage({ params }: Props) {
    const { id } = params

    return <CategoryEditView id={id} />
}

export async function generateStaticParams() {
    return _userList.map((user) => ({
        id: user.id,
    }))
}
