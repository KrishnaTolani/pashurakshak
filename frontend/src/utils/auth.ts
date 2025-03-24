import axios from 'axios';

// Admin authentication functions
export const setAuthToken = (token: string) => {
  if (token) {
    // Set token to cookie
    document.cookie = `adminToken=${token}; path=/`;
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token from cookie
    document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  }
};

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

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  setAuthToken('');
  window.location.href = '/admin/login';
};

// NGO authentication functions
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

export const isNgoAuthenticated = () => {
  const token = getNgoAuthToken();
  return !!token;
};

export const logoutNgo = () => {
  localStorage.removeItem('ngoToken');
  localStorage.removeItem('ngoUser');
  setNgoAuthToken('');
  document.cookie = 'ngoToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  window.location.href = '/login';
}; 