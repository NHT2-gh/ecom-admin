// ----------------------------------------------------------------------

export type SettingsValueProps = {
    themeStretch: boolean
    themeMode: 'light' | 'dark'
    themeLayout: 'vertical' | 'mini'
    themeColorPresets: 'default'
}

export type SettingsContextProps = SettingsValueProps & {
    // Update
    onUpdate: (name: string, value: string | boolean) => void
    // Direction by lang
    onChangeDirectionByLang: (lang: string) => void
    // Reset
    canReset: boolean
    onReset: VoidFunction
    // Drawer
    open: boolean
    onToggle: VoidFunction
    onClose: VoidFunction
}
