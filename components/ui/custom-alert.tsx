"use client"

import React, { useState, useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './button'

export interface CustomAlertProps {
  isOpen: boolean
  onClose: () => void
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

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showConfirm = false,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose && !showConfirm) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose, showConfirm])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          text: 'text-green-800'
        }
      case 'warning':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          text: 'text-yellow-800'
        }
      case 'error':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          text: 'text-red-800'
        }
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          text: 'text-blue-800'
        }
    }
  }

  const colors = getColorClasses()

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto">
        <div className={`relative bg-white rounded-lg shadow-xl border-2 ${colors.border} transform transition-all duration-300 ease-out scale-100 opacity-100`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 ${colors.bg} rounded-t-lg`}>
            <div className="flex items-center space-x-3">
              {getIcon()}
              {title && (
                <h3 className={`text-lg font-semibold ${colors.text}`}>
                  {title}
                </h3>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors ${colors.text}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
            {showConfirm ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="px-4 py-2"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-humsafar-600 hover:bg-humsafar-700 text-white"
                >
                  {confirmText}
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                className="px-6 py-2 bg-humsafar-600 hover:bg-humsafar-700 text-white"
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert