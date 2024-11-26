import { format } from 'date-fns'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import { useBoolean } from 'src/hooks/use-boolean'

import Iconify from 'src/components/iconify'
import { ConfirmDialog } from 'src/components/custom-dialog'
import CustomPopover, { usePopover } from 'src/components/custom-popover'

import { IProductItemVariant } from 'src/types/product'

// ----------------------------------------------------------------------

type Props = {
    row: IProductItemVariant
    selected: boolean
    canEdit?: boolean
    onEditRow?: VoidFunction
    onSelectRow?: VoidFunction
    onDeleteRow?: VoidFunction
}

export default function ProductVariantTableRow({
    row,
    selected,
    canEdit,
    onSelectRow,
    onDeleteRow,
    onEditRow,
}: Props) {
    const { color, size, quantity, created_at, updated_at } = row

    const confirm = useBoolean()

    const popover = usePopover()

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>{color.displayName}</TableCell>

                <TableCell>{size.displayName}</TableCell>

                <TableCell>{quantity}</TableCell>

                <TableCell>
                    <ListItemText
                        primary={format(new Date(created_at), 'dd MMM yyyy')}
                        secondary={format(new Date(created_at), 'p')}
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

                <TableCell>
                    <ListItemText
                        primary={format(new Date(updated_at), 'dd MMM yyyy')}
                        secondary={format(new Date(updated_at), 'p')}
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

                {canEdit && (
                    <TableCell align="right">
                        <IconButton
                            color={popover.open ? 'primary' : 'default'}
                            onClick={popover.onOpen}
                        >
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </TableCell>
                )}
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 140 }}
            >
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
