import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function OrderDetailsLayout({ children }) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600 mr-2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
            <h1 className="text-xl font-bold text-gray-900">QuantumDine</h1>
          </div>
          <div className="text-sm text-gray-600">
            Table #12
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto max-w-7xl px-4 text-center text-gray-500 text-sm">
          <p>© 2023 FoodieHub. All rights reserved.</p>
          <p className="mt-2">Powered by AI-enhanced dining experiences</p>
        </div>
      </footer>
    </div>
  );
} 