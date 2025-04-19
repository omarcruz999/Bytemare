"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import LoginForm from "../components/login-form"
import SignUpForm from "../components/sign-up-form"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-teal-600"
            >
              <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
              <path d="M3.29 7L12 12l8.71-5M12 22V12"></path>
            </svg>
            <h1 className="text-xl font-bold text-gray-800">VolunteerFinder</h1>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">
              Find Opportunities
            </a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">
              For Organizations
            </a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition duration-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

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
      <footer className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} VolunteerFinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
