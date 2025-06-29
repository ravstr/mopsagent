import React, { useState } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([
          {
            email: email.trim().toLowerCase(),
            source: 'landing_page'
          }
        ])

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setStatus('error')
          setMessage('This email is already signed up!')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('Thanks! We\'ll keep you posted.')
        setEmail('')
      }
    } catch (error) {
      console.error('Error signing up email:', error)
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  const resetStatus = () => {
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Let's stay in touch</h3>
        <p className="text-gray-600 text-sm">Be the first to know about our new product launch</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              resetStatus()
            }}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-medium py-3 px-5 rounded-2xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-500 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
        >
          {status === 'loading' && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {status === 'success' && <Check className="w-4 h-4" />}
          {status === 'idle' && <Mail className="w-4 h-4" />}
          {status === 'error' && <AlertCircle className="w-4 h-4" />}
          <span>
            {status === 'loading' && 'Signing up...'}
            {status === 'success' && 'Signed up!'}
            {status === 'error' && 'Try again'}
            {status === 'idle' && 'Sign up'}
          </span>
        </button>

        {message && (
          <div className={`text-center text-xs font-medium transition-all duration-300 ${
            status === 'success' ? 'text-green-600' : 'text-red-500'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}