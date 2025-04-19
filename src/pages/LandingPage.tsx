import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer.tsx" 
import { useEffect } from "react"
export default function LandingPage() {
  useEffect(() => {
    document.title = "VolunteerHub"
  }
  , [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content - Simple Placeholder */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700">Welcome to VolunteerHub</h1>
          <p className="text-xl text-gray-600">
            Connecting volunteers with meaningful opportunities in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="/register"
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md shadow hover:bg-teal-700 transition duration-200"
            >
              Get Started
            </a>
            <a
              href="/organization/register"
              className="px-6 py-3 bg-white text-teal-600 font-medium rounded-md shadow border border-teal-200 hover:bg-teal-50 transition duration-200"
            >
              Register Organization
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
