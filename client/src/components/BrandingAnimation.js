"use client";

import { motion } from "framer-motion";

export default function BrandingAnimation() {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-white z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Animated background elements */}
        <motion.div 
          className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-rose-500/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-rose-600/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        
        {/* Logo animation */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div 
              className="mb-4 inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  stroke="url(#paint0_linear)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E11D48" />
                    <stop offset="1" stopColor="#FB7185" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">Quantum</span>
              <span className="text-slate-800">Dine</span>
            </h1>
            <p className="text-slate-500 mt-2">Elevating Your Dining Experience</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 