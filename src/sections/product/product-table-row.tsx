import { format } from 'date-fns'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import LinearProgress from '@mui/material/LinearProgress'

import { useBoolean } from 'src/hooks/use-boolean'

import { fCurrency } from 'src/utils/format-number'

import Label from 'src/components/label'
import Iconify from 'src/components/iconify'
import { ConfirmDialog } from 'src/components/custom-dialog'
import CustomPopover, { usePopover } from 'src/components/custom-popover'

import { IProductItem } from 'src/types/product'

// ----------------------------------------------------------------------

type Props = {
    row: IProductItem
    selected: boolean
    onEditRow?: VoidFunction
    onViewRow?: VoidFunction
    onSelectRow?: VoidFunction
    onDeleteRow?: VoidFunction
}

export default function ProductTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
}: Props) {
    const {
        name,
        price,
        status,
        coverUrl,
        category,
        brand,
        createdAt,
        inventoryType,
    } = row

    const confirm = useBoolean()

    const popover = usePopover()

    const capitalizeFirstLetter = (string: string) =>
        string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        alt={name}
                        src={coverUrl}
                        variant="rounded"
                        sx={{ width: 64, height: 64, mr: 2 }}
                    />

                    <ListItemText
                        disableTypography
                        primary={
                            <Link
                                noWrap
                                color="inherit"
                                variant="subtitle2"
                                onClick={onViewRow}
                                sx={{ cursor: 'pointer' }}
                            >
                                {name}
                            </Link>
                        }
                        secondary={
                            <Box
                                component="div"
                                sx={{
                                    typography: 'body2',
                                    color: 'text.disabled',
                                }}
                            >
                                {`${category && capitalizeFirstLetter(category.name)} ${brand && capitalizeFirstLetter(brand.name)}`}
                            </Box>
                        }
                    />
                </TableCell>

                <TableCell>
                    <ListItemText
                        primary={format(new Date(createdAt), 'dd MMM yyyy')}
                        secondary={format(new Date(createdAt), 'p')}
                        primaryTypographyProps={{
                            typography: 'body2',
                            noWrap: true,
                        }}
                        secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                        }}
                    />
                </TableCell>

                <TableCell
                    sx={{ typography: 'caption', color: 'text.secondary' }}
                >
                    <LinearProgress
                        value={100}
                        variant="determinate"
                        color={
                            (inventoryType === 'out of stock' && 'error') ||
                            (inventoryType === 'low stock' && 'warning') ||
                            'success'
                        }
                        sx={{ mb: 1, height: 6, maxWidth: 80 }}
                    />
                    {inventoryType}
                </TableCell>

                <TableCell>{fCurrency(price)}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (status === 'active' && 'success') ||
                            (status === 'inactive' && 'error') ||
                            'default'
                        }
                    >
                        {status}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton
                        color={popover.open ? 'primary' : 'default'}
                        onClick={popover.onOpen}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        if (onViewRow) onViewRow()
                        popover.onClose()
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    View
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        if (onEditRow) onEditRow()
                        popover.onClose()
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        confirm.onTrue()
                        popover.onClose()
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onDeleteRow}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    )
}
