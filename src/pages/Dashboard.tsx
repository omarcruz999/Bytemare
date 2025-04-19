import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Dashboard() {
  const { user } = useAuth()

  useEffect(() => {
    document.title = "VolunteerHub - Dashboard"
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Dashboard</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.displayName}!</h2>
            <p className="text-gray-600">
              This is your dashboard. Here you can manage your volunteer activities, track your progress, and find new opportunities.
            </p>
            
            {/* Dashboard content will be expanded in the future */}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 