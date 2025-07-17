"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Facebook,
  Instagram,
  ArrowUp,
  Globe,
  Clock,
  Send,
  ExternalLink,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Award,
  Star,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "How it Works", href: "/how-it-works", icon: Zap },
    { name: "Features", href: "/features", icon: Star },
    { name: "Pricing", href: "/pricing", icon: TrendingUp },
    { name: "Documentation", href: "/docs", icon: FileText },
    { name: "API Reference", href: "/api", icon: Globe },
    { name: "Status Page", href: "/status", icon: Shield },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Partners", href: "/partners" },
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/support" },
    { name: "Community", href: "/community" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Webinars", href: "/webinars" },
    { name: "System Status", href: "/status" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
    { name: "Security", href: "/security" },
    { name: "Compliance", href: "/compliance" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      href: "https://github.com",
      icon: Github,
      color: "hover:text-gray-300",
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: Facebook,
      color: "hover:text-blue-500",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:text-pink-400",
    },
  ];

  return (
    <footer className="relative bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-700/50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-[#00bf63]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00bf63]/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div variants={fadeInUp} className="lg:col-span-2 p-4 mb-3">
                <div className="h-20 w-60 relative mb-4">
                    <img src="/logo1.png" alt="RankRocket Logo" className="h-full w-full" />
                </div>

               

              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Revolutionary AI-powered crawler that analyzes every aspect of
                your website, delivering actionable insights and optimization
                strategies in real-time.
              </p>

              {/* Contact Info */}
              {/* <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 rounded-lg bg-[#00bf63]/20 border border-[#00bf63]/30">
                    <Mail className="h-4 w-4 text-[#00bf63]" />
                  </div>
                  <span>support@rankrocket.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 rounded-lg bg-[#00bf63]/20 border border-[#00bf63]/30">
                    <Phone className="h-4 w-4 text-[#00bf63]" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <div className="p-2 rounded-lg bg-[#00bf63]/20 border border-[#00bf63]/30">
                    <Clock className="h-4 w-4 text-[#00bf63]" />
                  </div>
                  <span>24/7 Support Available</span>
                </div>
              </div> */}

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-8">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 ${social.color} transition-all duration-300 backdrop-blur-md hover:border-[#00bf63]/30`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                <Zap className="h-5 w-5 text-[#00bf63] mr-2" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group flex items-center space-x-3 text-gray-300 hover:text-[#00bf63] transition-colors duration-200"
                      >
                        <Icon className="h-4 w-4 text-gray-500 group-hover:text-[#00bf63] transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

         

            {/* Support & Legal */}
            <motion.div variants={fadeInUp}>
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                <Shield className="h-5 w-5 text-[#00bf63] mr-2" />
                Support & Legal
              </h4>
              <div className="space-y-6">
                <div>
                  <h5 className="text-gray-400 font-medium text-sm mb-3">
                    Support
                  </h5>
                  <ul className="space-y-2">
                    {support.slice(0, 3).map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-[#00bf63] transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-gray-400 font-medium text-sm mb-3">
                    Legal
                  </h5>
                  <ul className="space-y-2">
                    {legal.slice(0, 3).map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-[#00bf63] transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700/50 bg-neutral-800/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Copyright */}
                <div className="text-sm text-center">
                  <p className="text-gray-400">
                    ©{new Date().getFullYear()}{" "}
                    <span className="text-white font-medium">RankRocket</span>{" "}
                    powered by{" "}
                    <span className="text-[#00bf63] font-semibold">
                      StrontiumTechnologies
                    </span>
                  </p>
                </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
