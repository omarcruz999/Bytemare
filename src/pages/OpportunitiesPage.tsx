import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { VolunteerCard } from "../components/VolunteerCard"
import api, { Opportunity } from "../services/api"

export default function OpportunitiesPage() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get("city")
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = "Volunteer Opportunities | VolunteerHub"

    if (!city) return

    const fetchByCity = async () => {
      setLoading(true)
      setError(null)
      try {
        const results = await api.opportunities.getByCity(city)
        setOpportunities(results)
        if (results.length === 0) {
          setError(`No opportunities found in ${city}`)
        }
      } catch (err) {
        console.error("Failed to fetch:", err)
        setError(`Error fetching opportunities for ${city}`)
      } finally {
        setLoading(false)
      }
    }

    fetchByCity()
  }, [city])

  const getTagsFromOpportunity = (opp: Opportunity) => {
    const categoryColors: Record<string, string> = {
      education: "#f59e0b",
      community: "#60a5fa",
      city: "#34d399",
      environment: "#10b981",
      healthcare: "#f87171",
      default: "#cbd5e1",
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
        color: "#cbd5e1",
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">
            {city ? `Volunteer Opportunities in ${city}` : "Volunteer Opportunities"}
          </h1>

          {loading && <div className="text-center py-8">Loading...</div>}
          {error && <div className="text-center text-red-500 py-4">{error}</div>}

          <div className="grid grid-cols-1 gap-6">
            {opportunities.map((opp) => (
              <VolunteerCard
                key={opp._id}
                id={opp._id}
                title={opp.type_of_work}
                city={opp.location}
                date="Flexible"
                tags={getTagsFromOpportunity(opp)}
                imageUrl={opp.image}
                description={opp.description}
                organization={opp.org_name}
                onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
