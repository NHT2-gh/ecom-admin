'use client'

import isEqual from 'lodash/isEqual'
import { useState, useEffect, useCallback } from 'react'

import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Container from '@mui/material/Container'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'

import { paths } from 'src/routes/paths'
import { useRouter } from 'src/routes/hooks'
import { RouterLink } from 'src/routes/components'

import { useBoolean } from 'src/hooks/use-boolean'

import { deleteBrand, useGetBrands } from 'src/api/brand'

import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'
import { useSnackbar } from 'src/components/snackbar'
import { useSettingsContext } from 'src/components/settings'
import { ConfirmDialog } from 'src/components/custom-dialog'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'
import {
    useTable,
    emptyRows,
    TableNoData,
    getComparator,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table'

import {
    IBrandItem,
    IBrandTableFilters,
    IBrandTableFilterValue,
} from 'src/types/brand'

import BrandTableRow from '../brand-table-row'
import BrandTableToolbar from '../brand-table-toolbar'
import BrandTableFiltersResult from '../brand-table-filters-result'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Brand' },
    { id: 'createdAt', label: 'Create at', width: 160 },
    { id: 'updatedAt', label: 'Update at', width: 160 },
    { id: 'status', label: 'Publish', width: 110 },
    { id: '', width: 88 },
]

const STATUS_OPTIONS = [{ value: 'published', label: 'Published' }]

const defaultFilters: IBrandTableFilters = {
    name: '',
    status: [],
    // stock: [],
}

// ----------------------------------------------------------------------

export default function BrandListView() {
    const router = useRouter()

    const table = useTable()

    const settings = useSettingsContext()

    const [tableData, setTableData] = useState<IBrandItem[]>([])

    const [filters, setFilters] = useState(defaultFilters)

    const { brands, brandsLoading, brandsEmpty } = useGetBrands({
        page: table.page,
        rowsPerPage: table.rowsPerPage,
    })

    const confirm = useBoolean()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (brands.length) {
            setTableData(brands)
        }
    }, [brands])

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
    })

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    )

    const denseHeight = table.dense ? 60 : 80

    const canReset = !isEqual(defaultFilters, filters)

    const notFound = (!dataFiltered.length && canReset) || brandsEmpty

    const handleFilters = useCallback(
        (name: string, value: IBrandTableFilterValue) => {
            table.onResetPage()
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }))
        },
        [table]
    )

    const handleDeleteRow = async (id: string) => {
        try {
            const deleteRow = tableData.filter((row) => row.id !== id)
            setTableData(deleteRow)
            table.onUpdatePageDeleteRow(dataInPage.length)
            await deleteBrand(id)
            enqueueSnackbar('Delete success!')
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteRows = () => {
        const deleteRows = tableData.filter(
            (row) => !table.selected.includes(row.id)
        )
        setTableData(deleteRows)

        // deleteProducts(table.selected)

        table.onUpdatePageDeleteRows({
            totalRows: tableData.length,
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        })
    }

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.brand.edit(id))
        },
        [router]
    )

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters)
    }, [])

    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <CustomBreadcrumbs
                    heading="List"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        {
                            name: 'Brand',
                            href: paths.dashboard.brand.root,
                        },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.brand.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            New Brand
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <Card>
                    <BrandTableToolbar
                        filters={filters}
                        onFilters={handleFilters}
                        statusOptions={STATUS_OPTIONS}
                    />

                    {canReset && (
                        <BrandTableFiltersResult
                            filters={filters}
                            onFilters={handleFilters}
                            //
                            onResetFilters={handleResetFilters}
                            //
                            results={dataFiltered.length}
                            sx={{ p: 2.5, pt: 0 }}
                        />
                    )}

                    <TableContainer
                        sx={{ position: 'relative', overflow: 'unset' }}
                    >
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={tableData.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    tableData.map((row) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton
                                        color="primary"
                                        onClick={confirm.onTrue}
                                    >
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />

                        <Scrollbar>
                            <Table
                                size={table.dense ? 'small' : 'medium'}
                                sx={{ minWidth: 960 }}
                            >
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={tableData.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    // onSelectAllRows={(checked) =>
                                    //     table.onSelectAllRows(
                                    //         checked,
                                    //         tableData.map((row) => row.id)
                                    //     )
                                    // }
                                />

                                <TableBody>
                                    {brandsLoading ? (
                                        [...Array(table.rowsPerPage)].map(
                                            (i, index) => (
                                                <TableSkeleton
                                                    key={index}
                                                    sx={{ height: denseHeight }}
                                                />
                                            )
                                        )
                                    ) : (
                                        <>
                                            {dataFiltered
                                                .slice(
                                                    table.page *
                                                        table.rowsPerPage,
                                                    table.page *
                                                        table.rowsPerPage +
                                                        table.rowsPerPage
                                                )
                                                .map((row) => (
                                                    <BrandTableRow
                                                        key={row.id}
                                                        row={row}
                                                        selected={table.selected.includes(
                                                            row.id
                                                        )}
                                                        onSelectRow={() =>
                                                            table.onSelectRow(
                                                                row.id
                                                            )
                                                        }
                                                        onDeleteRow={() =>
                                                            handleDeleteRow(
                                                                row.id
                                                            )
                                                        }
                                                        onEditRow={() =>
                                                            handleEditRow(
                                                                row.id
                                                            )
                                                        }
                                                    />
                                                ))}
                                        </>
                                    )}

                                    <TableEmptyRows
                                        height={denseHeight}
                                        emptyRows={emptyRows(
                                            table.page,
                                            table.rowsPerPage,
                                            tableData.length
                                        )}
                                    />

                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                    <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        //
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    />
                </Card>
            </Container>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content={
                    <>
                        Are you sure want to delete{' '}
                        <strong> {table.selected.length} </strong> items?
                    </>
                }
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteRows()
                            confirm.onFalse()
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    )
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
}: {
    inputData: IBrandItem[]
    comparator: (a: any, b: any) => number
    filters: IBrandTableFilters
}) {
    const { name } = filters

    const stabilizedThis = inputData.map((el, index) => [el, index] as const)

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })

    inputData = stabilizedThis.map((el) => el[0])

    if (name) {
        inputData = inputData.filter(
            (product) =>
                product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
        )
    }

    // if (stock.length) {
    //     inputData = inputData.filter((product) =>
    //         stock.includes(product.inventoryType)
    //     )
    // }

    // if (publish.length) {
    //     inputData = inputData.filter((product) =>
    //         publish.includes(product.publish)
    //     )
    // }

    return inputData
}
