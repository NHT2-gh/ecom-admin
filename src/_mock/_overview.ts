import { _mock } from './_mock'

// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = [
    'Total Profit',
    'Total Income',
    'Total Expenses',
].map((label, index) => ({
    label,
    totalAmount: _mock.number.price(index) * 100,
    value: _mock.number.percent(index),
}))
