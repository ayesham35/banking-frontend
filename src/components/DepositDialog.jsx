import { useEffect, useState } from 'react';
import { useMutation, useQueryClient} from '@tanstack/react-query';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { deposit } from '../api/endpoints';

const depositSchema = Yup.object({
    amount: Yup.number()
        .typeError('Amount must be a number')
        .positive('Amount must be greater than zero')
        .max(1_000_000, 'Single deposit cannot exceed $1,000,000')
        .required('Amount is required'),
});

export function DepositDialog({ open, account, onClose }) {
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

    const depositMutation = useMutation({
        mutationFn: ({ amount }) => deposit(account.id, amount, idempotencyKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['account', account.id] });
            queryClient.invalidateQueries({ queryKey: ['account', account.id, 'transactions'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            onClose();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Deposit failed');
        },
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Deposit to {account.accountNumber}</DialogTitle>
            <Formik
                initialValues={{ amount: ''}}
                validationSchema={depositSchema}
                onSubmit={(values) => depositMutation.mutate(values)}
                >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            <Field
                                as={TextField}
                                name="amount"
                                label="Amount ($)"
                                type="number"
                                fullWidth
                                autoFocus
                                inputProps={{ step: '0.01', min: '0.01' }}
                                error={touched.amount && Boolean(errors.amount)}
                                helperText={touched.amount && errors.amount}
                                />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={depositMutation.isPending}
                                >
                                {depositMutation.isPending ? 'Depositing...' : 'Deposit'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}