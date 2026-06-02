import { createContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { login as apiLogin } from '../api/endpoints';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'jdbank.user';
const TOKEN_KEY = 'jdbank.token';

export function AuthProvider({ children }) {
    const queryClient = useQueryClient();

    // On first load, try to restore the user from localStorage
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        }
        catch {
            return null;
        }
    });

    // Listen for the signal from the Axios interceptor when a token expires
    useEffect(() => {
        function onExpired() {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
            queryClient.clear(); // wipe cached data when auth expires
        }
        window.addEventListener('jdbank.auth.expired', onExpired);
        return () => window.removeEventListener('jdbank.auth.expired', onExpired);
    }, [queryClient]);

    async function login(username, password) {
        const data = await apiLogin(username, password);
        localStorage.setItem(TOKEN_KEY, data.token);
        const userObj = { username: data.username, role: data.role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
        setUser(userObj);
        return userObj;
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        queryClient.clear(); // wipe cached data on logout
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}