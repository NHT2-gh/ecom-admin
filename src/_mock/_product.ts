// ----------------------------------------------------------------------

import { color } from 'framer-motion'

export const PRODUCT_GENDER_OPTIONS = [
    { label: 'Men', value: 'male' },
    { label: 'Women', value: 'femail' },
    { label: 'Unisex', value: 'unisex' },
]

export const PRODUCT_CATEGORY_OPTIONS = ['Shose', 'Apparel', 'Accessories']

export const PRODUCT_RATING_OPTIONS = [
    'up4Star',
    'up3Star',
    'up2Star',
    'up1Star',
]

export const PRODUCT_COLOR_OPTIONS = [
    '#00AB55',
    '#000000',
    '#FFFFFF',
    '#FFC0CB',
    '#FF4842',
    '#1890FF',
    '#94D82D',
    '#FFC107',
]

export const PRODUCT_COLOR_NAME_OPTIONS = [
    { value: 'red', label: 'Red', color: '#FF4842' },
    { value: 'blue', label: 'Blue', color: '#1890FF' },
    { value: 'cyan', label: 'Cyan', color: '#00AB55' },
    { value: 'green', label: 'Green', color: '#94D82D' },
    { value: 'yellow', label: 'Yellow', color: '#FFC107' },
    { value: 'violet', label: 'Violet', color: '#FFC0CB' },
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'white', label: 'White', color: '#FFFFFF' },
    { value: 'silver', label: 'Silver', color: '#C0C0C0' },
]

export const PRODUCT_STOCK_OPTIONS = [
    { value: 'in stock', label: 'In stock' },
    { value: 'low stock', label: 'Low stock' },
    { value: 'out of stock', label: 'Out of stock' },
]

export const PRODUCT_PUBLISH_OPTIONS = [
    {
        value: 'active',
        label: 'Active',
    },
    {
        value: 'inactive',
        label: 'Incactive',
    },
]

export const _productDetails = {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    gender: 'Men',
    publish: 'published',
    category: 'Shose',
    available: 72,
    priceSale: null,
    quantity: 80,
    sizes: [
        '6',
        '7',
        '8',
        '8.5',
        '9',
        '9.5',
        '10',
        '10.5',
        '11',
        '11.5',
        '12',
        '13',
    ],
    inventoryType: 'in stock',
    images: [
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
    ],
    tags: ['Shoes'],
    code: '38BEE271',
    description:
        '\n<h6>Specifications</h6>\n<br/>\n<ol>\n  <li>Category</li>\n  <li>Shoes</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Manufacturer</li>\n  <li>Nike</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Serial Number</li>\n  <li>358607726380311</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Ships From</li>\n  <li>United States</li>\n</ol>\n\n<br/>\n<br/>\n\n<h6>Product Details</h6>\n<br/>\n<ul>\n  <li><p>The foam sockliner feels soft and comfortable</p></li>\n  <li><p>Pull tab</p></li>\n  <li><p>Not intended for use as Personal Protective Equipment</p></li>\n  <li><p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p></li>\n  <li><p>Style: 921826-109</p></li>\n  <li><p>Country/Region of Origin: China</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Benefits</h6>\n<br/>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li><p>The foam midsole feels springy and soft.</p></li>\n  <li><p>The rubber outsole adds traction and durability.</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Delivery and Returns</h6>\n<br/>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<br/>\n<ul>\n  <li><p>Standard delivered 4-5 Business Days</p></li>\n  <li><p>Express delivered 2-4 Business Days</p></li>\n</ul>\n<br/>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n',
    newLabel: {
        enabled: true,
        content: 'NEW',
    },
    createdAt: new Date('2024-06-29T11:51:00.060Z'),
    saleLabel: {
        enabled: false,
        content: 'SALE',
    },
    name: 'Foundations Matte Flip Flop',
    price: 97.14,
    coverUrl: '/assets/images/product_2.jpg',
    totalRatings: 3.7,
    totalSold: 684,
    totalReviews: 9124,
    subDescription:
        'Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead.',
    colors: ['#000000', '#FFFFFF'],
}

export const _productList = [...Array(20)].map(() => ({
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
    gender: 'Men',
    publish: 'published',
    category: 'Shose',
    available: 72,
    priceSale: null,
    quantity: 80,
    sizes: [
        '6',
        '7',
        '8',
        '8.5',
        '9',
        '9.5',
        '10',
        '10.5',
        '11',
        '11.5',
        '12',
        '13',
    ],
    inventoryType: 'in stock',
    images: [
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
        '/assets/images/product_2.jpg',
    ],
    tags: ['Shoes'],
    code: '38BEE271',
    description:
        '\n<h6>Specifications</h6>\n<br/>\n<ol>\n  <li>Category</li>\n  <li>Shoes</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Manufacturer</li>\n  <li>Nike</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Serial Number</li>\n  <li>358607726380311</li>\n</ol>\n\n<br/>\n<ol>\n  <li>Ships From</li>\n  <li>United States</li>\n</ol>\n\n<br/>\n<br/>\n\n<h6>Product Details</h6>\n<br/>\n<ul>\n  <li><p>The foam sockliner feels soft and comfortable</p></li>\n  <li><p>Pull tab</p></li>\n  <li><p>Not intended for use as Personal Protective Equipment</p></li>\n  <li><p>Colour Shown: White/Black/Oxygen Purple/Action Grape</p></li>\n  <li><p>Style: 921826-109</p></li>\n  <li><p>Country/Region of Origin: China</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Benefits</h6>\n<br/>\n<ul>\n  <li>\n    <p>Mesh and synthetic materials on the upper keep the fluid look of the OG while adding comfort</p>\n    and durability.\n  </li>\n  <li>\n    <p>Originally designed for performance running, the full-length Max Air unit adds soft, comfortable cushio</p>\n    ning underfoot.\n  </li>\n  <li><p>The foam midsole feels springy and soft.</p></li>\n  <li><p>The rubber outsole adds traction and durability.</p></li>\n</ul>\n\n<br/>\n<br/>\n\n<h6>Delivery and Returns</h6>\n<br/>\n<p>Your order of $200 or more gets free standard delivery.</p>\n<br/>\n<ul>\n  <li><p>Standard delivered 4-5 Business Days</p></li>\n  <li><p>Express delivered 2-4 Business Days</p></li>\n</ul>\n<br/>\n<p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>\n\n',
    newLabel: {
        enabled: true,
        content: 'NEW',
    },
    createdAt: new Date('2024-06-29T11:51:00.060Z'),
    saleLabel: {
        enabled: false,
        content: 'SALE',
    },
    name: 'Foundations Matte Flip Flop',
    price: 97.14,
    coverUrl: '/assets/images/product_2.jpg',
    totalRatings: 3.7,
    totalSold: 684,
    totalReviews: 9124,
    subDescription:
        'Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead.',
    colors: ['#000000', '#FFFFFF'],
}))
