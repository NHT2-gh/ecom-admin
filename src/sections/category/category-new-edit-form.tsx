import * as Yup from 'yup'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
// import Button from '@mui/material/Button'
// import Switch from '@mui/material/Switch'
import Grid from '@mui/material/Unstable_Grid2'
// import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'

import { useRouter } from 'src/routes/hooks'
// import { useBoolean } from 'src/hooks/use-boolean'

// import { usePopover } from 'src/components/custom-popover'

import { paths } from 'src/routes/paths'

import {
    createCategory,
    updateCategory,
    // deleteCategory,
} from 'src/api/category'

import { useSnackbar } from 'src/components/snackbar'
import FormProvider, { RHFTextField } from 'src/components/hook-form'

import { ICategoryItem } from 'src/types/categorys'

// ----------------------------------------------------------------------

type Props = {
    currentCategory?: ICategoryItem
}

export default function CategoryNewEditForm({ currentCategory }: Props) {
    const router = useRouter()

    const { enqueueSnackbar } = useSnackbar()

    const NewUserSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        // image: Yup.mixed<any>().nullable().required('Image is required'),
        description: Yup.string().required('Description is required'),
    })

    const defaultValues = useMemo(
        () => ({
            name: currentCategory?.name || '',
            description: currentCategory?.description || '',
        }),
        [currentCategory]
    )

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
        defaultValues,
    })

    const {
        reset,
        // watch,
        // setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods

    // const values = watch()

    const onSubmit = handleSubmit(async ({ name, description }) => {
        try {
            if (currentCategory) {
                await updateCategory({
                    data: { id: currentCategory?.id, name, description },
                })
            } else {
                const payload = { data: { name, description } }
                await createCategory(payload)
            }
            reset()
            enqueueSnackbar(
                currentCategory ? 'Update success!' : 'Create success!'
            )
            router.push(paths.dashboard.category.list)
        } catch (error) {
            console.error(error)
        }
    })

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                    <Box
                        rowGap={3}
                        columnGap={1}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    >
                        <RHFTextField name="name" label="Category Name" />
                        <RHFTextField
                            multiline
                            rows={4}
                            name="description"
                            label="Description"
                        />
                    </Box>

                    <Stack alignItems="flex-end" sx={{ mt: 5 }}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            {!currentCategory
                                ? 'Create Category'
                                : 'Save Changes'}
                        </LoadingButton>
                    </Stack>
                </Card>
            </Grid>
            {/* </Grid> */}
        </FormProvider>
    )
}
