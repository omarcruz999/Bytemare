"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer"
import LoginForm from "../components/login-form"
import SignUpForm from "../components/sign-up-form"

export default function UserRegister() {
  useEffect(() => {
    document.title = "VolunteerHub - Register"
  }
  , [])
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Image/Info */}
            <div className="md:w-1/2 bg-teal-600 p-8 text-white flex flex-col justify-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Make a Difference in Your Community</h2>
                <p className="text-teal-100">
                  Connect with local organizations and find meaningful volunteer opportunities that match your skills
                  and interests.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Find opportunities that match your schedule</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Track your volunteer hours</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Connect with like-minded volunteers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="md:w-1/2 p-8">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 font-medium text-center transition duration-200 ${
                    activeTab === "login"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-teal-600"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-2 font-medium text-center transition duration-200 ${
                    activeTab === "signup"
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-teal-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <div className="mt-6">{activeTab === "login" ? <LoginForm /> : <SignUpForm />}</div>

              {/* Organization Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">Are you an organization looking for volunteers?</p>
                <Link
                  to="/organization/register"
                  className="mt-2 inline-block text-teal-600 hover:text-teal-700 font-medium hover:underline transition duration-200"
                >
                  Click here to register your organization
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
