import axios from 'axios';

// Define a simple router interface with the methods we need
interface RouterLike {
    push(url: string): void;
    replace(url: string): void;
    prefetch?(url: string): void;
}

// Helper to get token and set axios header
export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return token;
    }
    return null;
};

export const getNgoAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ngoToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return token;
    }
    return null;
};

// Token setters and clearers
export const setAuthToken = (token: string) => {
    if (token) {
        // Set token to cookie
        document.cookie = `adminToken=${token}; path=/; max-age=2592000`; // 30 days
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove token from cookie
        document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        // Remove axios default header
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const setNgoAuthToken = (token: string) => {
    if (token) {
        // Set token to cookie
        document.cookie = `ngoToken=${token}; path=/; max-age=2592000`; // 30 days
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove token from cookie
        document.cookie = 'ngoToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        // Remove axios default header
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Authentication checkers
export const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
};

export const isNgoAuthenticated = () => {
    const token = getNgoAuthToken();
    return !!token;
};

// Clear all auth data
const clearAllAuthData = () => {
    // Clear localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('ngoToken');
    localStorage.removeItem('ngoUser');
    localStorage.removeItem('pendingRedirect');

    // Clear cookies
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'ngoToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];
};

// Next.js friendly logout functions that accept a router
export const logoutWithRouter = (router: RouterLike | null) => {
    clearAllAuthData();

    if (router) {
        // Use Next.js navigation
        router.push('/admin/login');
    } else {
        // Fallback to direct navigation
        window.location.href = '/admin/login';
    }
};

export const logoutNgoWithRouter = (router: RouterLike | null) => {
    clearAllAuthData();

    if (router) {
        // Use Next.js navigation
        router.push('/login');
    } else {
        // Fallback to direct navigation
        window.location.href = '/login';
    }
};

export const smartLogoutWithRouter = (router: RouterLike | null) => {
    clearAllAuthData();

    if (router) {
        router.push('/login');
    } else {
        window.location.href = '/login';
    }
};

// Legacy methods for backward compatibility
export const logout = () => {
    clearAllAuthData();
    window.location.href = '/admin/login';
};

export const logoutNgo = () => {
    clearAllAuthData();
    window.location.href = '/login';
};
