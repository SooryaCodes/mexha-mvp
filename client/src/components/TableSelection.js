"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function TableSelection({ onTableSelect, mergeMode, setMergeMode, currentTable }) {
  const [hoveredTable, setHoveredTable] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const { toast } = useToast();
  
  // Generate tables for the restaurant layout
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Handle table click in merge mode
  const handleTableClick = (tableId) => {
    if (!mergeMode) {
      // Single table selection mode
      onTableSelect(tableId);
    } else {
      // Merge mode
      if (tableId === currentTable) {
        // Cannot select the current table in merge mode
        toast({
          title: "Cannot select current table",
          description: "Please select a different table to merge with.",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedTables.includes(tableId)) {
        // Deselect the table
        setSelectedTables(selectedTables.filter(id => id !== tableId));
      } else {
        // Only allow selecting up to one additional table in merge mode
        if (selectedTables.length < 1) {
          setSelectedTables([...selectedTables, tableId]);
        } else {
          // Replace the selected table if already have one
          setSelectedTables([tableId]);
        }
      }
    }
  };
  
  // Confirm table selection in merge mode
  const confirmTableSelection = () => {
    if (mergeMode) {
      if (selectedTables.length === 0) {
        // No additional table selected
        toast({
          title: "No table selected",
          description: "Please select a table to merge with.",
          variant: "destructive",
        });
      } else {
        // Merge the current table with the selected table
        onTableSelect(selectedTables[0]);
      }
    } else {
      // Single table mode - proceed with current table
      onTableSelect(currentTable);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">Quantum</span>
            <span className="text-slate-800">Dine</span>
          </h1>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Select Your Table</h2>
            <p className="text-slate-500">
              {mergeMode 
                ? `You are at Table ${currentTable}. Select one more table to merge.`
                : "Choose a table to begin your dining experience"}
            </p>
          </motion.div>
          
          {/* Merge tables toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mb-8 space-x-2"
          >
            <Switch
              id="merge-mode"
              checked={mergeMode}
              onCheckedChange={(checked) => {
                setMergeMode(checked);
                setSelectedTables([]);
              }}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-rose-600"
            />
            <Label htmlFor="merge-mode" className="text-slate-600">Merge Tables Mode</Label>
          </motion.div>
          
          {/* Table layout - only show in merge mode or when no table is selected yet */}
          {(mergeMode || !currentTable) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white backdrop-blur-md rounded-xl p-8 border border-slate-200 shadow-md relative overflow-hidden"
            >
              {/* Background elements */}
              <div className="absolute inset-0 z-0">
                <motion.div 
                  className="absolute top-0 left-0 w-40 h-40 rounded-full bg-rose-500/5 blur-3xl"
                  animate={{ 
                    x: [0, 30, 0], 
                    opacity: [0.1, 0.2, 0.1] 
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-rose-600/5 blur-3xl"
                  animate={{ 
                    x: [0, -20, 0], 
                    opacity: [0.1, 0.2, 0.1] 
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-6 text-center text-slate-800">Restaurant Layout</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tables.map((tableId) => {
                    const isCurrentTable = tableId === currentTable;
                    const isSelected = selectedTables.includes(tableId);
                    const isOccupied = tableId % 3 === 0; // This is just an example condition
                    
                    return (
                      <motion.div
                        key={tableId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setHoveredTable(tableId)}
                        onHoverEnd={() => setHoveredTable(null)}
                        onClick={() => handleTableClick(tableId)}
                        className={`
                          relative aspect-square rounded-lg flex items-center justify-center cursor-pointer
                          border-2 transition-all duration-300
                          ${isCurrentTable ? 'border-rose-500 bg-rose-50' : ''}
                          ${isSelected ? 'border-purple-500 bg-purple-50' : ''}
                          ${!isCurrentTable && !isSelected ? 'border-slate-300 bg-white hover:border-rose-300' : ''}
                          ${mergeMode && isCurrentTable ? 'cursor-not-allowed' : 'cursor-pointer'}
                          ${hoveredTable === tableId ? 'shadow-lg shadow-rose-500/20' : ''}
                        `}
                      >
                        <div className="text-center">
                          <p className={`text-lg font-bold 
                            ${isCurrentTable ? 'text-rose-500' : ''} 
                            ${isSelected ? 'text-purple-500' : ''} 
                            ${!isCurrentTable && !isSelected ? 'text-slate-700' : ''}
                          `}>
                            {tableId}
                          </p>
                          <p className="text-xs text-slate-500">Table</p>
                        </div>
                        
                        {/* Status indicator */}
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        
                        {/* Selection effect */}
                        {hoveredTable === tableId && !isCurrentTable && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 rounded-lg border-2 border-rose-400 z-10"
                            style={{ boxShadow: '0 0 15px rgba(239, 76, 76, 0.3)' }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="mt-8 flex justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-slate-600">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-slate-600">Occupied</span>
                  </div>
                  {mergeMode && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-slate-600">Selected for Merge</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-6 space-x-4"
          >
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setMergeMode(false);
                setSelectedTables([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700"
              onClick={confirmTableSelection}
              disabled={mergeMode && selectedTables.length === 0}
            >
              {mergeMode ? "Confirm Merge" : "Proceed to Menu"}
            </Button>
          </motion.div>
          
          {/* Help text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-slate-500 text-sm mt-6"
          >
            {mergeMode 
              ? `You are at Table ${currentTable}. Select one more table to merge.` 
              : "Click on a table to select it and proceed to the menu"}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
} 