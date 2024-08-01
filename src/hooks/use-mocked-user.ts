import { _mock } from 'src/_mock'

// ----------------------------------------------------------------------

export function useMockedUser() {
    const user = {
        id: '8864c717-587d-472a-929a-8e5f298024da-0',
        displayName: 'Jaydon Frankie David',
        email: 'demo@gmail.com',
        password: 'demo1234',
        photoURL: '/assets/images/avatar_14.jpg',
        phoneNumber: '(812) 283-3186',
        address: '6390 Chambersburg RdFayetteville, Pennsylvania(PA), 17222',
        about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
        role: 'admin',
        isPublic: true,
    }

    return { user }
}
