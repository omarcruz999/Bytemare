'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from "react-router-dom"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  // const [isAuthenticated, setIsAuthenticated] = useState(false) // UNCOMMENT WHEN AUTH FUNCTIONALITY IS IMPLEMENTED

  const navigate = useNavigate()
  const location = useLocation()

  const handleScrollTo = (id: string) => {
    if (location.pathname === "/") {
      // You're already on home, just scroll
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    } else {
      // Navigate to home and pass scroll target in state
      navigate("/", { state: { scrollToId: id } })
    }
  }

  const handleScrollToTop = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      navigate("/", { state: { scrollToId: "top" } })
    }
  }
  

  return (
    <header className="sticky top-0 z-50 w-full bg-teal-700 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex h-20 items-center justify-between"> {/* Increased height from h-16 to h-20 */}
          {/* Logo */}
          <button
            onClick={() => handleScrollToTop()}
            className="flex items-center gap-3 cursor-pointer"
          >

            <div className="rounded-full bg-green-600 p-2">
              {/* … SVG … */}
            </div>
            <span className="text-2xl font-bold text-white"> {/* Bigger font */}
              VolunteerHub
            </span>
          </button>


          {/* Right nav */}
          <div className="hidden md:flex items-center space-x-8"> {/* More space between items */}
            <button
              onClick={() => handleScrollTo("about")}
              className="text-xl font-medium text-white px-4 py-2 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => handleScrollTo("contact")}
              className="text-xl font-medium text-white px-4 py-2 cursor-pointer"
            >
              Contact Us
            </button>
            {/* Conditional rendering based on auth state */}
            {/* USE THIS CODE ONCE WE IMPLEMENT LOGIN FUNCTIONALITY */}
            {/* {isAuthenticated ? (
              <Link 
                to="/volunteer/profile"
                className="text-xl font-medium text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/register"
                className="text-xl font-medium text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Log In
              </Link>
            )} */}

            {/* DELETE CODE BELOW ONCE WE HAVE LOG IN FUNCTION IMPLEMENTED */}
            <Link
              to="/register"
              className="text-xl font-medium text-white px-4 py-2 rounded "
            >
              Log In
            </Link>

            <Link
              to="/volunteer/profile"
              className="text-xl font-medium text-white px-4 py-2 rounded"
            >

              Profile
            </Link>
            {/* DELETE CODE ABOVE ONCE WE HAVE LOG IN FUNCTION IMPLEMENTED */}
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
