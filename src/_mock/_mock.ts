import { sub } from 'date-fns'

import {
    _id,
    _roles,
    _prices,
    _emails,
    _percents,
    _booleans,
    _fullNames,
    _fullAddress,
    _phoneNumbers,
    _productNames,
} from './assets'

// ----------------------------------------------------------------------

export const _mock = {
    id: (index: number) => _id[index],
    time: (index: number) => sub(new Date(), { days: index, hours: index }),
    boolean: (index: number) => _booleans[index],
    role: (index: number) => _roles[index],
    // Text
    productName: (index: number) => _productNames[index],
    // Contact
    email: (index: number) => _fullNames[index],
    phoneNumber: (index: number) => _phoneNumbers[index],
    fullAddress: (index: number) => _fullAddress[index],
    // Name
    fullName: (index: number) => _fullNames[index],
    // Number
    number: {
        percent: (index: number) => _percents[index],
        price: (index: number) => _prices[index],
    },
}
