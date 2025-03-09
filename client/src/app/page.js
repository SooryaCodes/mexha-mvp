"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { CartProvider } from "@/context/CartContext";

// Import modularized components
import BrandingAnimation from "@/components/BrandingAnimation";
import TableSelection from "@/components/TableSelection";
import AppHeader from "@/components/AppHeader";
import UserMenu from "@/components/UserMenu";
import HeroSection from "@/components/HeroSection";
import MenuDisplay from "@/components/MenuDisplay";
import AppFooter from "@/components/AppFooter";
import { fetchMenuData } from "@/lib/api";

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
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Menu data ref to prevent unnecessary API calls
  const menuDataRef = useRef(null);

  useEffect(() => {
    // Hide branding after 2 seconds
    const timer = setTimeout(() => {
      setShowBranding(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Add scroll listener for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch menu data
  useEffect(() => {
    const loadMenuData = async () => {
      if (menuDataRef.current) {
        setMenuData(menuDataRef.current);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await fetchMenuData();
        menuDataRef.current = data;
        setMenuData(data);
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

    loadMenuData();
  }, [toast]);

  const handleTableSelect = (tableId) => {
    if (!mergeTablesMode) {
      // Single table selection
      setSelectedTable(tableId);
      setUserProfile(prev => ({
        ...prev,
        location: `Table ${tableId}`
      }));
      
      // Show confirmation toast
      toast({
        title: "Table Selected",
        description: `You've selected Table ${tableId}`,
      });
    } else {
      // Merge tables mode - we already have the current table
      if (selectedTable === null) {
        // This shouldn't happen in the new implementation
        setSelectedTable(tableId);
      }
      
      // Set the second table
      setSecondTable(tableId);
      setUserProfile(prev => ({
        ...prev,
        location: `Table ${selectedTable} and Table ${tableId}`
      }));
      
      toast({
        title: "Tables Merged",
        description: `Table ${selectedTable} and Table ${tableId} have been merged.`,
      });
      
      // Turn off merge mode after successful merge
      setMergeTablesMode(false);
    }
  };

  const resetTableSelection = () => {
    setSelectedTable(null);
    setSecondTable(null);
    setMergeTablesMode(false);
  };
  
  // Filter menu items based on search query and active category
  const getFilteredMenuItems = () => {
    if (!menuData || Object.keys(menuData).length === 0) return [];
    
    const allItems = Object.values(menuData).flat();
    
    return allItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.strMeal.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || 
        item.category.toLowerCase() === activeCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  };

  // Group menu items by category for display
  const getMenuSections = () => {
    if (activeCategory !== 'all') {
      const categoryItems = menuData[activeCategory] || [];
      return [{ title: activeCategory, items: categoryItems }];
    } else if (searchQuery) {
      return [{ title: "Search Results", items: getFilteredMenuItems() }];
    } else {
      return Object.entries(menuData).map(([category, items]) => ({
        title: category,
        items: items
      }));
    }
  };

  // Main render logic with conditional rendering based on app state
  return (
    <CartProvider>
      <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">
        <AnimatePresence>
          {showBranding ? (
            <BrandingAnimation />
          ) : selectedTable === null ? (
            <TableSelection 
              onTableSelect={handleTableSelect} 
              mergeMode={mergeTablesMode}
              setMergeMode={setMergeTablesMode}
              currentTable={5}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col min-h-screen w-full"
            >
              <AppHeader 
                userProfile={userProfile}
                showUserMenu={showUserMenu}
                setShowUserMenu={setShowUserMenu}
                resetTableSelection={resetTableSelection}
                scrolled={scrolled}
              />
              
              <AnimatePresence>
                {showUserMenu && (
                  <UserMenu userProfile={userProfile} />
                )}
              </AnimatePresence>

              <main className="flex-1 w-full max-w-full">
                <HeroSection 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  menuData={menuData}
                />

                <MenuDisplay 
                  isLoading={isLoading}
                  getFilteredMenuItems={getFilteredMenuItems}
                  getMenuSections={getMenuSections}
                  setSearchQuery={setSearchQuery}
                  setActiveCategory={setActiveCategory}
                />
              </main>

              <AppFooter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CartProvider>
  );
}
