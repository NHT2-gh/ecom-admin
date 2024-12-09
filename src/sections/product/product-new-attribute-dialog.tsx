import React, { useState, useEffect } from 'react'

import {
    Dialog,
    Button,
    Snackbar,
    TextField,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material'

import { createAttributes } from 'src/api/attributes'

import { IAttribute } from 'src/types/product'

interface AddAttributeDialogProps {
    type: 'color' | 'size'
    open: boolean
    onClose: () => void
    onAddAttribute: (attribute: IAttribute) => void
}

export default function AddAttributeDialog({
    type,
    open,
    onClose,
    onAddAttribute,
}: AddAttributeDialogProps) {
    const [newAttribute, setNewAttribute] = useState<IAttribute>({
        id: '',
        type,
        displayName: '',
        displayValue: '',
        created_at: '',
        updated_at: '',
    })
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')

    useEffect(() => {
        if (open) {
            setNewAttribute((prevAttribute) => ({
                ...prevAttribute,
                displayName: '',
                displayValue: '',
            }))
            setErrorMessage('')
            setSuccessMessage('')
        }
    }, [open])

    const handleInputChange = (event: {
        target: { name: string; value: string }
    }) => {
        const { name, value } = event.target
        setNewAttribute((prevAttribute) => ({
            ...prevAttribute,
            [name === 'name' ? 'displayName' : 'displayValue']: value,
        }))
    }

    const handleAddAttribute = async () => {
        if (!newAttribute.displayName || !newAttribute.displayValue) {
            setErrorMessage('Both name and value are required!')
            return
        }
        try {
            const result = await createAttributes(newAttribute)
            if (result) {
                setNewAttribute((prevAttribute) => ({
                    ...prevAttribute,
                    id: result,
                }))

                onAddAttribute({
                    ...newAttribute,
                    id: result,
                })

                setSuccessMessage(`Successfully added ${type}!`)
                setErrorMessage('')
            } else {
                setErrorMessage('Failed to create attribute. Please try again.')
            }
        } catch (error) {
            setErrorMessage('Error occurred while adding the attribute.')
            console.error('Error adding attribute:', error)
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>
                    Add New {type.charAt(0).toUpperCase() + type.slice(1)}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Attribute Name"
                        name="name"
                        value={newAttribute.displayName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Attribute Value"
                        name="value"
                        value={newAttribute.displayValue}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddAttribute} color="primary">
                        {type === 'color' ? 'Add Color' : 'Add Size'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for error/success messages */}
            {errorMessage && (
                <Snackbar
                    open={Boolean(errorMessage)}
                    message={errorMessage}
                    autoHideDuration={3000}
                    onClose={() => setErrorMessage('')}
                />
            )}
            {successMessage && (
                <Snackbar
                    open={Boolean(successMessage)}
                    message={successMessage}
                    autoHideDuration={3000}
                    onClose={() => setSuccessMessage('')}
                />
            )}
        </>
    )
}
