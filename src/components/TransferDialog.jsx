import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { transfer } from '../api/endpoints';

const transferSchema = (balance, sourceAccountNumber) => Yup.object({
    toAccountNumber: Yup.string()
        .required('Recipient account number is required')
        .notOneOf([sourceAccountNumber], 'Cannot transfer to the same account')
        .matches(/^\d{12}$/, 'Account number must be 12 digits'),
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be greater than zero')
        .max(Number(balance), `Cannot exceed current balance ($${Number(balance).toFixed(2)})`)
        .required('Amount is required'),
    description: Yup.string().max(255, 'Description too long').nullable(),
});

export function TransferDialog({ open, account, onClose }) {
    const queryClient = useQueryClient();
    const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
    const [error, setError] = useState(null);

    // Generate a new key each time the dialog opens
    useEffect(() => {
        if (open) {
            setIdempotencyKey(crypto.randomUUID());
            setError(null);
        }
    }, [open]);

    const transferMutation = useMutation({
        mutationFn: ({ toAccountNumber, amount, description }) =>
            transfer(account.id, toAccountNumber, amount, description, idempotencyKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account', account.id] });
            queryClient.invalidateQueries({ queryKey: ['account', account.id, 'transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            onClose();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Transfer failed');
        },
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Transfer from {account.accountNumber}</DialogTitle>
            <Formik
                initialValues={{ toAccountNumber: '', amount: '', description: ''}}
                validationSchema={transferSchema(account.balance, account.accountNumber)}
                onSubmit={(values) => transferMutation.mutate(values)}
                >
                {({ errors, touched }) => (
                    <Form>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <Field
                                as={TextField}
                                name="toAccountNumber"
                                label="Recipient Account Number"
                                fullWidth
                                autoFocus
                                margin="normal"
                                error={touched.toAccountNumber && Boolean(errors.toAccountNumber)}
                                helperText={touched.toAccountNumber && errors.toAccountNumber}
                                />
                            <Field
                                as={TextField}
                                name="amount"
                                label="Amount ($)"
                                type="number"
                                fullWidth
                                margin="normal"
                                inputProps={{ step: '0.01', min: '0.01' }}
                                error={touched.amount && Boolean(errors.amount)}
                                helperText={touched.amount && errors.amount}
                            />
                            <Field
                                as={TextField}
                                name="description"
                                label="Description (optional)"
                                fullWidth
                                margin="normal"
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={transferMutation.isPending}
                                >
                                {transferMutation.isPending ? 'Transferring...' : 'Transfer'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}