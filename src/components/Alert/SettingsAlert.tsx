// src/components/Alert/SettingsAlert.tsx
"use client"

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useEffect } from "react";


interface IAlertProps {
  title: string;
  message: string;
  type: "success" | "error";
  onClose?: () => void;
  autoClose?: boolean; 
  autoCloseDelay?: number; 
}

export function SettingsAlert({ title, message, type, onClose, autoClose = true, autoCloseDelay = 3000 }: IAlertProps) {

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado ou quando autoCloseDelay muda
    }
  }, [autoClose, autoCloseDelay, onClose]);

  return (
     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-lg px-4 
     ">
      <Alert variant={type === "success" ? "default" : "destructive"}
      className={`
          relative shadow-lg 
          ${type === "success" 
            ? "bg-[var(--foreground)] border-green-400" 
            : "bg-[var(--foreground)] border-red-400"
          }
        `}
      >
        {type === "success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
        
        <AlertTitle
        className="text-white">
          {title}
        </AlertTitle>
        <AlertDescription className="mt-2">
          {message}
        </AlertDescription>

        {/* {onClose && (
          <div className="mt-4 ">
            <button
              onClick={onClose}
              className={`
                px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
                ${type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-red-600 hover:bg-red-700 text-white"
                }
              `}
            >
              OK
            </button>
          </div>
        )} */}
      </Alert>
    </div>
  )
}