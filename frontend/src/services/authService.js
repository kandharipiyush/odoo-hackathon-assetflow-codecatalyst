import axios from 'axios';
import { getToken } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance for global API consumption
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach authorization bearer token dynamically
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Toggle mock authentication for frontend development (can be switched off once backend APIs are provided)
const USE_MOCK = true;

// Mock database of users mapped by credentials
const MOCK_USERS = {
  'admin@company.com': {
    id: 'usr-001',
    name: 'Alex Carter',
    email: 'admin@company.com',
    role: 'Admin',
    permissions: ['all_access', 'write_assets', 'approve_requests', 'audit_assets'],
  },
  'manager@company.com': {
    id: 'usr-002',
    name: 'Sarah Jenkins',
    email: 'manager@company.com',
    role: 'Asset Manager',
    permissions: ['write_assets', 'approve_requests', 'audit_assets'],
  },
  'head@company.com': {
    id: 'usr-003',
    name: 'David Miller',
    email: 'head@company.com',
    role: 'Department Head',
    permissions: ['approve_requests'],
  },
  'employee@company.com': {
    id: 'usr-004',
    name: 'John Doe',
    email: 'employee@company.com',
    role: 'Employee',
    permissions: [],
  },
};

// Helper for simulating network delay in mock mode
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Logs in a user using credentials
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} - { token, user }
   */
  login: async (credentials) => {
    if (USE_MOCK) {
      await delay(600); // Simulate api latency
      const user = MOCK_USERS[credentials.email.toLowerCase()];
      if (user && credentials.password === 'password') {
        return {
          token: `mock_jwt_token_${user.role.replace(' ', '_').toLowerCase()}`,
          user,
        };
      }
      const err = new Error('Invalid email or password. Use a mock email (e.g. admin@company.com) and password "password".');
      err.status = 401;
      throw err;
    }

    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registers a new user
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  signup: async (userData) => {
    if (USE_MOCK) {
      await delay(800);
      return {
        message: 'Signup successful (Mock)',
        user: {
          id: `usr-${Math.random().toString(36).substr(2, 9)}`,
          ...userData,
          role: userData.role || 'Employee',
          permissions: [],
        },
      };
    }

    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  /**
   * Logs out the current user session
   * @returns {Promise<object>}
   */
  logout: async () => {
    if (USE_MOCK) {
      await delay(300);
      return { message: 'Logged out successfully (Mock)' };
    }

    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Refreshes the existing session token
   * @returns {Promise<object>}
   */
  refreshSession: async () => {
    if (USE_MOCK) {
      await delay(300);
      return { token: 'mock_jwt_token_refreshed' };
    }

    const response = await api.post('/auth/refresh');
    return response.data;
  },

  /**
   * Retrieves the authenticated user's profile info
   * @returns {Promise<object>}
   */
  getProfile: async () => {
    if (USE_MOCK) {
      await delay(400);
      const token = getToken();
      if (!token) {
        const err = new Error('Unauthorized');
        err.status = 401;
        throw err;
      }
      
      const roleStr = token.replace('mock_jwt_token_', '');
      const matchedEmail = Object.keys(MOCK_USERS).find(
        (email) => MOCK_USERS[email].role.replace(' ', '_').toLowerCase() === roleStr
      );
      
      if (matchedEmail) {
        return MOCK_USERS[matchedEmail];
      }
      
      throw new Error('Invalid mock session token');
    }

    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Verifies the authenticity of a token
   * @param {string} token 
   * @returns {Promise<object>}
   */
  verifyToken: async (token) => {
    if (USE_MOCK) {
      await delay(300);
      if (token && token.startsWith('mock_jwt_token_')) {
        return { valid: true };
      }
      return { valid: false };
    }

    const response = await api.post('/auth/verify', { token });
    return response.data;
  },
};
