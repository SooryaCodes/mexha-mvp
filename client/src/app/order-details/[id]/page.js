"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const { items, clearCart } = useCart();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
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
  
  // Calculate total price including additional items
  const calculateTotal = () => {
    const baseTotal = orderData ? parseFloat(orderData.total) : 0;
    const additionalTotal = additionalItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + parseFloat(item.price), 0);
    
    return (baseTotal + additionalTotal).toFixed(2);
  };
  
  // Toggle additional item selection
  const toggleAdditionalItem = (id) => {
    setAdditionalItems(additionalItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };
  
  // Submit additional requests
  const submitAdditionalRequests = () => {
    // In a real app, you would send this to your backend
    alert("Your additional requests have been submitted!");
    
    // For demo purposes, we&apos;ll just update the local state
    const selectedItems = additionalItems.filter(item => item.selected);
    setOrderData({
      ...orderData,
      additionalItems: selectedItems,
      specialRequests,
      total: calculateTotal()
    });
  };
  
  // Fetch order data
  useEffect(() => {
    // In a real app, you would fetch this from your API
    // For demo purposes, we&apos;ll create mock data or use localStorage
    
    // Try to get from localStorage first
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const foundOrder = orderHistory.find(order => order.orderId.toString() === orderId);
    
    if (foundOrder) {
      setOrderData(foundOrder);
      setLoading(false);
    } else {
      // Create mock data if not found
      setTimeout(() => {
        setOrderData({
          orderId,
          items: items.length > 0 ? items : [
            {
              idMeal: "52874",
              strMeal: "Beef and Mustard Pie",
              strMealThumb: "https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg",
              price: "12.99",
              quantity: 1
            },
            {
              idMeal: "52927",
              strMeal: "Caesar Salad",
              strMealThumb: "https://www.themealdb.com/images/media/meals/qxuqtt1511724269.jpg",
              price: "8.99",
              quantity: 1
            }
          ],
          date: new Date().toISOString(),
          total: items.length > 0 
            ? items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0).toFixed(2)
            : "21.98"
        });
        setLoading(false);
      }, 1000);
    }
  }, [orderId, items]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order #{orderId}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Menu
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-100">
              <h3 className="font-medium text-rose-800">Order Details</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(orderData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{new Date(orderData.date).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Table:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Preparing
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Estimated Time:</span>
                <span className="font-medium">15-20 minutes</span>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-100">
              <h3 className="font-medium text-rose-800">Order Items</h3>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-gray-100">
                {orderData.items.map((item) => (
                  <li key={item.idMeal} className="py-3 flex justify-between">
                    <div className="flex items-center">
                      <Image 
                        src={item.strMealThumb} 
                        alt={item.strMeal} 
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.strMeal}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                
                {/* Show additional items if any are selected */}
                {additionalItems.filter(item => item.selected).map((item) => (
                  <li key={`additional-${item.id}`} className="py-3 flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-rose-100 rounded-md mr-3 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                          <path d="M5 12h14M12 5v14"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Additional Item</p>
                      </div>
                    </div>
                    <span className="font-medium">${parseFloat(item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${orderData.total}</span>
                </div>
                
                {/* Show additional items total if any are selected */}
                {additionalItems.some(item => item.selected) && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Additional Items</span>
                    <span className="font-medium">
                      ${additionalItems
                        .filter(item => item.selected)
                        .reduce((sum, item) => sum + parseFloat(item.price), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${(parseFloat(calculateTotal()) * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-rose-600">${(parseFloat(calculateTotal()) * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-100">
              <h3 className="font-medium text-rose-800">Additional Requests</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <Textarea
                  placeholder="Any special requests for your order? (e.g., allergies, preparation preferences)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Items
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        item.selected 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleAdditionalItem(item.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleAdditionalItem(item.id)}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {parseFloat(item.price) > 0 ? `$${item.price}` : 'Free'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={submitAdditionalRequests}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                >
                  Submit Additional Requests
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-6">
          {/* AI Nutritional Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <h3 className="font-medium text-blue-800">AI Nutritional Insights</h3>
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Powered by AI</span>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Based on your order, here&apos;s a nutritional breakdown and health insights:
                </p>
              </div>
              
              {/* Nutritional Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-1">
                      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                      <path d="M2 20h20"></path>
                      <path d="M14 12v.01"></path>
                    </svg>
                    <span className="font-medium text-blue-800">Calories</span>
                  </div>
                  <p className="text-blue-900 text-lg font-bold">~850 kcal</p>
                  <p className="text-xs text-blue-700">42% of daily intake</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-1">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="font-medium text-green-800">Protein</span>
                  </div>
                  <p className="text-green-900 text-lg font-bold">32g</p>
                  <p className="text-xs text-green-700">64% of daily intake</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-1">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                    <span className="font-medium text-yellow-800">Carbs</span>
                  </div>
                  <p className="text-yellow-900 text-lg font-bold">65g</p>
                  <p className="text-xs text-yellow-700">25% of daily intake</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 mr-1">
                      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path>
                      <path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"></path>
                    </svg>
                    <span className="font-medium text-red-800">Fat</span>
                  </div>
                  <p className="text-red-900 text-lg font-bold">28g</p>
                  <p className="text-xs text-red-700">43% of daily intake</p>
                </div>
              </div>
              
              {/* Health Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Health Insights</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-sm text-gray-700">Rich in essential amino acids from protein sources</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 mr-2 mt-0.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-sm text-gray-700">Contains antioxidants from fresh vegetables</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 mr-2 mt-0.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <span className="text-sm text-gray-700">Moderately high in sodium - consider drinking extra water</span>
                  </li>
                </ul>
              </div>
              
              {/* Dietary Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">High Protein</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Contains Vegetables</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Moderate Carbs</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Gluten Containing</span>
              </div>
              
              {/* Recommendations */}
              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Personalized Recommendations</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2 mt-0.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm text-gray-700">Consider adding a side salad to increase fiber intake</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2 mt-0.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span className="text-sm text-gray-700">Drink at least 16oz of water with this meal</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-100">
              <h3 className="font-medium text-rose-800">Order Status</h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
                
                <div className="ml-8 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Order Received</h4>
                      <p className="text-sm text-gray-500">{new Date(orderData.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Preparing</h4>
                      <p className="text-sm text-gray-500">{new Date(new Date(orderData.date).getTime() + 5 * 60000).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Almost Ready</h4>
                      <p className="text-sm text-gray-500">Estimated: {new Date(new Date(orderData.date).getTime() + 15 * 60000).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="relative opacity-50">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-400">Served</h4>
                      <p className="text-sm text-gray-400">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Place New Order Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            <div className="p-4">
              <Button 
                onClick={() => {
                  clearCart();
                  router.push('/');
                }}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                Place New Order
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}