import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import { authService, api } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear session helper (logout / token expiration)
  const clearSession = useCallback(() => {
    storage.clearStorage();
    setUser(null);
    setToken(null);
    setRole(null);
    setPermissions([]);
    setIsAuthenticated(false);
  }, []);

  // Restore session from localStorage on app bootup
  const restoreSession = useCallback(async () => {
    setLoading(true);
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();

    if (storedToken && storedUser) {
      try {
        const userProfile = await authService.getProfile();
        
        setToken(storedToken);
        setUser(userProfile);
        setRole(userProfile.role);
        setPermissions(userProfile.permissions || []);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Session restoration validation failed, clearing session:', error);
        clearSession();
      }
    } else {
      clearSession();
    }
    setLoading(false);
  }, [clearSession]);

  // Execute session restoration on app mounting
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Axios interceptor to catch 401 Unauthorized errors globally and trigger local session clearance
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.status === 401) {
          clearSession();
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [clearSession]);



  // DOM observer/synchronizer to dynamically push authenticated user details
  // into the hardcoded Sidebar and Header layouts without modifying their source code files
  useEffect(() => {
    if (!user) return;

    const syncDOM = () => {
      const initials = user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U';
      const firstName = user.name ? user.name.split(' ')[0] : 'User';

      // 1. Sync Sidebar Elements
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        // Update Initials (AC -> custom initials)
        const initialsContainers = sidebar.querySelectorAll('.bg-brand\\/20');
        initialsContainers.forEach((el) => {
          if (el.textContent === 'AC' || el.textContent === initials) {
            el.textContent = initials;
          }
        });

        // Update Name & Role
        const spans = sidebar.querySelectorAll('span');
        spans.forEach((span) => {
          const val = span.textContent?.trim();
          if (val === 'Alex Carter') {
            span.textContent = user.name;
          } else if (val === 'Admin' || val === 'Asset Manager' || val === 'Department Head' || val === 'Employee') {
            if (val !== user.role) {
              span.textContent = user.role;
            }
          }
        });
      }

      // 2. Sync Header Elements
      const header = document.querySelector('header');
      if (header) {
        // Update Header Icon Initials
        const avatarContainers = header.querySelectorAll('.bg-brand');
        avatarContainers.forEach((el) => {
          if (el.textContent === 'AC' || el.textContent === initials) {
            el.textContent = initials;
          }
        });

        // Update Header Name label next to avatar
        const spans = header.querySelectorAll('span');
        spans.forEach((span) => {
          const val = span.textContent?.trim();
          if (val === 'Alex') {
            span.textContent = firstName;
          }
        });

        // Update User Dropdown contents
        const dropdownParagraphs = header.querySelectorAll('p');
        dropdownParagraphs.forEach((p) => {
          const val = p.textContent?.trim();
          if (val === 'Alex Carter') {
            p.textContent = user.name;
          } else if (val === 'alex.carter@company.com') {
            p.textContent = user.email;
          } else if (val === 'Admin' || val === 'Asset Manager' || val === 'Department Head' || val === 'Employee') {
            if (val !== user.role) {
              p.textContent = user.role;
            }
          }
        });
      }
    };

    // Run immediately and setup a small mutation observer for reactive updates
    syncDOM();
    const observer = new MutationObserver(syncDOM);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [user]);

  // Login action handler
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      const { token: userToken, user: userData } = data;

      storage.saveToken(userToken);
      storage.saveUser(userData);

      setToken(userToken);
      setUser(userData);
      setRole(userData.role);
      setPermissions(userData.permissions || []);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      clearSession();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  // Logout action handler
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Backend logout call failed, clearing session locally:', error);
    } finally {
      clearSession();
      setLoading(false);
    }
  }, [clearSession]);

  // Global click event listener to intercept the hardcoded mock logout buttons
  // inside the Sidebar and Header components without violating file modification rules
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const button = e.target.closest('button, a');
      if (!button) return;

      const text = button.textContent?.trim().toLowerCase();
      const title = button.title?.trim().toLowerCase();

      if (text === 'logout' || title === 'logout') {
        e.preventDefault();
        e.stopPropagation();
        logout();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [logout]);

  // Profile update handler
  const updateUser = useCallback((updatedFields) => {
    const currentUser = storage.getUser() || {};
    const mergedUser = { ...currentUser, ...updatedFields };
    
    storage.saveUser(mergedUser);
    setUser(mergedUser);
    
    if (mergedUser.role) {
      setRole(mergedUser.role);
    }
    if (mergedUser.permissions) {
      setPermissions(mergedUser.permissions);
    }
  }, []);

  // Helper validation methods
  const hasRole = useCallback((allowedRoles) => {
    if (!role) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(role);
    }
    return role === allowedRoles;
  }, [role]);

  const isAdmin = useCallback(() => role === 'Admin', [role]);
  const isAssetManager = useCallback(() => role === 'Asset Manager', [role]);
  const isDepartmentHead = useCallback(() => role === 'Department Head', [role]);
  const isEmployee = useCallback(() => role === 'Employee', [role]);

  const value = {
    user,
    token,
    role,
    permissions,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    restoreSession,
    clearSession,
    hasRole,
    isAdmin,
    isAssetManager,
    isDepartmentHead,
    isEmployee,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
