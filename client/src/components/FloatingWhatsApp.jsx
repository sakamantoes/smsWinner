// src/components/FloatingWhatsApp.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "09074705972"; // Replace with your WhatsApp number

  const message =
    "Hello! I'm interested in Smswinners services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
      >
        {/* Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-green-500 blur-xl"
        />

        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="
            relative
            flex
            items-center
            justify-center
            w-16
            h-16
            rounded-full
            bg-gradient-to-br
            from-green-400
            to-green-600
            shadow-2xl
            shadow-green-500/40
            border
            border-white/10
            backdrop-blur-md
          "
        >
          <FaWhatsapp className="text-white text-4xl" />
        </motion.button>
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 220,
              }}
              className="
                fixed
                bottom-28
                right-6
                z-50
                w-[90vw]
                max-w-md
                rounded-3xl
                overflow-hidden
                border
                border-green-500/20
                bg-gradient-to-br
                from-gray-900
                to-black
                shadow-2xl
              "
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-700 p-5 flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <FaWhatsapp className="text-green-500 text-3xl" />
                  </div>

                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg">
                    WhatsApp Support
                  </h3>

                  <p className="text-green-100 text-sm">
                    Replies within minutes
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="ml-auto text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed">
                  👋 Welcome to Smswinners.
                  <br />
                  Need virtual numbers, OTP activations, or
                  Google Voice services?
                </p>

                {/* Features */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-500">✓</span>
                    Instant delivery
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-500">✓</span>
                    Secure activation
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-500">✓</span>
                    24/7 support
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <motion.a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      flex-1
                      py-3
                      rounded-xl
                      text-center
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-green-500
                      to-green-600
                      shadow-lg
                      shadow-green-500/30
                    "
                  >
                    Chat on WhatsApp →
                  </motion.a>

                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      px-5
                      rounded-xl
                      border
                      border-gray-700
                      text-gray-300
                      hover:bg-white/5
                    "
                  >
                    Later
                  </motion.button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-5">
                  Secure and trusted communication
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingWhatsApp;