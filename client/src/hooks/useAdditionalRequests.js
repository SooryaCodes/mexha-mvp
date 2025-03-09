"use client";

import { useState } from 'react';

export function useAdditionalRequests() {
  const [specialRequests, setSpecialRequests] = useState("");
  const [additionalItems, setAdditionalItems] = useState([
    { id: 1, name: "Extra Mayonnaise", price: "0.50", selected: false },
    { id: 2, name: "Extra Ketchup", price: "0.50", selected: false },
    { id: 3, name: "Extra Water", price: "1.00", selected: false },
    { id: 4, name: "Extra Napkins", price: "0.00", selected: false },
    { id: 5, name: "Cutlery Set", price: "0.00", selected: false },
    { id: 6, name: "Extra Cheese", price: "1.50", selected: false },
    { id: 7, name: "Extra Sauce", price: "0.75", selected: false },
    { id: 8, name: "Gluten-Free Option", price: "2.00", selected: false },
  ]);
  
  // Toggle additional item selection
  const toggleAdditionalItem = (id) => {
    setAdditionalItems(additionalItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };
  
  // Calculate additional items total
  const calculateAdditionalTotal = () => {
    return additionalItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);
  };
  
  // Get selected additional items
  const getSelectedItems = () => {
    return additionalItems.filter(item => item.selected);
  };
  
  return {
    specialRequests,
    setSpecialRequests,
    additionalItems,
    toggleAdditionalItem,
    calculateAdditionalTotal,
    getSelectedItems
  };
} 