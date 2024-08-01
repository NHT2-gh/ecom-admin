import { StackProps } from '@mui/material/Stack'

// ----------------------------------------------------------------------

export interface ColorPickerProps extends StackProps {
    multi?: boolean
    colors: string[]
    selected: string | string[]
    limit?: 'auto' | number
    onSelectColor: (color: string | string[]) => void
}
