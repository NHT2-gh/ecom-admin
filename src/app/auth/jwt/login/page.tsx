import { JwtLoginView } from 'src/sections/auth/jwt'

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Dashboard: Login',
}

export default function LoginPage() {
    return <JwtLoginView />
}
