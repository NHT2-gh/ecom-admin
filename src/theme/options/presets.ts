import { alpha } from '@mui/material/styles'

import { primary } from '../palette'

// ----------------------------------------------------------------------

type PresetType = 'default'

export function createPresets(preset: PresetType) {
    const primaryColor = getPrimary(preset)

    const theme = {
        palette: {
            primary: primaryColor,
        },
        customShadows: {
            primary: `0 8px 16px 0 ${alpha(`${primaryColor?.main}`, 0.24)}`,
        },
    }

    return {
        ...theme,
    }
}

// ----------------------------------------------------------------------
export const presetOptions = [{ name: 'default', value: primary.main }]

export function getPrimary(preset: PresetType) {
    return {
        default: primary,
    }[preset]
}
