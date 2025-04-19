import { Link } from "react-router-dom"
import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer"
import OrganizationRegisterForm from "../components/organization-register-form"
import { useEffect } from "react"

export default function OrganizationRegisterPage() {
  useEffect(() => {
    document.title = "VolunteerHub - Register Org"
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center">
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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
