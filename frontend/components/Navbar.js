"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Zap, HelpCircle, BarChart3, Calendar, LogOut, User } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, loading, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Navigation for unauthenticated users
  const publicNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Features", href: "/#features", icon: Zap },
    { name: "Support", href: "/support", icon: HelpCircle },
  ];

  // Navigation for authenticated users
  const privateNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Scheduled Crawls", href: "/scheduled-crawls", icon: Calendar },
  ];

  const navigation = isAuthenticated ? privateNavigation : publicNavigation;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth";
    }
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('auth_token=')[1]?.split(';')[0]}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always call the auth context logout to clear local state
      logout();
      setShowUserMenu(false);
      window.location.href = "/";
    }
  };

  return (
    <motion.nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-neutral-900/95 backdrop-blur-xl border-b border-[#00bf63]/20 shadow-2xl shadow-[#00bf63]/5"
          : "bg-neutral-900/80 backdrop-blur-md border-b border-neutral-700/50"
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-36 h-12 ">
                <img
                  src="/logo1.png"
                  alt="RankRocket"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium  group",
                      isActive
                        ? "text-[#00bf63]"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {/* Background effect */}
                    <motion.div
                      className={clsx(
                        "absolute inset-0 rounded-lg",
                        isActive
                          ? ""
                          : "bg-transparent group-hover:bg-white/5"
                      )}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-[#00bf63] rounded-full"
                        layoutId="activeTab"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ x: "-50%" }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <Icon
                        className={clsx(
                          "h-4 w-4",
                          isActive
                            ? "text-[#00bf63]"
                            : "text-gray-400 group-hover:text-[#00bf63]"
                        )}
                      />
                    </motion.div>
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Menu / Get Started Button */}
          <div className="hidden md:flex items-center">
            {loading ? (
              <motion.div
                className="w-8 h-8  border-t-[#00bf63] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isAuthenticated ? (
              <div className="relative user-menu">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:border-[#00bf63]/50 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00bf63] to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user?.full_name || user?.email}</span>
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-neutral-800/95 backdrop-blur-xl border border-neutral-700/50 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-neutral-700/50">
                          <p className="text-sm font-medium text-white">{user?.full_name || 'User'}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-neutral-700/50 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-2.5 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white text-sm font-semibold rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#00bf63]/25"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-[#00bf63]"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#00bf63] hover:border-[#00bf63]/30 transition-all duration-300"
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
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
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
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-4 border-t border-[#00bf63]/20 bg-neutral-800/50 backdrop-blur-xl rounded-b-lg">
                <div className="space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));
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
                            "flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg text-sm font-medium transition-all duration-300",
                            isActive
                              ? "bg-[#00bf63]/10 text-[#00bf63] border border-[#00bf63]/30"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <Icon
                            className={clsx(
                              "h-5 w-5 transition-colors duration-200",
                              isActive ? "text-[#00bf63]" : "text-gray-400"
                            )}
                          />
                          <span>{item.name}</span>

                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-[#00bf63] rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: navigation.length * 0.1,
                      duration: 0.3,
                    }}
                    className="pt-4 border-t border-[#00bf63]/20 mt-4 mx-2"
                  >
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-700/30 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00bf63] to-emerald-500 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user?.full_name || 'User'}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 border border-red-600/30 text-red-400 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-red-600/30"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          handleGetStarted();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#00bf63]/25"
                      >
                        Get Started
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
