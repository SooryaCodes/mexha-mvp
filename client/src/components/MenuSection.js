"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MenuSection({ title, items }) {
  return (
    <section>
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent inline-block"
      >
        {title}
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <FoodCard key={item.idMeal} item={item} />
        ))}
      </div>
    </section>
  );
}

function FoodCard({ item }) {
  const { addItem } = useCart();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-xl overflow-hidden border border-rose-300 h-full flex flex-col group bg-white shadow-md"
    >
      <div className="relative overflow-hidden">
        <img 
          src={item.strMealThumb} 
          alt={item.strMeal}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-20">
          <Badge className="bg-rose-500 text-white border-none px-2 py-1 font-semibold">
            ${item.price}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 z-20 flex space-x-2">
          <Badge className="bg-white text-black border-none px-2 py-1 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-rose-500">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {item.rating}
          </Badge>
          <Badge className="bg-white text-black border-none px-2 py-1 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-rose-500">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {item.prepTime}
          </Badge>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col bg-white">
        <h3 className="font-bold text-lg text-black mb-1 line-clamp-1">{item.strMeal}</h3>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addItem(item)}
            className="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to Cart
          </motion.button>
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-rose-600 hover:bg-rose-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 