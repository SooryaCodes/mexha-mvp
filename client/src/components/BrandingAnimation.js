"use client";

import { motion } from "framer-motion";

export default function BrandingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
          <motion.svg
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            width="120"
            height="120"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stylized plate icon */}
            <circle cx="100" cy="100" r="80" fill="#FC8019" />
            <circle cx="100" cy="100" r="70" fill="white" />
            <path d="M60 80C60 80 80 120 100 120C120 120 140 80 140 80" stroke="#FC8019" strokeWidth="8" strokeLinecap="round" />
          </motion.svg>
        </div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold text-[#FC8019] mb-2"
        >
          TableServe
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-[#282C3F] text-lg"
        >
          Self-ordering made simple
        </motion.p>
      </motion.div>
    </motion.div>
  );
} 