"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Mail } from "lucide-react"

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Use the Firebase login function from auth context
      await login(email, password)

      // Handle successful login
      if (onSuccess) {
        onSuccess()
      } else {
        navigate("/volunteer/profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    try {
      // Use the Firebase Google login function
      const user = await loginWithGoogle()
      
      // Check if user exists in MongoDB - if not, create a record
      if (user && user.email) {
        try {
          // Try to find the user in the volunteers collection
          const checkResponse = await fetch(`${import.meta.env.VITE_API_URL}/volunteers/check-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });
          
          // If user doesn't exist, create them
          if (checkResponse.status === 404) {
            const displayName = user.displayName || user.email?.split('@')[0] || '';
            
            const createResponse = await fetch(`${import.meta.env.VITE_API_URL}/volunteers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uid: user.uid,
                name: displayName,
                email: user.email,
                phone: 0, // Default value
                profileImage: user.photoURL || undefined
              }),
            });
            
            if (!createResponse.ok) {
              console.error('Error creating MongoDB volunteer record for Google login:', await createResponse.text());
            }
          }
        } catch (err) {
          console.error("Error checking/creating user in MongoDB:", err);
        }
      }
      
      // Handle successful login
      if (onSuccess) {
        onSuccess()
      } else {
        navigate("/volunteer/profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed")
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-teal-700">Welcome Back</h2>
        <p className="text-gray-500">Enter your credentials to access your account</p>
      </div>

      {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="#" className="text-sm text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Mail className="h-5 w-5 mr-2" />
          Sign in with Google
        </button>
      </form>
    </div>
  )
}