import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import MenuSection from "@/components/MenuSection";

export default function MenuDisplay({ isLoading, getFilteredMenuItems, getMenuSections, setSearchQuery, setActiveCategory }) {
  const filteredItems = getFilteredMenuItems();
  
  return (
    <div className="container mx-auto py-8 px-4">
      {isLoading ? (
        <LoadingState />
      ) : filteredItems.length === 0 ? (
        <EmptyState setSearchQuery={setSearchQuery} setActiveCategory={setActiveCategory} />
      ) : (
        <div className="space-y-12 " >
          <AnimatePresence mode="wait grid grid-cols-4">
            {getMenuSections().map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MenuSection 
                  title={section.title} 
                  items={section.items} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative w-20 h-20">
        <motion.div 
          className="absolute inset-0 rounded-full border-t-2 border-rose-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-2 rounded-full border-t-2 border-red-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 rounded-full border-t-2 border-rose-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="mt-6 text-rose-300 font-medium">Preparing your culinary experience...</p>
    </div>
  );
}

function EmptyState({ setSearchQuery, setActiveCategory }) {
  return (
    <div className="flex flex-col justify-center items-center h-64 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
          <path d="M17.5 5.5C19 7 20.5 9 21 11c.5 2 .5 4 0 6-1 4-4.5 6-7.5 6s-6.5-2-7.5-6c-.5-2-.5-4 0-6 .5-2 2-4 3.5-5.5"></path>
          <path d="M10 11h.01"></path>
          <path d="M14 11h.01"></path>
          <path d="M10 14a3.5 3.5 0 0 0 4 0"></path>
        </svg>
      </motion.div>
      <p className="mt-4 text-rose-300 font-medium">No dishes found</p>
      <p className="text-sm text-rose-400">Try a different search term or category</p>
      <Button 
        variant="outline" 
        onClick={() => {setSearchQuery(''); setActiveCategory('all');}}
        className="mt-4 border-rose-700/50 text-rose-400 hover:bg-rose-900/20 hover:border-rose-500/50 transition-all duration-300"
      >
        Clear filters
      </Button>
    </div>
  );
}

