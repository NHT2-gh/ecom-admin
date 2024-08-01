import { _mock } from './_mock'

// ----------------------------------------------------------------------

export const USER_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'banned', label: 'Banned' },
]

export const _userList = [...Array(20)].map((_, index) => ({
    id: _mock.id(index),
    role: _mock.role(Math.round(Math.random() * 2)),
    email: _mock.email(index),
    address: '908 Jack Locks',
    name: _mock.fullName(index),
    isVerified: _mock.boolean(index),
    avatarUrl: '/assets/images/avatar_14.jpg',
    phoneNumber: _mock.phoneNumber(index),
    status: (index % 2 && 'pending') || (index % 3 && 'banned') || 'active',
}))
