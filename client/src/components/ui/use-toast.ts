import * as React from 'react'

export type ToastVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export interface ToastContextType {
  toasts: ToastItem[]
  toast: (options: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const ToastContext = React.createContext<ToastContextType | null>(null)

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
