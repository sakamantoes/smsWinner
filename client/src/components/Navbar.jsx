// src/components/Navbar.jsx - Enhanced Mobile-First Navbar
import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, ChevronRight, HomeIcon, FileText, Briefcase, PhoneCall  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    // Prevent body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "#home", icon: HomeIcon },
    { name: "About", href: "#about", icon: FileText },
    { name: "Services", href: "#services", icon: Briefcase },
    { name: "Contact", href: "#contact", icon: PhoneCall },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-red-500/20 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo with Red 3D Animated Globe */}
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 cursor-pointer flex items-center gap-2 group"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-8 h-8"
                >
                  <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <circle cx="50" cy="50" r="45" stroke="#dc2626" strokeWidth="3" fill="none" />
                    <ellipse cx="50" cy="50" rx="45" ry="15" stroke="#dc2626" strokeWidth="2" fill="none" />
                    <ellipse cx="50" cy="30" rx="38" ry="10" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                    <ellipse cx="50" cy="70" rx="38" ry="10" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                    <ellipse cx="50" cy="50" rx="15" ry="45" stroke="#dc2626" strokeWidth="2" fill="none" />
                    <ellipse cx="30" cy="50" rx="8" ry="45" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                    <ellipse cx="70" cy="50" rx="8" ry="45" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                    <path
                      d="M35,35 Q40,30 45,35 Q50,40 48,48 Q45,55 38,52 Q32,48 35,35Z"
                      fill="#dc2626"
                      opacity="0.4"
                    />
                    <path
                      d="M60,40 Q65,35 70,40 Q75,48 68,55 Q62,58 58,52 Q55,45 60,40Z"
                      fill="#ef4444"
                      opacity="0.4"
                    />
                    <circle cx="50" cy="50" r="48" stroke="#dc2626" strokeWidth="1" strokeOpacity="0.3" fill="none">
                      <animate
                        attributeName="r"
                        values="48;52;48"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </motion.div>
                
                {/* Pulsing Glow Rings */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-red-500/50"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-light to-red-dark bg-clip-text text-transparent">
                Smswinners
              </h1>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white focus:outline-none relative z-50"
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center items-center px-6">
              {/* Close button inside menu */}
              {/* <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white p-2"
                whileTap={{ scale: 0.9 }}
              >
                <X size={32} />
              </motion.button> */}

              {/* Logo in menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12"
                    >
                      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="45" stroke="#dc2626" strokeWidth="3" fill="none" />
                        <ellipse cx="50" cy="50" rx="45" ry="15" stroke="#dc2626" strokeWidth="2" fill="none" />
                        <ellipse cx="50" cy="50" rx="15" ry="45" stroke="#dc2626" strokeWidth="2" fill="none" />
                        <path d="M35,35 Q40,30 45,35 Q50,40 48,48 Q45,55 38,52 Q32,48 35,35Z" fill="#dc2626" opacity="0.4" />
                      </svg>
                    </motion.div>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-red-light to-red-dark bg-clip-text text-transparent">
                    Smswinners
                  </h2>
                </div>
                <p className="text-gray-400 text-sm">Premium Virtual Numbers Platform</p>
              </motion.div>

              {/* Navigation Links */}
              <div className="w-full max-w-sm space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-center justify-between px-6 py-4 text-white text-xl font-medium border-b border-white/10 hover:border-red-500/50 transition-all group"
                  >
                    <span className="flex items-center gap-3">
                     <link.icon className="text-red-500" size={24} />
                      <span>{link.name}</span>
                    </span>
                    <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all text-red-500" size={20} />
                  </motion.a>
                ))}
              </div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-8 border-t border-white/10 w-full max-w-sm"
              >
                <div className="space-y-3">
                  <a
                    href="mailto:wowwin96@gmail.com"
                    className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Mail size={20} />
                    <span>wowwin96@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <Phone size={20} />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex gap-6"
              >
                {["Twitter", "LinkedIn", "Facebook"].map((social, i) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    {social}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;