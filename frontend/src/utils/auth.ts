import axios from 'axios';

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
  
  // Clear cookies
  document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'ngoToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  
  // Clear axios headers
  delete axios.defaults.headers.common['Authorization'];
};

// Logout functions
export const logout = () => {
  clearAllAuthData();
  window.location.href = '/admin/login';
};

export const logoutNgo = () => {
  clearAllAuthData();
  window.location.href = '/login';
};

// Smart logout - detects user type and redirects accordingly
export const smartLogout = () => {
  // Check current path to determine context
  const isAdminPath = window.location.pathname.startsWith('/admin');
  clearAllAuthData();
  
  // Prefer NGO context unless explicitly in admin context
  if (isAdminPath) {
    window.location.href = '/admin/login';
  } else {
    window.location.href = '/login';
  }
}; 