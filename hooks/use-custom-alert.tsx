"use client"

import { useState, useCallback } from 'react'

export interface AlertConfig {
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  showConfirm?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

export const useCustomAlert = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    message: '',
    type: 'info'
  })

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config)
    setIsOpen(true)
  }, [])

  const hideAlert = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Convenience methods for different alert types
  const showInfo = useCallback((message: string, title?: string, options?: Partial<AlertConfig>) => {
    showAlert({
      message,
      title,
      type: 'info',
      ...options
    })
  }, [showAlert])

  const showSuccess = useCallback((message: string, title?: string, options?: Partial<AlertConfig>) => {
    showAlert({
      message,
      title,
      type: 'success',
      autoClose: true,
      autoCloseDelay: 3000,
      ...options
    })
  }, [showAlert])

  const showWarning = useCallback((message: string, title?: string, options?: Partial<AlertConfig>) => {
    showAlert({
      message,
      title,
      type: 'warning',
      ...options
    })
  }, [showAlert])

  const showError = useCallback((message: string, title?: string, options?: Partial<AlertConfig>) => {
    showAlert({
      message,
      title,
      type: 'error',
      ...options
    })
  }, [showAlert])

  const showConfirm = useCallback((
    message: string,
    onConfirm: () => void,
    title?: string,
    options?: Partial<AlertConfig>
  ) => {
    showAlert({
      message,
      title,
      type: 'warning',
      showConfirm: true,
      onConfirm,
      ...options
    })
  }, [showAlert])

  return {
    isOpen,
    alertConfig,
    showAlert,
    hideAlert,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    showConfirm
  }
}