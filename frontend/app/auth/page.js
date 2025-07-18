'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { InlineLoader } from '@/components/LoadingSpinner'

export default function AuthPage() {
  const router = useRouter()
  const { login, register, loginWithGoogle, handleOAuthCallback, loading, error, isAuthenticated, clearError } = useAuth()
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Handle OAuth callback on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const success = urlParams.get('success')
    const error = urlParams.get('error')
    
    if (code || success || error) {
      handleOAuthCallback().then((result) => {
        if (result.success) {
          router.push('/dashboard')
        }
      })
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Clear errors when form changes
  useEffect(() => {
    if (error) {
      clearError()
    }
  }, [formData, isLogin])

  // Reset form when switching between login/register
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    })
    setValidationErrors({})
    clearError()
  }, [isLogin])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.fullName) {
        errors.fullName = 'Full name is required'
      } else if (formData.fullName.length < 2) {
        errors.fullName = 'Full name must be at least 2 characters'
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    let result
    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      result = await register(formData.email, formData.password, formData.fullName)
    }
    
    if (result.success) {
      router.push('/dashboard')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field-specific validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleGoogleAuth = async () => {
    const result = await loginWithGoogle()
    if (!result.success) {
      // Error will be handled by the auth context
      console.error('Google OAuth failed:', result.error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-900/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00bf63]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#00bf63]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md w-full space-y-8">
         

          {/* Auth Toggle */}
          <motion.div 
            className="flex bg-neutral-800/50 backdrop-blur-md border border-neutral-700/50 rounded-xl p-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-[#00bf63] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-[#00bf63] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </motion.div>

          {/* Form */}
          <motion.div
            className="p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Global Error */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {/* Full Name Field (Register only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          className="block w-full pl-10 pr-3 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      {validationErrors.fullName && (
                        <motion.p 
                          className="mt-1 text-sm text-red-400"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {validationErrors.fullName}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="block w-full pl-10 pr-3 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                  {validationErrors.email && (
                    <motion.p 
                      className="mt-1 text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {validationErrors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      className="block w-full pl-10 pr-12 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <motion.p 
                      className="mt-1 text-sm text-red-400"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {validationErrors.password}
                    </motion.p>
                  )}
                </div>

                {/* Confirm Password Field (Register only) */}
                <AnimatePresence>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          className="block w-full pl-10 pr-12 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all duration-200"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                          )}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <motion.p 
                          className="mt-1 text-sm text-red-400"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {validationErrors.confirmPassword}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember me / Terms (based on mode) */}
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.div 
                    key="login-options"
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 bg-neutral-700 border-neutral-600 rounded text-[#00bf63] focus:ring-[#00bf63] focus:ring-offset-0"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <Link 
                        href="/forgot-password" 
                        className="text-[#00bf63] hover:text-emerald-400 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="register-terms"
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 bg-neutral-700 border-neutral-600 rounded text-[#00bf63] focus:ring-[#00bf63] focus:ring-offset-0 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-400">
                      I agree to the{' '}
                      <Link href="/terms" className="text-[#00bf63] hover:text-emerald-400 transition-colors">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-[#00bf63] hover:text-emerald-400 transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#00bf63] to-emerald-500 hover:from-emerald-500 hover:to-[#00bf63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00bf63] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00bf63]/25"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <InlineLoader 
                    color="#ffffff" 
                    size={15} 
                    text={isLogin ? 'Signing in...' : 'Creating account...'} 
                  />
                ) : (
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                )}
              </motion.button>
            </div>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <span className="text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#00bf63] hover:text-emerald-400 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </motion.div>

          {/* Social OAuth */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-900/80 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <motion.button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-neutral-600 rounded-lg bg-neutral-800/50 backdrop-blur-md text-sm font-medium text-white hover:bg-neutral-700/50 hover:border-neutral-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <InlineLoader 
                    color="#ffffff" 
                    size={15} 
                    text="Connecting..." 
                  />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}