// This file implements the useToast hook and related functionality
import { useContext } from "react";
import { ToastContext } from "./toast";

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
} 