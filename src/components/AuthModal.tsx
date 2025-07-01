import React, { useState } from 'react'
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { GoogleSignInButton } from './GoogleSignInButton'
import { EmailAuthForm } from './EmailAuthForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="card-soft p-10 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-300 p-2 hover:bg-gray-100/50 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-md"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {authMode === 'signin' ? 'Welcome back' : 'Join MopsAgent'}
          </h2>
          <p className="text-gray-600 text-lg">
            {authMode === 'signin' 
              ? 'Sign in to continue optimizing your marketing operations'
              : 'Create your account to get started with AI-powered marketing ops'
            }
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              authMode === 'signin'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              authMode === 'signup'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Email/Password Form */}
        <EmailAuthForm mode={authMode} onSuccess={onClose} />

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google Sign In */}
        <GoogleSignInButton />

        <p className="text-sm text-gray-500 text-center mt-8 leading-relaxed">
          By {authMode === 'signin' ? 'signing in' : 'creating an account'}, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}