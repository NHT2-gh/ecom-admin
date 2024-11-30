import { Controller, useFormContext } from 'react-hook-form'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel, {
    FormControlLabelProps,
    formControlLabelClasses,
} from '@mui/material/FormControlLabel'

// ----------------------------------------------------------------------

interface RHFSingleRadioProps
    extends Omit<FormControlLabelProps, 'control' | 'label'> {
    name: string
    options: { label: string; value: string }[]
    row?: boolean
    helperText?: React.ReactNode
}

export function RHFSingleRadio({
    row,
    name,
    options,
    helperText,
    sx,
    ...other
}: RHFSingleRadioProps) {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset">
                    <RadioGroup
                        row={row}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        sx={{
                            [`& .${formControlLabelClasses.root}`]: {
                                mb: row ? 0 : 1,
                                mr: row ? 2 : 0,
                            },
                            ...sx,
                        }}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={<Radio />}
                                label={option.label}
                                value={option.value}
                                {...other}
                            />
                        ))}
                    </RadioGroup>

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error} sx={{ mx: 0 }}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    )
}
