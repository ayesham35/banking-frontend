import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT token to every request automatically
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jdbank.token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses centrally
api.interceptors.response.use(
    response => {
        // Log a warning if we're hitting a deprecated v1 endpoint
        if (response.headers.deprecation === 'true') {
            console.warn(
                `Deprecated endpoint: ${response.config.url} — successor: ${response.headers.link || 'unknown'}`
            );
        }
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            // Token expired - clear it and notify AuthContext
            localStorage.removeItem('jdbank.token');
            window.dispatchEvent(new Event('jdbank.auth.expired'));
        }
        return Promise.reject(error);
    }
);