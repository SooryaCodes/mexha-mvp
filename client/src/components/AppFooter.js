import { motion } from "framer-motion";

export default function AppFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-rose-500/5 blur-3xl"
        animate={{ 
          x: [0, 30, 0], 
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-red-500/5 blur-3xl"
        animate={{ 
          x: [0, -20, 0], 
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-rose-600">QuantumDine</h3>
            <p className="text-slate-400 text-sm">
              Experience the future of dining with our immersive culinary journey. Quantum-level taste, delivered to your table.
            </p>
            <div className="mt-6 flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 hover:bg-slate-700 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 hover:bg-slate-700 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400 hover:bg-slate-700 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </motion.a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-rose-400 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-rose-400 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-rose-400 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-rose-400 transition-colors duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to receive updates on new dishes and special offers.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 py-2 px-3 bg-slate-800 border border-slate-700 rounded-l-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button className="bg-gradient-to-r from-rose-500 to-red-500 text-white py-2 px-4 rounded-r-md hover:opacity-90 transition-opacity duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} QuantumDine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 