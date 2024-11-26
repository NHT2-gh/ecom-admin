import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import Stack, { StackProps } from '@mui/material/Stack'

import { RouterLink } from 'src/routes/components'

import Iconify from 'src/components/iconify'
// ----------------------------------------------------------------------

type Props = StackProps & {
    backLink: string
    editLink: string
    liveLink: string
    publish: string
}

export default function ProductDetailsToolbar({
    publish,
    backLink,
    editLink,
    liveLink,
    sx,
    ...other
}: Props) {
    return (
        <Stack
            spacing={1.5}
            direction="row"
            sx={{
                mb: { xs: 3, md: 5 },
                ...sx,
            }}
            {...other}
        >
            <Button
                component={RouterLink}
                href={backLink}
                startIcon={
                    <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                }
            >
                Back
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            {publish === 'published' && (
                <Tooltip title="Go Live">
                    <IconButton component={RouterLink} href={liveLink}>
                        <Iconify icon="eva:external-link-fill" />
                    </IconButton>
                </Tooltip>
            )}

            <Tooltip title="Edit">
                <IconButton component={RouterLink} href={editLink}>
                    <Iconify icon="solar:pen-bold" />
                </IconButton>
            </Tooltip>

            <LoadingButton
                color="inherit"
                variant="contained"
                loading={!publish}
                loadingIndicator="Loading…"
                sx={{ textTransform: 'capitalize', px: 2.5 }}
            >
                {publish}
            </LoadingButton>
        </Stack>
    )
}
