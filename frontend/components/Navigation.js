'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, BarChart3, Home, TrendingUp, Calendar, Menu, X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Scheduled Crawls', href: '/scheduled-crawls', icon: Calendar },
  ]

  return (
    <motion.nav 
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled 
          ? 'bg-black/95 border-b border-purple-500/20 shadow-lg shadow-purple-500/10' 
          : 'bg-black border-b border-white/5'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="relative p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Rocket className="h-6 w-6" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-700 rounded-xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200">
                RankRocket
              </span>
              <motion.div
                className="h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      'relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group overflow-hidden',
                      isActive
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    )}
                  >
                    {/* Background animation */}
                    <motion.div
                      className={clsx(
                        'absolute inset-0 rounded-lg transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                          : 'bg-transparent group-hover:bg-white/5'
                      )}
                      whileHover={{ scale: 1.02 }}
                    />
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500"
                        layoutId="activeTab"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ x: '-50%' }}
                      />
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={clsx(
                        'h-4 w-4 transition-colors duration-300 relative z-10',
                        isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'
                      )} />
                    </motion.div>
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0, rotate: 0 }}
                      whileHover={{ scale: 1, rotate: 180 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkles className="h-3 w-3 text-purple-400" />
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#url-form"
                className="relative px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <span className="relative z-10">Start Analysis</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-all duration-200"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 border-t border-purple-500/20">
                <div className="space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={clsx(
                            'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                            isActive
                              ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border border-purple-500/30'
                              : 'text-gray-300 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon className={clsx(
                              'h-5 w-5 transition-colors duration-200',
                              isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-300'
                            )} />
                          </motion.div>
                          <span>{item.name}</span>
                          
                          {isActive && (
                            <motion.div
                              className="absolute right-3 w-2 h-2 bg-purple-500 rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                  
                  {/* Mobile CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.1, duration: 0.3 }}
                    className="pt-4 border-t border-purple-500/20 mt-4"
                  >
                    <Link
                      href="#url-form"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:from-purple-600 hover:to-purple-700"
                    >
                      Start Free Analysis
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}