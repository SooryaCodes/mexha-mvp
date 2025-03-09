"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items, updateItemQuantity, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const router = useRouter();
  
  const totalPrice = items.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  ).toFixed(2);

  const handleQuantityChange = (id, newQuantity) => {
    setIsUpdating(id);
    
    // Use setTimeout to prevent UI jank during updates
    setTimeout(() => {
      if (newQuantity <= 0) {
        removeItem(id);
      } else {
        updateItemQuantity(id, newQuantity);
      }
      setIsUpdating(null);
    }, 100);
  };

  const handleCheckout = () => {
    setCheckoutStep(1);
  };

  const handleConfirmOrder = () => {
    setCheckoutStep(2);
    
    // Generate a random order ID
    const orderId = Math.floor(Math.random() * 10000);
    
    // In a real app, you would send the order to a backend here
    setTimeout(() => {
      // Move to order details step with the order data
      setCheckoutStep(3);
      
      // If you need to store order history, you could use localStorage or a state management solution
      const orderData = {
        orderId,
        items: [...items],
        date: new Date().toISOString(),
        total: totalPrice
      };
      
      // Optional: Store in localStorage for order history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      // Navigate to order details page
      router.push(`/order-details/${orderId}`);
    }, 2000);
  };

  // Enhanced AI-driven suggestions with more sophisticated logic
  useEffect(() => {
    if (items.length > 0) {
      // Hardcoded suggestions to simulate AI recommendations
      const recommendations = [
        {
          idMeal: "rec1",
          strMeal: "Garlic Bread",
          strMealThumb: "https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg",
          price: "3.99",
          type: "side",
          matchScore: 95,
          tag: "Popular pairing"
        },
        {
          idMeal: "rec2",
          strMeal: "Tiramisu",
          strMealThumb: "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
          price: "5.99",
          type: "dessert",
          matchScore: 88,
          tag: "Perfect finish"
        },
        {
          idMeal: "rec3",
          strMeal: "Caesar Salad",
          strMealThumb: "https://www.themealdb.com/images/media/meals/qxuqtt1511724269.jpg",
          price: "4.99",
          type: "side",
          matchScore: 92,
          tag: "Healthy choice"
        },
        {
          idMeal: "rec4",
          strMeal: "Chocolate Mousse",
          strMealThumb: "https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg",
          price: "4.49",
          type: "dessert",
          matchScore: 90,
          tag: "Customer favorite"
        },
        {
          idMeal: "rec5",
          strMeal: "Mozzarella Sticks",
          strMealThumb: "https://www.themealdb.com/images/media/meals/sxwquu1511793428.jpg",
          price: "4.29",
          type: "appetizer",
          matchScore: 85,
          tag: "Great starter"
        }
      ];
      
      // Filter out items already in cart
      const filtered = recommendations.filter(
        rec => !items.some(item => item.idMeal === rec.idMeal)
      );
      
      // Sort by match score and show top 3
      const sortedRecommendations = filtered
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      
      setSuggestedItems(sortedRecommendations);
    } else {
      setSuggestedItems([]);
    }
  }, [items]);

  // Function to add item from recommendations - fixed to ensure items are properly added to cart
  const handleAddRecommendation = (item) => {
    // Show updating state
    setIsUpdating(item.idMeal);
    
    // Create a complete item object with all required properties
    const completeItem = {
      ...item,
      // Ensure all required properties exist for cart items
      idMeal: item.idMeal,
      strMeal: item.strMeal,
      strMealThumb: item.strMealThumb,
      price: item.price,
      quantity: 1 // Start with quantity 1
    };
    
    // Add item to cart with slight delay for visual feedback
    setTimeout(() => {
      // Use direct updateItemQuantity with the complete item
      updateItemQuantity(item.idMeal, 1, completeItem);
      setIsUpdating(null);
      
      // Visual feedback on successful addition
      const element = document.getElementById(`recommendation-${item.idMeal}`);
      if (element) {
        element.classList.add('bg-green-50');
        setTimeout(() => {
          element.classList.remove('bg-green-50');
        }, 1000);
      }
    }, 300);
  };

  // Function to add combo deal - fixed to ensure items are properly added to cart
  const handleAddCombo = () => {
    // Find one side and one dessert from recommendations
    const side = suggestedItems.find(item => item.type === "side");
    const dessert = suggestedItems.find(item => item.type === "dessert");
    
    // Show visual feedback
    const comboElement = document.getElementById('combo-deal');
    if (comboElement) {
      comboElement.classList.add('scale-95', 'opacity-80');
      setTimeout(() => {
        comboElement.classList.remove('scale-95', 'opacity-80');
      }, 300);
    }
    
    // Add items to cart with a staggered animation
    if (side) {
      setTimeout(() => {
        // Create complete side item
        const completeSideItem = {
          ...side,
          idMeal: side.idMeal,
          strMeal: side.strMeal,
          strMealThumb: side.strMealThumb,
          price: side.price,
          quantity: 1
        };
        updateItemQuantity(side.idMeal, 1, completeSideItem);
      }, 100);
    }
    
    if (dessert) {
      setTimeout(() => {
        // Create complete dessert item
        const completeDessertItem = {
          ...dessert,
          idMeal: dessert.idMeal,
          strMeal: dessert.strMeal,
          strMealThumb: dessert.strMealThumb,
          price: dessert.price,
          quantity: 1
        };
        updateItemQuantity(dessert.idMeal, 1, completeDessertItem);
      }, 300);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white text-black">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-rose-600">Your Order</SheetTitle>
        <SheetDescription className="text-gray-700">
          {items.length === 0 
            ? "Your cart is empty" 
            : `You have ${items.length} item(s) in your cart`}
        </SheetDescription>
      </SheetHeader>

      <AnimatePresence mode="wait">
        {checkoutStep === 0 ? (
          <motion.div 
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-auto"
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </motion.div>
                <p className="mt-4 text-gray-700">Add some delicious items to your cart</p>
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li 
                      key={item.idMeal}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex items-center p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all duration-300 ${
                        isUpdating === item.idMeal ? 'border-rose-300 bg-rose-50' : ''
                      }`}
                    >
                      <img 
                        src={item.strMealThumb} 
                        alt={item.strMeal} 
                        className="w-16 h-16 object-cover rounded-md mr-3"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.strMeal}</h4>
                        <div className="flex items-center">
                          <p className="text-rose-600 font-medium">${item.price}</p>
                          {/* Show "AI Recommended" badge if this was from recommendations */}
                          {item.matchScore && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full">
                              AI Recommended
                            </span>
                          )}
                          {/* Show tag if available */}
                          {item.tag && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {item.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full bg-white text-black border-gray-300"
                          onClick={() => handleQuantityChange(item.idMeal, item.quantity - 1)}
                          disabled={isUpdating === item.idMeal}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center font-medium">
                          {isUpdating === item.idMeal ? (
                            <motion.span
                              initial={{ opacity: 0.5 }}
                              animate={{ opacity: 1 }}
                              transition={{ repeat: Infinity, duration: 0.5 }}
                            >
                              {item.quantity}
                            </motion.span>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleQuantityChange(item.idMeal, item.quantity + 1)}
                          disabled={isUpdating === item.idMeal}
                        >
                          +
                        </Button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Enhanced AI-Driven Upselling Section */}
                {suggestedItems.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-rose-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span className="text-lg">AI Recommendations</span>
                      <span className="ml-2 px-2 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full">Personalized</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3 mt-2">
                      {suggestedItems.map((item) => (
                        <motion.div
                          id={`recommendation-${item.idMeal}`}
                          key={item.idMeal}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs px-2 py-1 rounded-bl-lg z-10">
                            {item.matchScore}% match
                          </div>
                          <div className="flex p-3">
                            <div className="relative w-20 h-20 mr-3">
                              <img 
                                src={item.strMealThumb} 
                                alt={item.strMeal} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/2 rounded-b-lg"></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h4 className="font-medium text-gray-900">{item.strMeal}</h4>
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-100 text-rose-700 rounded-full">{item.tag}</span>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {item.type === "dessert" 
                                  ? "Complete your meal with this delicious dessert" 
                                  : item.type === "side" 
                                    ? "Enhance your main course with this perfect side" 
                                    : "Start your meal right with this appetizer"}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-rose-600 font-medium">${item.price}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className={`text-sm h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-full px-4 transition-all ${
                                    isUpdating === item.idMeal ? 'opacity-70' : ''
                                  }`}
                                  onClick={() => handleAddRecommendation(item)}
                                  disabled={isUpdating === item.idMeal}
                                >
                                  {isUpdating === item.idMeal ? (
                                    <motion.span
                                      initial={{ opacity: 0.7 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ repeat: Infinity, duration: 0.5 }}
                                      className="flex items-center"
                                    >
                                      Adding...
                                    </motion.span>
                                  ) : (
                                    <>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                      </svg>
                                      Add to Order
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Enhanced Combo deal suggestion */}
                    {items.length >= 1 && (
                      <motion.div
                        id="combo-deal"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 p-4 rounded-xl overflow-hidden relative transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                        
                        <div className="relative z-10 flex items-center">
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 border border-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                              <line x1="7" y1="7" x2="7.01" y2="7"></line>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">Complete Meal Deal</h4>
                            <p className="text-white/90">Add a side and dessert to your order and save 15%!</p>
                            
                            <div className="mt-3 flex space-x-2">
                              <Button 
                                className="bg-white text-rose-600 hover:bg-white/90 rounded-full px-4"
                                onClick={handleAddCombo}
                              >
                                Add Combo
                              </Button>
                              <Button 
                                variant="outline" 
                                className="border-white/30 text-white hover:bg-white/20 rounded-full"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : checkoutStep === 1 ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <div className="p-4 bg-rose-50 rounded-lg mb-4 border border-rose-100">
              <h3 className="font-medium text-rose-800 mb-2">Order Summary</h3>
              <ul className="space-y-2 mb-4">
                {items.map((item) => (
                  <li key={item.idMeal} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.strMeal}</span>
                    <span>${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-rose-200 pt-2 mt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Your order will be prepared and served to your table shortly.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setCheckoutStep(0)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleConfirmOrder}
                  className="flex-1 bg-rose-600 hover:bg-rose-700"
                >
                  Confirm Order
                </Button>
              </div>
            </div>
          </motion.div>
        ) : checkoutStep === 2 ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Order Confirmed!</h3>
            <p className="text-gray-600">
              Your order has been placed and will be served to your table shortly.
            </p>
          </motion.div>
        ) : checkoutStep === 3 && (
          <motion.div
            key="orderConfirmed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your order has been placed and will be served to your table shortly.
            </p>
            <Button 
              onClick={() => router.push(`/order-details/${Math.floor(Math.random() * 10000)}`)}
              className="bg-rose-600 hover:bg-rose-700"
            >
              View Order Details
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {checkoutStep === 0 && items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-rose-600">${totalPrice}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleCheckout}
              className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6  shadow-lg shadow-rose-200"
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}