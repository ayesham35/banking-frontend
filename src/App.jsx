import { Routes, Route, Navigate } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { LoginPage } from './routes/LoginPage';
import { AccountsPage } from './routes/AccountsPage';
import { AccountDetailPage } from './routes/AccountDetailPage';
import { NotFoundPage } from './routes/NotFoundPage';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
      <>
        <AppHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/accounts/:id" element={<AccountDetailPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </>
  );
}