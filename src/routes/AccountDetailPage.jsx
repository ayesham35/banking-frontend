import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Container, Typography, Box, Button, CircularProgress, Alert, Paper, Stack, Chip
} from '@mui/material';
import { getAccount, getTransactionHistory } from '../api/endpoints';
import { TransactionTable } from '../components/TransactionTable';
import { DepositDialog } from '../components/DepositDialog';
import { WithdrawDialog } from '../components/WithdrawDialog';
import { TransferDialog } from '../components/TransferDialog';

export function AccountDetailPage() {
    const { id } = useParams();
    const accountId = Number(id);
    const [openDialog, setOpenDialog] = useState(null); // 'deposit' | 'withdraw' | 'transfer' | null

    const accountQuery = useQuery({
        queryKey: ['account', accountId],
        queryFn: () => getAccount(accountId),
    })

    const historyQuery = useQuery({
        queryKey: ['account', accountId, 'transactions'],
        queryFn: () => getTransactionHistory(accountId),
    });

    if (accountQuery.isPending) {
        return <Container sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    }

    if (accountQuery.isError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Failed to load account: {accountQuery.error.message}</Alert>
                <Button component={Link} to="/accounts" sx={{ mt: 2 }}>Back to accounts</Button>
            </Container>
        );
    }

    const account = accountQuery.data;
    const frozen = account.status !== 'ACTIVE';

    return (
        <Container sx={{ mt: 4 }}>
            <Button component={Link} to="/accounts" sx={{ mb: 2 }}>← All accounts</Button>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                        <Typography variant="overline" color="text.secondary">{account.accountNumber}</Typography>
                        <Typography variant="h3">${Number(account.balance).toFixed(2)}</Typography>
                    </Box>
                    <Chip label={account.status} color={account.status === 'ACTIVE' ? 'success' : 'warning'} />
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={() => setOpenDialog('deposit')} disabled={frozen}>Deposit</Button>
                    <Button variant="outlined" onClick={() => setOpenDialog('withdraw')} disabled={frozen}>Withdraw</Button>
                    <Button variant="outlined" onClick={() => setOpenDialog('transfer')} disabled={frozen}>Transfer</Button>
                </Stack>
            </Paper>

            <Typography variant="h5" sx={{ mb: 2 }}>Transaction history</Typography>
            {historyQuery.isPending && <CircularProgress />}
            {historyQuery.isError && <Alert severity="error">Failed to load history.</Alert>}
            {historyQuery.data && <TransactionTable transactions={historyQuery.data} accountId={accountId} />}

            <DepositDialog open={openDialog === 'deposit'} account={account} onClose={() => setOpenDialog(null)} />
            <WithdrawDialog open={openDialog === 'withdraw'} account={account} onClose={() => setOpenDialog(null)} />
            <TransferDialog open={openDialog === 'transfer'} account={account} onClose={() => setOpenDialog(null)} />
        </Container>
    );
}