"use client";

import * as React from "react";
import { createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from 'next/image';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const toast = ({ title, description, duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, duration }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 w-full max-w-full md:max-w-sm z-50 flex flex-col gap-2 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              title={toast.title}
              description={toast.description}
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ id, title, description, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3 pointer-events-auto max-w-full overflow-hidden"
    >
      <div className="flex-1 min-w-0">
        {title && <h3 className="font-medium text-gray-900 truncate">{title}</h3>}
        {description && <p className="text-sm text-gray-500 break-words">{description}</p>}
      </div>
      <button onClick={onDismiss} className="text-gray-400 hover:text-gray-500 flex-shrink-0">
        <X size={16} />
      </button>
    </motion.div>
  );
}