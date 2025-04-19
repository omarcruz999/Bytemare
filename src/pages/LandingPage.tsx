import { useState, useEffect } from "react"
import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer.tsx"
import HomeView from "../components/HomeView.tsx"
import { VolunteerCard } from "../components/VolunteerCard.tsx"
import AboutUs from "../components/AboutUs.tsx"
import api, { Opportunity } from "../services/api"
import { useNavigate } from "react-router-dom"
import { Contact } from "lucide-react"
import ContactUs from "../components/ContactUs.tsx"

export default function LandingPage() {
  const [urgentOpportunities, setUrgentOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "VolunteerHub"
    
    // Fetch urgent opportunities on initial load
    const fetchUrgentOpportunities = async () => {
      try {
        setLoading(true)
        const urgentOpps = await api.opportunities.getUrgent()
        setUrgentOpportunities(urgentOpps)
      } catch (err) {
        console.error("Failed to fetch urgent opportunities:", err)
        setError("Failed to load opportunities. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchUrgentOpportunities()
  }, [])

  // Convert opportunity tags from type_of_work
  const getTagsFromOpportunity = (opp: Opportunity) => {
    const categoryColors: Record<string, string> = {
      education: "#f59e0b", // amber-500
      community: "#60a5fa", // blue-400
      city: "#34d399", // green-400
      environment: "#10b981", // emerald-500
      healthcare: "#f87171", // red-400
      default: "#64748b", // slate-500 (darker than previous)
    }
    
    // Create an array with category and type_of_work tags
    const tags = [
      {
        id: 1,
        name: opp.category,
        color: categoryColors[opp.category] || categoryColors.default,
        textColor: "#ffffff", // white text for colored backgrounds
      },
      {
        id: 2,
        name: opp.type_of_work,
        color: "#64748b", // slate-500 (darker than previous)
        textColor: "#ffffff", // white text
      }
    ];
    
    // Add urgency tag if high
    if (opp.urgency === "high") {
      tags.push({
        id: 3,
        name: "High Urgency",
        color: "#ef4444", // red-500
        textColor: "#ffffff", // white text
      });
    }
    
    return tags;
  }
  
  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-start items-center">
        <div className="w-full max-w-6xl px-4">
          <HomeView />
          
          {/* Urgent Opportunities Section */}
          <div className="mt-8 mb-16">
            <h2 className="text-2xl font-semibold mb-6">
              Urgent Volunteer Opportunities
            </h2>
            
            {loading && <div className="text-center py-8">Loading...</div>}
            
            {error && <div className="text-center text-red-500 py-4">{error}</div>}
            
            {!loading && urgentOpportunities.length === 0 && !error && (
              <div className="text-center py-4">No urgent opportunities available at the moment.</div>
            )}
            
            <div className="space-y-6">
              {urgentOpportunities.map((opp) => (
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
                  onLearnMore={handleLearnMore}
                />
              ))}
            </div>
          </div>
          
          <AboutUs />
          <ContactUs />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
