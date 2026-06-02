# JD Bank Frontend

A full-stack banking frontend that connects to the JD Bank Spring Boot REST API.

## Tech Stack

- **React 19** with Vite
- **Material UI v9** — component library
- **TanStack Query v5** — server state management
- **React Router v7** — client-side routing
- **Axios** — HTTP client with interceptors
- **Formik + Yup** — form handling and validation

## Features

- JWT authentication with token persistence
- Protected routes — unauthenticated users redirected to login
- View all bank accounts
- Open new accounts
- Deposit, withdraw, and transfer funds
- Transaction history per account
- Idempotency keys on all money operations to prevent duplicate charges
- Automatic token expiration handling

## Getting Started

### Prerequisites
- Node.js 18+
- JD Bank Spring Boot API running on `http://localhost:8080`

### Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Backend

This app requires the JD Bank Spring Boot API.  
Repository: [banking-api](https://github.com/ayesham35/banking-and-transfer-REST-API)
