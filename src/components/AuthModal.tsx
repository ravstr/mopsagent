import React from 'react'
import { X } from 'lucide-react'
import { GoogleSignInButton } from './GoogleSignInButton'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="card-soft p-10 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2 hover:bg-gray-100/50 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-md"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to MopsAgent</h2>
          <p className="text-gray-600 text-lg">Sign in to start optimizing your marketing operations</p>
        </div>

        <GoogleSignInButton />

        <p className="text-sm text-gray-500 text-center mt-8 leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}