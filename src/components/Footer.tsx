import React from 'react'
import { Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 py-8 px-8">
      <div className="flex items-center justify-center space-x-4 text-gray-500">
        <span className="text-sm">© 2025</span>
        <a
          href="https://www.linkedin.com/in/ravishrestha/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors duration-300"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>
    </footer>
  )
}