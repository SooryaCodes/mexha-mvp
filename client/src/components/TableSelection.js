"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TableSelection({ onTableSelect, mergeMode, setMergeMode }) {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentTable = 5; // This should come from a prop or context
  
  // Add visual indicator for merged tables
  const [selectedForMerge, setSelectedForMerge] = useState(null);
  
  const handleTableClick = (table) => {
    if (mergeMode) {
      if (table !== currentTable) {
        setSelectedForMerge(table);
        // Add a small delay to show the selection before calling the parent handler
        setTimeout(() => onTableSelect(table), 300);
      }
    } else {
      onTableSelect(table);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-[#282C3F] mb-2">Select Table</h1>
          <p className="text-[#686B78] text-center max-w-md">
            {mergeMode 
              ? "Select another table to merge with your current table" 
              : "You are at Table " + currentTable + ". Select your table to continue."}
          </p>
          
          {/* Improved toggle switch with better visual feedback */}
          <div className="flex items-center mt-6 space-x-2 bg-[#F8F8F8] p-3 rounded-full shadow-sm">
            <Switch
              id="merge-mode"
              checked={mergeMode}
              onCheckedChange={setMergeMode}
              className="data-[state=checked]:bg-[#FC8019]"
            />
            <Label htmlFor="merge-mode" className="text-[#282C3F] cursor-pointer font-medium">
              Merge Tables
            </Label>
          </div>
          
          {/* Add helper text for merge mode */}
          {mergeMode && (
            <p className="mt-2 text-sm text-orange-600 animate-pulse">
              Select a table to merge with Table {currentTable}
            </p>
          )}
        </div>

        {/* Improved table layout with better visual design */}
        <div className="relative">
          {/* Current table indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#F8F8F8] flex items-center justify-center z-0 shadow-inner">
            <span className="text-[#686B78] font-medium">You are here</span>
          </div>
          
          {/* Tables grid with improved layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative z-10">
            {tables.map((table) => {
              const isCurrentTable = table === currentTable;
              const isSelectedForMerge = table === selectedForMerge;
              
              return (
                <motion.div 
                  key={table}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative ${isCurrentTable ? 'order-first md:order-none' : ''}`}
                >
                  <button
                    onClick={() => handleTableClick(table)}
                    disabled={isCurrentTable && !mergeMode}
                    className={`
                      w-full aspect-square rounded-xl flex flex-col items-center justify-center
                      ${isCurrentTable 
                        ? 'bg-[#FC8019] text-white border-2 border-[#FC8019] shadow-lg' 
                        : isSelectedForMerge
                          ? 'bg-orange-200 border-2 border-[#FC8019] text-[#FC8019]'
                          : 'bg-white border-2 border-[#E9E9EB] hover:border-[#FC8019] shadow-sm hover:shadow'}
                      ${mergeMode && !isCurrentTable ? 'cursor-pointer' : ''}
                      transition-all duration-200
                    `}
                  >
                    <span className="text-2xl font-semibold mb-1">{table}</span>
                    <span className="text-xs opacity-80">
                      {table % 3 === 0 ? "Window" : table % 2 === 0 ? "Center" : "Bar"}
                    </span>
                    
                    {/* Distance indicator with improved design */}
                    {!isCurrentTable && (
                      <span className="absolute bottom-2 text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                        {Math.abs(currentTable - table)}m away
                      </span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Improved help text */}
        <div className="mt-8 text-center">
          <p className="text-[#686B78] text-sm bg-white p-3 rounded-lg shadow-sm inline-block">
            Need help? Ask our staff or call <span className="text-[#FC8019] font-medium">Table Assistance</span>
          </p>
        </div>
      </div>
    </div>
  );
} 