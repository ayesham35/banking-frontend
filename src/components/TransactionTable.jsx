import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';

export function TransactionTable({ transactions, accountId }) {
    if (transactions.length === 0) {
        return <Paper sx={{ p: 2 }}>No transactions yet.</Paper>
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Direction</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Other Account</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map(t => {
                        const isOutgoing = t.type === 'WITHDRAWAL' ||
                            (t.type === 'TRANSFER' && t.fromAccountNumber);
                        const sign = isOutgoing ? '−' : '+';
                        const color = isOutgoing ? 'error.main' : 'success.main';

                        return (
                            <TableRow key={t.id} hover>
                                <TableCell>{new Date(t.occurredAt).toLocaleString()}</TableCell>
                                <TableCell><Chip label={t.type} size="small" /></TableCell>
                                <TableCell>{isOutgoing ? 'Out' : 'In'}</TableCell>
                                <TableCell align="right" sx={{ color, fontWeight: 600 }}>
                                    {sign}${Number(t.amount).toFixed(2)}
                                </TableCell>
                                <TableCell>{t.toAccountNumber || '—'}</TableCell>
                                <TableCell>{t.description || '—'}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}