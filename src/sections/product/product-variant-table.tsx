import * as React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Select, MenuItem } from '@mui/material'
import {
    DataGrid,
    GridRowId,
    GridColDef,
    GridRowsProp,
    GridRowModes,
    GridRowModel,
    GridSlotProps,
    GridRowModesModel,
    GridEventListener,
    GridActionsCellItem,
    GridToolbarContainer,
    GridRowEditStopReasons,
} from '@mui/x-data-grid'

import { useGetAttributes } from 'src/api/attributes'

import Iconify from 'src/components/iconify'

import { IAttribute } from 'src/types/product'

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel
        ) => void
    }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
    const { setRows, setRowModesModel } = props

    const handleClick = () => {
        const id = Math.random().toString(36)
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                color: '',
                size: '',
                quantity: '',
                isNew: true,
            },
        ])
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }))
    }

    return (
        <GridToolbarContainer
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                justifyContent: 'flex-end',
            }}
        >
            <Button
                style={{
                    backgroundColor: 'rgb(46, 52, 61)',
                    color: 'white',
                }}
                color="primary"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleClick}
            >
                Add Variant
            </Button>
        </GridToolbarContainer>
    )
}

interface Props {
    variants: GridRowsProp
    onVariantsChange: (variants: GridRowsProp) => void
}

export default function ProductVariantTable({
    variants,
    onVariantsChange,
}: Props) {
    const { attributes } = useGetAttributes()
    const colors = attributes.filter(
        (attribute: IAttribute) => attribute.type === 'color'
    )
    const sizes = attributes.filter(
        (attribute: IAttribute) => attribute.type === 'size'
    )

    const [rows, setRows] = React.useState<GridRowsProp>([])
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    )

    React.useEffect(() => {
        const initialRows = variants?.map((variant) => ({
            id: variant.id,
            color: variant.color?.id || '',
            size: variant.size?.id || '',
            quantity: variant.quantity || 0,
        }))
        if (initialRows.length !== 0) {
            setRows(initialRows)
        }

        onVariantsChange(rows)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, onVariantsChange])

    const handleGetData = () => {
        alert(JSON.stringify(rows, null, 2))
    }

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true
        }
    }

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        })
    }

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        })
    }

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id))
    }

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        })

        const editedRow = rows.find((row) => row.id === id)
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id))
        }
    }

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false }
        setRows((prevRows) =>
            prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
        )
        return updatedRow
    }

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel)
    }

    const columns: GridColDef[] = [
        {
            field: 'color',
            headerName: 'Color',
            type: 'singleSelect',
            width: 180,
            editable: true,
            valueOptions: colors.map(
                (color: { id: string; displayName: string }) => ({
                    value: color.id,
                    label: color.displayName,
                })
            ),
            valueFormatter: (params) => {
                const colorSelect = colors.find(
                    (color: IAttribute) => color.id === params
                )
                return colorSelect ? colorSelect.displayName : ''
            },
            renderEditCell: (params) => {
                const currentValue =
                    rows.find((row) => row.id === params.id)?.color ||
                    params.value ||
                    ''
                const handleChange = (event: { target: { value: any } }) => {
                    params.api.setEditCellValue({
                        id: params.id,
                        field: params.field,
                        value: event.target.value,
                    })
                }

                return (
                    <Select
                        value={currentValue}
                        onChange={handleChange}
                        fullWidth
                    >
                        {colors.map(
                            (color: { id: string; displayName: string }) => (
                                <MenuItem key={color.id} value={color.id}>
                                    {color.displayName}
                                </MenuItem>
                            )
                        )}
                    </Select>
                )
            },
        },

        {
            field: 'size',
            headerName: 'Size',
            width: 170,
            editable: true,
            type: 'singleSelect',
            valueOptions: sizes.map(
                (size: { id: string; displayName: string }) => ({
                    value: size.id,
                    label: size.displayName,
                })
            ),
            valueFormatter: (params) => {
                const sizeSelect = sizes.find(
                    (size: IAttribute) => size.id === params
                )
                return sizeSelect ? sizeSelect.displayName : ''
            },
            renderEditCell: (params) => {
                const handleChange = (event: { target: { value: any } }) => {
                    params.api.setEditCellValue({
                        id: params.id,
                        field: params.field,
                        value: event.target.value,
                    })
                }

                return (
                    <Select
                        value={params.value}
                        onChange={handleChange}
                        fullWidth
                    >
                        {sizes.map(
                            (size: { id: string; displayName: string }) => (
                                <MenuItem key={size.id} value={size.id}>
                                    {size.displayName}
                                </MenuItem>
                            )
                        )}
                    </Select>
                )
            },
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            width: 170,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 170,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={
                                <Iconify icon="material-symbols-light:save-outline" />
                            }
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={
                                <Iconify icon="material-symbols-light:cancel-outline" />
                            }
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ]
                }

                return [
                    <GridActionsCellItem
                        icon={<Iconify icon="solar:pen-bold" />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ]
            },
        },
    ]

    return (
        <>
            <Box
                sx={{
                    height: 500,
                    width: '100%',
                    '& .actions': {
                        color: 'text.secondary',
                    },
                    '& .textPrimary': {
                        color: 'text.primary',
                    },
                }}
            >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    slots={{ toolbar: EditToolbar }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleGetData}
                sx={{ ml: 'auto', width: 'fit-content' }}
            >
                Comfirm
            </Button>
        </>
    )
}
