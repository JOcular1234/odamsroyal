// // frontend/src/utils/adminAuth.js
import dotenv from 'dotenv';
dotenv.config();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://odamsroyal.onrender.com';

class SecureAdminAuth {
  constructor() {
    this.token = null;
    this.isInitialized = false;
  }

  init() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
      this.isInitialized = true;
    }
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken() {
    if (!this.isInitialized) {
      this.init();
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      document.cookie = 'admin_token=; Max-Age=0; path=/; SameSite=None; Secure';
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  async verifyToken() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/dashboard');
      return response.ok;
    } catch {
      return false;
    }
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions = {
      ...options,
      headers,
      credentials: 'include', // Ensure cookies are sent
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api${url}`, requestOptions);

      if (response.status === 401) {
        this.clearToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        throw new Error('Authentication failed');
      }

      return response;
    } catch (error) {
      console.error('Auth request failed:', error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      if (data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  }
}

const adminAuth = new SecureAdminAuth();
export default adminAuth;