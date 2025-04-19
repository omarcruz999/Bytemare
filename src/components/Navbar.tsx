'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-teal-700 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-20 items-center justify-between"> {/* Increased height from h-16 to h-20 */}
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-full bg-green-600 p-2">
              {/* … SVG … */}
            </div>
            <span className="text-2xl font-bold text-white"> {/* Bigger font */}
              VolunteerHub
            </span>
          </Link>

          {/* Right nav */}
          <div className="hidden md:flex items-center space-x-8"> {/* More space between items */}
            <a href="#about" className="text-xl font-medium text-white px-4 py-2">
              About
            </a>
            <a href="#contact" className="text-xl font-medium text-white px-4 py-2">
              Contact Us
            </a>
            <Link
              to="/register"
              className="text-xl font-medium text-white px-4 py-2 rounded"
            >
              Log In
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded text-white hover:bg-teal-800"
              aria-label="Toggle menu"
            >
              {/* … hamburger / close icon … */}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
