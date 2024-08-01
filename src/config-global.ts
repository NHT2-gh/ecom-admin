import { paths } from 'src/routes/paths'

// API
// ----------------------------------------------------------------------
export const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MDAxZjg2Ni0xNjhlLTRlMWItYjhiNy05ZWJmMzcyMGViMjAiLCJpYXQiOjE3MjE1ODUyMjIsImV4cCI6MTcyMTU4ODgyMn0.FB0QXGdyPuNNQ_wXyjPPr38EyW4wyecy5sWC6mh69QY'
export const HOST_API = process.env.NEXT_PUBLIC_HOST_API
export const ASSETS_API = process.env.NEXT_PUBLIC_ASSETS_API

export const FIREBASE_API = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root // as '/dashboard'
