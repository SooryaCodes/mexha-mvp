"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function Cart() {
  const { items, updateItemQuantity, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(null);
  
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
    // In a real app, you would send the order to a backend here
    setTimeout(() => {
      clearCart();
      setCheckoutStep(0);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-[#FC8019]">Your Order</SheetTitle>
        <SheetDescription>
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
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
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
                <p className="mt-4">Add some delicious items to your cart</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <motion.li 
                    key={item.idMeal}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="flex items-center p-3 border border-gray-100 rounded-lg bg-white hover:shadow-md transition-shadow duration-200"
                  >
                    <img 
                      src={item.strMealThumb} 
                      alt={item.strMeal} 
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.strMeal}</h4>
                      <p className="text-[#FC8019] font-medium">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleQuantityChange(item.idMeal, item.quantity - 1)}
                        disabled={isUpdating === item.idMeal}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
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
            <div className="p-4 bg-orange-50 rounded-lg mb-4 border border-orange-100">
              <h3 className="font-medium text-orange-800 mb-2">Order Summary</h3>
              <ul className="space-y-2 mb-4">
                {items.map((item) => (
                  <li key={item.idMeal} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.strMeal}</span>
                    <span>${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-orange-200 pt-2 mt-2 flex justify-between font-medium">
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
                  className="flex-1 bg-[#FC8019] hover:bg-orange-600"
                >
                  Confirm Order
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
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
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Order Confirmed!</h3>
            <p className="text-gray-600">
              Your order has been placed and will be served to your table shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {checkoutStep === 0 && items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-[#FC8019]">${totalPrice}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleCheckout}
              className="w-full bg-[#FC8019] hover:bg-orange-600 text-lg py-6 rounded-xl shadow-lg shadow-orange-200"
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}