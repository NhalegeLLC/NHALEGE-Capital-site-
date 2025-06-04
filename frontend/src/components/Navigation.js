import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

const Navigation = ({ currentPage }) => {
  const navItems = [
    { name: 'Home', href: '/', active: currentPage === 'home' },
    { name: 'About', href: '/about', active: currentPage === 'about' },
    { name: 'Services', href: '/services', active: currentPage === 'services' },
    { name: 'Capital 💼', href: '/capital', active: currentPage === 'capital', featured: true },
    { name: 'Contact', href: '/contact', active: currentPage === 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-platinum-600/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
              <span className="text-obsidian-900 font-bold text-xl">N</span>
            </div>
            <div className="text-xl font-bold gradient-text">NHALEGE</div>
          </motion.div>

          {/* Navigation Items */}
          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`relative font-semibold transition-all duration-300 ${
                  item.featured 
                    ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-900 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-gold-400/30' 
                    : item.active 
                      ? 'text-gold-400' 
                      : 'text-platinum-300 hover:text-white'
                }`}
                whileHover={{ scale: item.featured ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.featured && (
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-xl blur opacity-30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {item.featured && <BriefcaseIcon className="w-4 h-4" />}
                  {item.name}
                </span>
                {item.active && !item.featured && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 to-royal-400"
                    layoutId="activeTab"
                  />
                )}
              </motion.a>
            ))}
            
            {/* Admin Access (hidden link) */}
            <motion.a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'admin';
                window.location.reload();
              }}
              className="text-xs text-platinum-600 hover:text-platinum-400 transition-colors"
              title="Admin Access"
            >
              ⚙️
            </motion.a>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-10 h-10 rounded-full bg-obsidian-800 flex items-center justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;