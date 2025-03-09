"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Use localStorage to persist cart items between sessions
  const [items, setItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('cartItems');
      return savedItems ? JSON.parse(savedItems) : [];
    }
    return [];
  });
  
  // Add state for cart sidebar visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Update localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.idMeal === item.idMeal);
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.idMeal === item.idMeal
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });
    
    // Open cart sidebar when adding items
    setIsCartOpen(true);
  };

  const updateItemQuantity = (id, quantity) => {
    // Use functional update to prevent unnecessary re-renders
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.idMeal === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.idMeal !== id));
  };

  const clearCart = () => {
    setItems([]);
  };
  
  // Add functions to control cart visibility
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  // Add a memoized value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    openCart,
    closeCart
  }), [items, isCartOpen]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
} 