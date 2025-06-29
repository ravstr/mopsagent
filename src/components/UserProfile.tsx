import React, { useState } from 'react'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function UserProfile() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const userDisplayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userAvatar = user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:text-gray-800 transition-colors duration-300 bg-white/70 hover:bg-white/90 border border-gray-200/40 rounded-3xl hover:shadow-soft backdrop-blur-sm transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-500"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userDisplayName}
            className="w-8 h-8 rounded-2xl"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-2xl flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="hidden sm:inline font-medium">{userDisplayName}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 card-soft z-50 p-2">
          <div className="px-4 py-4 border-b border-gray-200/50">
            <p className="font-semibold text-gray-800">{userDisplayName}</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:text-gray-800 hover:bg-gray-100/50 transition-colors duration-300 rounded-2xl mt-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}