import { Link } from "react-router-dom"
import OrganizationRegisterForm from "../components/organization-register-form"

export default function OrganizationRegisterPage() {
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
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden p-8">
          <OrganizationRegisterForm />

          <div className="mt-8 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              to="/"
              className="mt-2 inline-block text-teal-600 hover:text-teal-700 font-medium hover:underline transition duration-200"
            >
              Return to login page
            </Link>
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
