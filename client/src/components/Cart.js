"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, ShoppingBag, ChevronRight } from "lucide-react";

export default function Cart() {
  const { items, updateItemQuantity, removeItem, clearCart, closeCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const router = useRouter();
  
  // Calculate subtotal, tax, and total
  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity, 0
  );
  const tax = subtotal * 0.08; // 8% tax
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const totalPrice = (subtotal + tax + deliveryFee).toFixed(2);

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

  // Enhanced cart item component
  const CartItem = ({ item }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.strMealThumb} 
          alt={item.strMeal} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-3 flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-800">{item.strMeal}</h3>
          <button 
            onClick={() => removeItem(item.idMeal)}
            className="text-gray-400 hover:text-rose-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="text-rose-600 font-medium mt-1">
          ${parseFloat(item.price).toFixed(2)}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
            <button 
              onClick={() => handleQuantityChange(item.idMeal, item.quantity - 1)}
              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
              disabled={isUpdating === item.idMeal}
            >
              <Minus size={14} />
            </button>
            
            <span className="px-3 font-medium text-gray-800">
              {isUpdating === item.idMeal ? "..." : item.quantity}
            </span>
            
            <button 
              onClick={() => handleQuantityChange(item.idMeal, item.quantity + 1)}
              className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
              disabled={isUpdating === item.idMeal}
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="font-medium text-gray-800">
            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-full flex flex-col bg-white text-black">
      <SheetHeader className="mb-4 sticky top-0 z-10 bg-white pb-2 border-b">
        <div className="flex justify-between items-center">
          <SheetTitle className="text-rose-600 flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Your Order
          </SheetTitle>
          <button 
            onClick={closeCart}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
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
            className="flex-1 overflow-auto px-1"
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-gray-50 p-6 rounded-full"
                >
                  <ShoppingBag size={48} className="text-gray-300" />
                </motion.div>
                <p className="mt-4 text-gray-700 font-medium">Your cart is empty</p>
                <p className="text-gray-500 text-sm text-center mt-2">
                  Add some delicious items to get started
                </p>
                <Button 
                  onClick={closeCart}
                  className="mt-4 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-1 mb-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <CartItem key={item.idMeal} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Suggested items section */}
                {suggestedItems.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                      <span className="text-lg">Recommended for You</span>
                      <Badge className="ml-2 bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Personalized
                      </Badge>
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {suggestedItems.map((item) => (
                        <motion.div
                          key={item.idMeal}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center p-3 bg-rose-50 rounded-lg"
                        >
                          <div className="h-14 w-14 rounded-md overflow-hidden">
                            <img 
                              src={item.strMealThumb} 
                              alt={item.strMeal} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium text-gray-800">{item.strMeal}</h4>
                                <Badge className="mt-1 bg-rose-100 text-rose-700">
                                  {item.tag}
                                </Badge>
                              </div>
                              <div className="text-rose-600 font-medium">
                                ${parseFloat(item.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleAddRecommendation(item)}
                            size="sm"
                            className="ml-2 bg-rose-500 hover:bg-rose-600"
                          >
                            Add
                          </Button>
                        </motion.div>
                      ))}
                    </div>
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

      {/* Order summary and checkout button */}
      {items.length > 0 && (
        <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-1 bg-white">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={clearCart}
              variant="outline"
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Clear Cart
            </Button>
            <Button 
              onClick={handleCheckout}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Checkout <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}