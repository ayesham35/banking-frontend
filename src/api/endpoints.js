import { api } from './client';

// Auth
export const login = (username, password) =>
    api.post('/api/auth/login', { username, password }).then(r => r.data);

export const register = (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }).then(r => r.data);

// Accounts - read operations use v1
export const listAccounts = () =>
    api.get('/api/v1/accounts').then(r => r.data);

export const getAccount = (id) =>
    api.get(`/api/v1/accounts/${id}`).then(r => r.data);

export const getTransactionHistory = (id) =>
    api.get(`/api/v1/accounts/${id}/transactions`).then(r => r.data);

// Money operations - use v2 with idempotency keys
export const openAccount = () =>
    api.post('/api/v2/accounts', {}, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
    }).then(r => r.data);

export const deposit = (accountId, amount, idempotencyKey) =>
    api.post(`/api/v2/accounts/${accountId}/deposits`,
        { amount },
        { headers : { 'Idempotency-Key': idempotencyKey } }
    ).then(r => r.data);

export const withdraw = (accountId, amount, idempotencyKey) =>
    api.post(`/api/v2/accounts/${accountId}/withdrawals`,
        { amount },
        { headers: { 'Idempotency-Key': idempotencyKey } }
        ).then(r => r.data);

export const transfer = (accountId, toAccountNumber, amount, description, idempotencyKey) =>
    api.post(`/api/v2/accounts/${accountId}/transfers`,
        { toAccountNumber, amount, description },
        { headers: { 'Idempotency-Key': idempotencyKey } }
    ).then(r => r.data);

