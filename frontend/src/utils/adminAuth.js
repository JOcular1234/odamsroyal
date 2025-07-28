// // frontend/src/utils/adminAuth.js
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// export function verifyAdminToken(token) {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     if (decoded.role === 'admin') return decoded;
//     return null;
//   } catch {
//     return null;
//   }
// }


// frontend/src/utils/adminAuth.js
// IMPORTANT: Delete the old file and replace with this secure version

// The old approach was insecure - never verify JWT tokens on the frontend!
// JWT secrets should never be exposed to the browser.

// This file now provides secure client-side auth utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://odamsroyal.onrender.com/api';

class SecureAdminAuth {
  constructor() {
    this.token = null;
    this.isInitialized = false;
  }

  // Initialize auth manager
  init() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
      this.isInitialized = true;
    }
  }

  // Set token securely
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  // Get token
  getToken() {
    if (!this.isInitialized) {
      this.init();
    }
    return this.token;
  }

  // Clear token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      // Also clear cookie
      document.cookie = 'admin_token=; Max-Age=0; path=/;';
    }
  }

  // Check if token exists and is not obviously expired
  // Note: We don't verify the token here - that's done on the backend
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Basic check if token is properly formatted
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Check if token is expired (basic client-side check)
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  // Verify token with backend (secure verification)
  async verifyToken() {
    try {
      const response = await this.makeAuthenticatedRequest('/admin/dashboard');
      return response.ok;
    } catch {
      return false;
    }
  }

  // Make authenticated request
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
      credentials: 'include',
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);
      
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

  // Login method
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
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

  // Logout method
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
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

// Export singleton instance
const adminAuth = new SecureAdminAuth();

// Legacy export for compatibility (if needed)
export function verifyAdminToken(token) {
  console.warn('verifyAdminToken is deprecated and insecure. Use adminAuth.verifyToken() instead.');
  return null; // Always return null for security
}

export default adminAuth;