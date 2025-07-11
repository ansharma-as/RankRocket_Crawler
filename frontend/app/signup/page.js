'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Rocket, ArrowLeft, AlertCircle, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUp() {
  const router = useRouter()
  const { register, loading, error, isAuthenticated, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false
    }
  })

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
  }, [formData])

  // Password strength checker
  useEffect(() => {
    const password = formData.password
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    const score = Object.values(requirements).filter(Boolean).length
    setPasswordStrength({ score, requirements })
  }, [formData.password])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await register(formData.email, formData.password, formData.fullName)
    
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'bg-red-500'
    if (passwordStrength.score < 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score < 2) return 'Weak'
    if (passwordStrength.score < 4) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
            <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-gray-400 group-hover:text-purple-400 transition-colors">Back to home</span>
          </Link>
          
          <motion.div 
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <Rocket className="h-8 w-8" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Create your account
          </h2>
          <p className="text-gray-400">
            Join RankRocket and boost your SEO
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Global Error */}
          {error && (
            <motion.div 
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
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
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
            </div>

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
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score < 2 ? 'text-red-400' :
                      passwordStrength.score < 4 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries({
                      'At least 8 characters': passwordStrength.requirements.length,
                      'One lowercase letter': passwordStrength.requirements.lowercase,
                      'One uppercase letter': passwordStrength.requirements.uppercase,
                      'One number': passwordStrength.requirements.number
                    }).map(([requirement, met]) => (
                      <div key={requirement} className={`flex items-center space-x-1 ${met ? 'text-green-400' : 'text-gray-400'}`}>
                        <Check className={`h-3 w-3 ${met ? 'opacity-100' : 'opacity-30'}`} />
                        <span>{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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

            {/* Confirm Password Field */}
            <div>
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
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-0 mt-1"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              I agree to the{' '}
              <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || passwordStrength.score < 3}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </motion.button>

          {/* Sign in link */}
          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              href="/signin" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}