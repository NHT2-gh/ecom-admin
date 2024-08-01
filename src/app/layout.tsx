/* eslint-disable perfectionist/sort-imports */
import 'src/global.css'

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme'
import { LocalizationProvider } from 'src/locales'
import { primaryFont } from 'src/theme/typography'

import ProgressBar from 'src/components/progress-bar'
import { MotionLazy } from 'src/components/animate/motion-lazy'
import SnackbarProvider from 'src/components/snackbar/snackbar-provider'
import { SettingsDrawer, SettingsProvider } from 'src/components/settings'

import { AuthProvider } from 'src/auth/context/jwt'

// ----------------------------------------------------------------------

export const metadata = {
    title: 'Yasa - Dashboard',
    themeColor: '#000000',
    manifest: '/manifest.json',
    viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
}

type Props = {
    children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" className={primaryFont.className}>
            <body>
                <AuthProvider>
                    <LocalizationProvider>
                        <SettingsProvider
                            defaultSettings={{
                                themeMode: 'light', // 'light' | 'dark'
                                themeLayout: 'vertical', // 'vertical' | 'mini'
                                themeColorPresets: 'default', // 'default'
                                themeStretch: false,
                            }}
                        >
                            <ThemeProvider>
                                <MotionLazy>
                                    <SnackbarProvider>
                                        <SettingsDrawer />
                                        <ProgressBar />
                                        {children}
                                    </SnackbarProvider>
                                </MotionLazy>
                            </ThemeProvider>
                        </SettingsProvider>
                    </LocalizationProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
