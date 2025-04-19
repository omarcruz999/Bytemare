import { useState, useEffect } from "react"
import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer.tsx"
import HomeView from "../components/HomeView.tsx"
import { VolunteerCard } from "../components/VolunteerCard.tsx"
import AboutUs from "../components/AboutUs.tsx"
import api, { Opportunity } from "../services/api"

export default function LandingPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchCity, setSearchCity] = useState("")

  useEffect(() => {
    document.title = "VolunteerHub"
    
    // Fetch urgent opportunities on initial load
    const fetchUrgentOpportunities = async () => {
      try {
        setLoading(true)
        const urgentOpps = await api.opportunities.getUrgent()
        setOpportunities(urgentOpps)
      } catch (err) {
        console.error("Failed to fetch urgent opportunities:", err)
        setError("Failed to load opportunities. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUrgentOpportunities()
  }, [])

  const handleSearch = async (city: string) => {
    setSearchCity(city)
    setSearchPerformed(true)
    setLoading(true)
    setError(null)
    
    try {
      const results = await api.opportunities.getByCity(city)
      setOpportunities(results)
      if (results.length === 0) {
        setError(`No opportunities found in ${city}`)
      }
    } catch (err) {
      console.error(`Error searching for opportunities in ${city}:`, err)
      setError(`Failed to search for opportunities in ${city}. Please try again.`)
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  // Convert opportunity tags from type_of_work
  const getTagsFromOpportunity = (opp: Opportunity) => {
    const categoryColors: Record<string, string> = {
      education: "#f59e0b", // amber-500
      community: "#60a5fa", // blue-400
      city: "#34d399", // green-400
      environment: "#10b981", // emerald-500
      healthcare: "#f87171", // red-400
      default: "#cbd5e1", // slate-300
    }
    
    return [
      {
        id: 1,
        name: opp.category,
        color: categoryColors[opp.category] || categoryColors.default,
      },
      {
        id: 2,
        name: opp.type_of_work,
        color: "#cbd5e1", // slate-300
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-start items-center">
        <div className="w-full max-w-6xl px-4">
          <HomeView onSearch={handleSearch} />
          
          {/* Search results or featured opportunities */}
          <div className="mt-8 mb-16">
            {searchPerformed && (
              <h2 className="text-2xl font-semibold mb-6">
                {loading ? "Searching..." : `Volunteer Opportunities in ${searchCity}`}
              </h2>
            )}
            
            {!searchPerformed && opportunities.length > 0 && (
              <h2 className="text-2xl font-semibold mb-6">
                Urgent Volunteer Opportunities
              </h2>
            )}
            
            {loading && <div className="text-center py-8">Loading...</div>}
            
            {error && <div className="text-center text-red-500 py-4">{error}</div>}
            
            <div className="space-y-6">
              {opportunities.map((opp) => (
                <VolunteerCard
                  key={opp._id}
                  id={opp._id}
                  title={opp.type_of_work}
                  city={opp.location}
                  date="Flexible" // This could be updated if you add date field to opportunities
                  tags={getTagsFromOpportunity(opp)}
                  imageUrl={opp.image}
                  description={opp.description}
                  organization={opp.org_name}
                  onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
                />
              ))}
            </div>
          </div>
          
          <AboutUs />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
