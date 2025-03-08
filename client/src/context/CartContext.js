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
  
  // Add a memoized value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
  }), [items]);

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