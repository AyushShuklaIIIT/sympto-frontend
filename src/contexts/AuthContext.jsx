import React, { useReducer, useEffect, useMemo, useCallback } from 'react';
import { AUTH_ACTIONS, initialState, authReducer } from './authTypes';
import { AuthContext } from './authContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function safeReadJson(response) {
  const contentType = response.headers.get('content-type') || '';
  const text = await response.text().catch(() => '');
  if (!text) return {};

  if (!contentType.includes('application/json')) {
    // Avoid JSON.parse throwing for HTML error pages or empty bodies
    return { raw: text };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: parsedUser, token },
        });
      } catch (error) {
        console.log(error)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await safeReadJson(response);
        throw new Error(errorData?.error?.message || 'Login failed');
      }

      const data = await safeReadJson(response);

      // Backend returns: { success, message, data: { user, accessToken, refreshToken, ... } }
      const payload = data?.data && typeof data.data === 'object' ? data.data : data;
      const token = payload?.accessToken || payload?.token;
      const user = payload?.user;

      // Store in localStorage
      if (token) {
        localStorage.setItem('token', token);
        // Keep backward compatibility with other services in this repo
        localStorage.setItem('authToken', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await safeReadJson(response);
        throw new Error(errorData?.error?.message || 'Registration failed');
      }

      dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Password reset function
  const resetPassword = useCallback(async (email) => {
    dispatch({ type: AUTH_ACTIONS.RESET_PASSWORD_START });
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await safeReadJson(response);
        throw new Error(errorData?.error?.message || 'Password reset failed');
      }

      dispatch({ type: AUTH_ACTIONS.RESET_PASSWORD_SUCCESS });
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.RESET_PASSWORD_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    register,
    resetPassword,
    logout,
    clearError,
  }), [state, login, register, resetPassword, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}