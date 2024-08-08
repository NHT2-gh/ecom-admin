// import { _userList } from 'src/_mock/_user'
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

// export async function generateStaticParams() {
//     return _userList.map((user) => ({
//         id: user.id,
//     }))
// }
