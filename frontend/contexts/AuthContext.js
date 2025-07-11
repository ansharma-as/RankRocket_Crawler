'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
}

// Create context
const AuthContext = createContext()

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing session on mount
  useEffect(() => {
    const token = Cookies.get('auth_token')
    const userData = Cookies.get('user_data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token }
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
        Cookies.remove('auth_token')
        Cookies.remove('user_data')
      }
    }
    
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      })
      
      const { access_token, token_type } = response.data
      
      // Get user profile
      const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `${token_type} ${access_token}`
        }
      })
      
      const user = userResponse.data
      const token = access_token
      
      // Store in cookies
      Cookies.set('auth_token', token, { expires: 7 }) // 7 days
      Cookies.set('user_data', JSON.stringify(user), { expires: 7 })
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed'
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (email, password, fullName) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        full_name: fullName
      })
      
      // Auto-login after registration
      return await login(email, password)
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed'
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    Cookies.remove('auth_token')
    Cookies.remove('user_data')
    dispatch({ type: 'LOGOUT' })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Get authenticated axios instance
  const getAuthenticatedAxios = () => {
    const instance = axios.create({
      baseURL: API_BASE_URL
    })
    
    instance.interceptors.request.use((config) => {
      const token = state.token || Cookies.get('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )
    
    return instance
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    getAuthenticatedAxios
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext