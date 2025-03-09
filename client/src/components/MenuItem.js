import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";

export default function MenuItem({ item }) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem(item);
      setIsAdding(false);
    }, 300);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={item.strMealThumb} 
          alt={item.strMeal} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {item.tag && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
            {item.tag}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 text-lg">{item.strMeal}</h3>
          <span className="text-rose-600 font-semibold">${parseFloat(item.price).toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {item.description || "A delicious dish prepared with the finest ingredients."}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm">
            <span className="flex items-center">
              {/* Rating stars or other item metadata */}
            </span>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-rose-500 hover:bg-rose-600 text-white"
            size="sm"
          >
            {isAdding ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingBag size={16} />
              </motion.div>
            ) : (
              <>
                <Plus size={16} className="mr-1" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 