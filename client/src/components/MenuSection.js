"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function MenuSection({ title, items }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleAddToCart = (item) => {
    setIsAdding(item.idMeal);
    addItem(item);
    
    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${item.strMeal} has been added to your cart.`,
    });
    
    // Reset the adding state after a short delay
    setTimeout(() => setIsAdding(null), 500);
  };

  return (
    <section className="py-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-[#282C3F]">{title}</h2>
        <div className="h-0.5 flex-grow mx-4 bg-gradient-to-r from-orange-200 to-transparent"></div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((menuItem) => (
          <MenuItem 
            key={menuItem.idMeal} 
            item={menuItem} 
            onAddToCart={handleAddToCart}
            isAdding={isAdding === menuItem.idMeal}
          />
        ))}
      </motion.div>
    </section>
  );
}

function MenuItem({ item, onAddToCart, isAdding }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Generate random tags for menu items to make them more interesting
  const tags = [
    item.price < 10 ? "Best Value" : null,
    Math.random() > 0.7 ? "Popular" : null,
    Math.random() > 0.8 ? "Chef's Special" : null,
    Math.random() > 0.9 ? "New" : null
  ].filter(Boolean);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden group">
        <motion.img
          src={item.strMealThumb}
          alt={item.strMeal}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md">
          ${item.price}
        </div>
        
        {/* Tags for menu items */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span key={index} className="bg-white/90 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.strMeal}</h3>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.floor(4 + Math.random()) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="mr-0.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">{(4 + Math.random()).toFixed(1)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => onAddToCart(item)}
            disabled={isAdding}
            className={`w-full ${isAdding 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
          >
            Add to Cart
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 