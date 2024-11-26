import Stack from '@mui/material/Stack'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'

import { useOffSetTop } from 'src/hooks/use-off-set-top'
import { useResponsive } from 'src/hooks/use-responsive'

import { bgBlur } from 'src/theme/css'

import SvgColor from 'src/components/svg-color'

import { NAV, HEADER } from '../config-layout'
import SettingsButton from '../common/settings-button'
import AccountPopover from '../common/account-popover'

// ----------------------------------------------------------------------

type Props = {
    onOpenNav?: VoidFunction
}

export default function Header({ onOpenNav }: Props) {
    const theme = useTheme()

    const lgUp = useResponsive('up', 'lg')

    const offset = useOffSetTop(HEADER.H_DESKTOP)

    const renderContent = (
        <>
            {!lgUp && (
                <IconButton onClick={onOpenNav}>
                    <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
                </IconButton>
            )}

            <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={{ xs: 0.5, sm: 1 }}
            >
                <SettingsButton />

                <AccountPopover />
            </Stack>
        </>
    )

    return (
        <AppBar
            sx={{
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: theme.palette.background.default,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(lgUp && {
                    width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
                    height: HEADER.H_DESKTOP,
                    ...(offset && {
                        height: HEADER.H_DESKTOP_OFFSET,
                    }),
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    px: { lg: 5 },
                }}
            >
                {renderContent}
            </Toolbar>
        </AppBar>
    )
}
