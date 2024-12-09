'use client'

import * as React from 'react'
import { useEffect, useState, useLayoutEffect } from 'react'

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

import {
    IAttribute,
    IProductVariantDTO,
    IProductItemVariant,
} from 'src/types/product'

import AddAttributeDialog from './product-new-attribute-dialog'

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
                variantId: '',
                colorId: '',
                sizeId: '',
                quantity: '',
                isNew: true,
            },
        ])
        // setRowModesModel((oldModel) => ({
        //     ...oldModel,
        //     [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        // }))
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
    currentVariants: IProductItemVariant[]
    onVariantsChange: (variants: IProductVariantDTO[]) => void
}

export default function ProductVariantTable({
    onVariantsChange,
    currentVariants,
}: Props) {
    const { colors, sizes } = useGetAttributes({ page: 1, itemsPerPage: 100 })
    const [colorOptions, setColorOptions] = useState<IAttribute[]>(colors)
    const [sizeOptions, setSizeOptions] = useState<IAttribute[]>(sizes)
    const [rows, setRows] = React.useState<GridRowsProp>([])
    const [isEditMode, setIsEditMode] = React.useState(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
        {}
    )

    useEffect(() => {
        const initialRows = currentVariants?.map((variant) => ({
            id: variant.id,
            variantId: variant.id,
            colorId: variant.color?.id || '',
            sizeId: variant.size?.id || '',
            quantity: variant.quantity || 0,
        }))

        if (colors.length > 0 && sizes.length > 0 && !isEditMode) {
            setRows(initialRows)
            setIsEditMode(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentVariants, colors, sizes]) // Dependency array

    const handleGetData = () => {
        alert(JSON.stringify(rows, null, 2))
        onVariantsChange(rows as IProductVariantDTO[])
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

    const [openDialogNewColor, setOpenDialogNewColor] = useState(false)
    const [openDialogNewSize, setOpenDialogNewSize] = useState(false)

    const [dialogType, setDialogType] = useState<'color' | 'size'>('color')

    const handleOpenDialogColor = (type: 'color' | 'size') => {
        setDialogType(type)
        setOpenDialogNewColor(true)
    }

    const handleCloseDialogColor = () => {
        setOpenDialogNewColor(false)
    }

    const handleOpenDialogSize = (type: 'color' | 'size') => {
        setDialogType(type)
        setOpenDialogNewColor(true)
    }

    const handleCloseDialogSize = () => {
        setOpenDialogNewSize(false)
    }

    const handleAddAttribute = (newAttribute: IAttribute) => {
        handleCloseDialogColor()
        handleCloseDialogSize()
        // Add new attribute to options based on type
        if (newAttribute.type === 'color') {
            setColorOptions((prev) => [...prev, newAttribute])
        }
        if (newAttribute.type === 'size') {
            setSizeOptions((prev) => [...prev, newAttribute])
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'colorId',
            headerName: 'Color',
            type: 'singleSelect',
            flex: 1,
            editable: true,
            valueOptions: colors?.map(
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
                    <>
                        <Select
                            value={currentValue}
                            onChange={handleChange}
                            fullWidth
                        >
                            {colorOptions.map(
                                (color: {
                                    id: string
                                    displayName: string
                                }) => (
                                    <MenuItem key={color.id} value={color.id}>
                                        {color.displayName}
                                    </MenuItem>
                                )
                            )}
                            <MenuItem
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    backgroundColor: 'rgb(222, 244, 230)',
                                }}
                                onClick={() => handleOpenDialogColor('color')}
                            >
                                <Iconify icon="eva:plus-fill" /> Add Color
                            </MenuItem>
                        </Select>

                        {openDialogNewColor && (
                            <AddAttributeDialog
                                type={dialogType}
                                open={openDialogNewColor}
                                onClose={handleCloseDialogColor}
                                onAddAttribute={handleAddAttribute}
                            />
                        )}
                    </>
                )
            },
        },
        {
            field: 'sizeId',
            headerName: 'Size',
            flex: 1,
            editable: true,
            type: 'singleSelect',
            valueOptions: sizes?.map(
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
                        {sizeOptions.map(
                            (size: { id: string; displayName: string }) => (
                                <MenuItem key={size.id} value={size.id}>
                                    {size.displayName}
                                </MenuItem>
                            )
                        )}
                        <MenuItem
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                backgroundColor: 'rgb(222, 244, 230)',
                            }}
                            onClick={() => handleOpenDialogSize('size')}
                        >
                            <Iconify icon="eva:plus-fill" /> Add Size
                        </MenuItem>
                        {openDialogNewSize && (
                            <AddAttributeDialog
                                type={dialogType}
                                open={openDialogNewColor}
                                onClose={handleCloseDialogSize}
                                onAddAttribute={handleAddAttribute}
                            />
                        )}
                    </Select>
                )
            },
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1,
            type: 'number',
            align: 'left',
            headerAlign: 'left',
            width: 170,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            width: 170,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit
                if (isInEditMode) {
                    if (colorOptions.length === 0 || sizeOptions.length === 0) {
                        setColorOptions(colors)
                        setSizeOptions(sizes)
                    }

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
