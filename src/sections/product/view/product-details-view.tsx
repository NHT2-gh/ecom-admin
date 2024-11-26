'use client'

import { useState, useEffect, useCallback } from 'react'

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Button from '@mui/material/Button'
import { alpha } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import {
    Card,
    Table,
    Tooltip,
    TableBody,
    IconButton,
    TableContainer,
} from '@mui/material'

import { paths } from 'src/routes/paths'
import { RouterLink } from 'src/routes/components'

import { useGetProduct } from 'src/api/product'

import Iconify from 'src/components/iconify'
import Scrollbar from 'src/components/scrollbar'
import EmptyContent from 'src/components/empty-content'
import { useSettingsContext } from 'src/components/settings'
import {
    useTable,
    emptyRows,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
} from 'src/components/table'

import { IProductItemVariant } from 'src/types/product'

import { ProductDetailsSkeleton } from '../product-skeleton'
import ProductDetailsSummary from '../product-details-summary'
import ProductDetailsToolbar from '../product-details-toolbar'
import ProductDetailsCarousel from '../product-details-carousel'
import ProductVariantTableRow from '../product-variant-table-row'
import ProductDetailsDescription from '../product-details-description'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'color', label: 'Color', width: 160 },
    { id: 'size', label: 'Size', width: 160 },
    { id: 'quantity', label: 'Quantity', width: 140 },
    { id: 'created_at', label: 'Created At', width: 160 },
    { id: 'updated_at', label: 'Updated At', width: 160 },
]

// ----------------------------------------------------------------------

type Props = {
    id: string
}

export default function ProductDetailsView({ id }: Props) {
    const { product, error } = useGetProduct(id)

    const table = useTable()

    const settings = useSettingsContext()

    const [currentTab, setCurrentTab] = useState('description')

    const [tableData, setTableData] = useState<IProductItemVariant[]>([])

    const denseHeight = table.dense ? 60 : 80

    useEffect(() => {
        if (product) {
            setTableData(product.variants)
        }
    }, [product])

    const handleChangeTab = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            setCurrentTab(newValue)
        },
        []
    )

    const renderSkeleton = <ProductDetailsSkeleton />

    const renderError = (
        <EmptyContent
            filled
            title={error}
            action={
                <Button
                    component={RouterLink}
                    href={paths.dashboard.product.root}
                    startIcon={
                        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
                    }
                    sx={{ mt: 3 }}
                >
                    Back to List
                </Button>
            }
            sx={{ py: 10 }}
        />
    )

    const renderProduct = product && (
        <>
            <ProductDetailsToolbar
                backLink={paths.dashboard.product.root}
                editLink={paths.dashboard.product.edit(`${product.id}`)}
                liveLink=""
                publish={product.status || ''}
            />

            <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
                <Grid xs={12} md={6} lg={7}>
                    <ProductDetailsCarousel product={product} />
                </Grid>

                <Grid xs={12} md={6} lg={5}>
                    <ProductDetailsSummary product={product} />
                </Grid>
            </Grid>

            <Card sx={{ marginY: '2rem' }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 3,
                        boxShadow: (theme) =>
                            `inset 0 -2px 0 0 ${alpha(
                                theme.palette.grey[500],
                                0.08
                            )}`,
                    }}
                >
                    {[
                        {
                            value: 'description',
                            label: 'Description',
                        },
                    ].map((tab) => (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={tab.label}
                        />
                    ))}
                </Tabs>

                {currentTab === 'description' && (
                    <ProductDetailsDescription
                        description={product?.description}
                    />
                )}
            </Card>

            <Card>
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
                        // action={
                        //     <Tooltip title="Delete">
                        //         <IconButton
                        //             color="primary"
                        //             onClick={confirm.onTrue}
                        //         >
                        //             <Iconify icon="solar:trash-bin-trash-bold" />
                        //         </IconButton>
                        //     </Tooltip>
                        // }
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
                                onSelectAllRows={(checked) =>
                                    table.onSelectAllRows(
                                        checked,
                                        tableData.map((row) => row.id)
                                    )
                                }
                            />

                            <TableBody>
                                {tableData.map((row) => (
                                    <ProductVariantTableRow
                                        key={row.id}
                                        row={row}
                                        selected={table.selected.includes(
                                            row.id
                                        )}
                                        onSelectRow={() =>
                                            table.onSelectRow(row.id)
                                        }
                                        canEdit={false}
                                    />
                                ))}
                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(
                                        table.page,
                                        table.rowsPerPage,
                                        tableData.length
                                    )}
                                />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
            </Card>
        </>
    )

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {!product && renderSkeleton}

            {error && renderError}

            {product && renderProduct}
        </Container>
    )
}
