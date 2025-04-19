'use client'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../assets/Logo.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
            <div className="rounded-full p-2">
              <div>
                <img
                  src={Logo}
                  alt="Helping Hand Logo"
                  className="h-12 w-12 object-cover" // Increased size for better visibility
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-white"> {/* Bigger font */}
              Helping Hand
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
            {isAuthenticated ? (
              <>
                <Link 
                  to="/volunteer/profile"
                  className="text-xl font-medium text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xl font-medium text-white px-4 py-2 rounded hover:bg-teal-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="text-xl font-medium text-white px-4 py-2 rounded hover:bg-teal-600"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded text-white hover:bg-teal-800"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-800 py-4 px-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                handleScrollTo("about");
                setIsOpen(false);
              }}
              className="text-lg font-medium text-white py-2"
            >
              About
            </button>
            <button
              onClick={() => {
                handleScrollTo("contact");
                setIsOpen(false);
              }}
              className="text-lg font-medium text-white py-2"
            >
              Contact Us
            </button>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/volunteer/profile"
                  className="text-lg font-medium text-white py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-lg font-medium text-white py-2 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="text-lg font-medium text-white py-2"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}