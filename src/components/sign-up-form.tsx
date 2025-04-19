"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Mail } from "lucide-react"
import { db } from "../services/firebase"
import { doc, setDoc } from "firebase/firestore"

interface SignUpFormProps {
  onSuccess?: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Use Firebase register function
      const user = await register(formData.email, formData.password)
      
      // Save additional user data to Firestore
      if (user) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: 'volunteer',
            createdAt: new Date().toISOString()
          });

          // Also create a record in MongoDB volunteers collection
          const response = await fetch(`${import.meta.env.VITE_API_URL}/volunteers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: user.uid,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: 0 // Default value since we don't collect it in the form
            }),
          });

          if (!response.ok) {
            console.error('Error creating MongoDB volunteer record:', await response.text());
          }
        } catch (firestoreErr) {
          console.error("Error adding user data to Firestore or MongoDB:", firestoreErr);
        }
      }

      // Handle successful registration
      if (onSuccess) {
        onSuccess()
      } else {
        navigate("/volunteer/profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignup = async () => {
    try {
      // Use Firebase Google login function
      const user = await loginWithGoogle()
      
      // We can add additional user data after Google sign-in if needed
      if (user) {
        try {
          // Extract name parts from displayName or use email as fallback
          const displayName = user.displayName || user.email?.split('@')[0] || '';
          let firstName = displayName;
          let lastName = '';
          
          // If displayName contains a space, split into firstName and lastName
          if (displayName.includes(' ')) {
            const nameParts = displayName.split(' ');
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          }

          // Set basic user data in Firestore
          await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            name: displayName,
            email: user.email,
            role: 'volunteer',
            createdAt: new Date().toISOString()
          });

          // Create a record in MongoDB volunteers collection
          const response = await fetch(`${import.meta.env.VITE_API_URL}/volunteers`, {
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

          if (!response.ok) {
            console.error('Error creating MongoDB volunteer record for Google user:', await response.text());
          }
        } catch (err) {
          console.error("Error saving Google user data:", err);
        }
      }
      
      // Handle successful registration
      if (onSuccess) {
        onSuccess()
      } else {
        navigate("/volunteer/profile")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign up failed")
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-teal-700">Create an Account</h2>
        <p className="text-gray-500">Join our community and start making a difference</p>
      </div>

      {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          {isLoading ? "Creating Account..." : "Create Account"}
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
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Mail className="h-5 w-5 mr-2" />
          Sign up with Google
        </button>
      </form>
    </div>
  )
}