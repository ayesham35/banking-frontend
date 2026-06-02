import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { Container, Typography, Box, Button, CircularProgress, Alert, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { listAccounts, openAccount } from '../api/endpoints';
import { AccountCard } from '../components/AccountCard';

export function AccountsPage() {
    const queryClient = useQueryClient();

    // Fetch the list of accounts
    const { data: accounts, isPending, isError, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: listAccounts,
    });

    // Mutation for opening a new account
    const openMutation = useMutation({
        mutationFn: openAccount,
        onSuccess: () => {
            // Refresh the accounts list after opening a new one
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        },
    });

    if (isPending) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (isError) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Failed to load accounts: {error.message}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4">Your Accounts</Typography>
                <Button
                    variant="contained"
                    onClick={() => openMutation.mutate()}
                    disabled={openMutation.isPending}
                    >
                    {openMutation.isPending ? 'Opening...' : 'Open new account'}
                </Button>
            </Box>

            {accounts.length === 0 ? (
                <Alert severity="info">You don't have any accounts yet. Open one to get started.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {accounts.map(account => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={account.id}>
                            <AccountCard account={account} component={Link} to={`/accounts/${account.id}`} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}