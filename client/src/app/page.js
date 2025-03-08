"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CartProvider, useCart } from "@/context/CartContext";
import BrandingAnimation from "@/components/BrandingAnimation";
import TableSelection from "@/components/TableSelection";
import MenuSection from "@/components/MenuSection";
import Cart from "@/components/Cart";

export default function Home() {
  const [showBranding, setShowBranding] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [mergeTablesMode, setMergeTablesMode] = useState(false);
  const [secondTable, setSecondTable] = useState(null);
  const [menuData, setMenuData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState({
    name: "Guest",
    preferences: [],
    location: "Table 5"
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Hide branding after 2 seconds
    const timer = setTimeout(() => {
      setShowBranding(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch menu data from TheMealDB API
    const fetchMenuData = async () => {
      setIsLoading(true);
      try {
        // Fetch different categories
        const categories = ["Starter", "Beef", "Chicken", "Dessert", "Vegetarian"];
        const menuByCategory = {};

        for (const category of categories) {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
          );
          const data = await response.json();
          
          // Add price and description (since API doesn't provide these)
          const processedMeals = data.meals.slice(0, 6).map(meal => ({
            ...meal,
            price: (Math.random() * 20 + 5).toFixed(2),
            description: `Delicious ${category.toLowerCase()} prepared with fresh ingredients.`
          }));
          
          menuByCategory[category] = processedMeals;
        }
        
        setMenuData(menuByCategory);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        toast({
          title: "Error",
          description: "Failed to load menu data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [toast]);

  const handleTableSelect = (tableId) => {
    if (!mergeTablesMode) {
      setSelectedTable(tableId);
    } else if (selectedTable && !secondTable) {
      setSecondTable(tableId);
      toast({
        title: "Tables Merged",
        description: `Table ${selectedTable} and Table ${tableId} have been merged.`,
      });
    }
  };

  const resetTableSelection = () => {
    setSelectedTable(null);
    setSecondTable(null);
    setMergeTablesMode(false);
  };

  // Main render logic with conditional rendering based on app state
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <AnimatePresence>
          {showBranding ? (
            <BrandingAnimation />
          ) : selectedTable === null ? (
            <TableSelection 
              onTableSelect={handleTableSelect} 
              mergeMode={mergeTablesMode}
              setMergeMode={setMergeTablesMode}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-screen"
            >
              {/* Header with user profile and cart */}
              <header className="sticky top-0 z-30 bg-white border-b border-[#E9E9EB] shadow-sm">
                <div className="container mx-auto py-3 px-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={resetTableSelection}
                        className="mr-2 text-[#686B78]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                      </Button>
                      <div>
                        <h1 className="text-xl font-bold text-[#282C3F]">TableServe</h1>
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-[#F8F8F8] text-[#686B78] border-[#E9E9EB]">
                            Table {selectedTable} {secondTable && `+ Table ${secondTable}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="text-[#686B78]"
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
                            className="relative bg-white border-[#E9E9EB] hover:bg-[#F8F8F8]"
                          >
                            <CartSummary />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md border-l border-[#E9E9EB]">
                          <Cart />
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                </div>
              </header>

              {/* User menu dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 right-4 z-40 bg-white shadow-lg rounded-lg border border-[#E9E9EB] w-64"
                  >
                    <div className="p-4 border-b border-[#E9E9EB]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#F8F8F8] flex items-center justify-center text-[#FC8019]">
                          {userProfile.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[#282C3F]">{userProfile.name}</p>
                          <p className="text-xs text-[#686B78]">{userProfile.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Button variant="ghost" className="w-full justify-start text-[#686B78] hover:text-[#FC8019] hover:bg-[#F8F8F8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        Edit Profile
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-[#686B78] hover:text-[#FC8019] hover:bg-[#F8F8F8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Order History
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-[#686B78] hover:text-[#FC8019] hover:bg-[#F8F8F8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H15a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0-.33 1.82l.06.06a2 2 0 0 1 0 2.83l.06.06a1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1.51 1H15a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09A1.65 1.65 0 0 0 13.4 15z"></path>
                        </svg>
                        Logout
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Menu sections */}
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <div className="space-y-10">
                  <MenuSection title="Starters" items={menuData.Starter || []} />
                  <MenuSection title="Main Course" items={[...(menuData.Beef || []), ...(menuData.Chicken || [])]} />
                  <MenuSection title="Vegetarian" items={menuData.Vegetarian || []} />
                  <MenuSection title="Desserts" items={menuData.Dessert || []} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CartProvider>
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
        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </>
  );
}
