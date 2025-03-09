import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import Cart from "@/components/Cart";

export default function AppHeader({ userProfile, showUserMenu, setShowUserMenu, resetTableSelection, scrolled }) {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md bg-rose-600 border-b border-rose-500/50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-rose-500/10' : ''}`}>
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetTableSelection}
              className="mr-2 text-white hover:text-white hover:bg-rose-500/40 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-white">Quantum</span>Dine
              </h1>
              <div className="flex items-center">
                <Badge variant="outline" className="bg-rose-500/50 text-white border-rose-400/50 backdrop-blur-sm">
                  {userProfile.location}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="text-white hover:text-white hover:bg-rose-500/40 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {userProfile.name}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="relative bg-rose-500/50 border-rose-400/50 hover:bg-rose-400/50 hover:border-rose-300/50 text-white transition-all duration-300"
                >
                  <CartSummary />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md border-l border-rose-500/50 bg-rose-600/95 backdrop-blur-md">
                <Cart />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Cart summary component with item count badge
function CartSummary() {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <>
      <span className="mr-2">Cart</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-400 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {itemCount}
        </motion.span>
      )}
    </>
  );
}