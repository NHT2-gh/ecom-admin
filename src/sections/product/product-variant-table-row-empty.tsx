import { Checkbox, InputBase, TableCell, TableRow } from '@mui/material'
import React from 'react'

type Props = {
    // selected: boolean
    // onSelectRow: VoidFunction
}

export default function TableRowEmpty() {
    return (
        <TableRow hover>
            <TableCell padding="checkbox">
                <Checkbox />
            </TableCell>

            <TableCell>
                <InputBase placeholder="Color" />
            </TableCell>

            <TableCell>
                <InputBase placeholder="Size" />
            </TableCell>

            <TableCell>
                <InputBase placeholder="Quantity" />
            </TableCell>
        </TableRow>
    )
}
