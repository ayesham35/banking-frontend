import { Card, CardContent, Typography, Chip, Box, CardActionArea } from '@mui/material';
import { forwardRef } from 'react';

// forwardRef lets MUI pass refs through - needed when used with React Router's Link
export const AccountCard = forwardRef(function AccountCard({ account, ...rest }, ref) {
    const statusColor = account.status === 'ACTIVE' ? 'success'
        : account.status === 'FROZEN' ? 'warning' : 'default';

    return (
        <Card ref={ref}>
            <CardActionArea {...rest}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Typography variant="overline" color="text.secondary">
                            {account.accountNumber}
                        </Typography>
                        <Chip label={account.status} size="small" color={statusColor} />
                    </Box>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                        ${Number(account.balance).toFixed(2)}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
});