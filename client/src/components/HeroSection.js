import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroSection({ searchQuery, setSearchQuery, activeCategory, setActiveCategory, menuData }) {
  return (
    <div className="relative py-12 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-500/10 to-transparent"></div>
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-rose-500/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 20, 0],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-red-500/20 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -20, 0],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
    </div>
  );
} 