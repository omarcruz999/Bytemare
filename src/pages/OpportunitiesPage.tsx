"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { VolunteerCard } from "../components/VolunteerCard"
import api, { type Opportunity } from "../services/api"

export default function OpportunitiesPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const city = searchParams.get("city")
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filtering and sorting states
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [activeSortOption, setActiveSortOption] = useState<string>("urgency-high")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.title = "Volunteer Opportunities | VolunteerHub"
    setSearchQuery(city)

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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/opportunities?city=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  const handleSort = (sortOption: string) => {
    setActiveSortOption(sortOption)
  }

  // Apply filters and sorting to opportunities
  const filteredAndSortedOpportunities = useMemo(() => {
    // First apply filters
    let result = opportunities

    if (activeFilters.length > 0) {
      result = result.filter((opp) => activeFilters.includes(opp.category.toLowerCase()))
    }

    // Then apply sorting
    return [...result].sort((a, b) => {
      switch (activeSortOption) {
        case "urgency-high":
          return b.urgency.localeCompare(a.urgency)
        case "urgency-low":
          return a.urgency.localeCompare(b.urgency)
        case "date-new":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
        case "date-old":
          return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime()
        case "distance":
          // This would require geolocation data, using a placeholder for now
          return 0
        default:
          return 0
      }
    })
  }, [opportunities, activeFilters, activeSortOption])

  const getTagsFromOpportunity = (opp: Opportunity) => {
    const categoryColors: Record<string, string> = {
      education: "#f59e0b",
      community: "#60a5fa",
      environment: "#10b981",
      healthcare: "#f87171",
      animals: "#a78bfa",
      arts: "#ec4899",
      food: "#fbbf24",
      outdoor: "#34d399",
      indoor: "#818cf8",
      default: "#cbd5e1",
    }

    const tags = [
      {
        id: 1,
        name: opp.category,
        color: categoryColors[opp.category.toLowerCase()] || categoryColors.default,
      },
      {
        id: 2,
        name: opp.type_of_work,
        color: "#cbd5e1",
      },
    ]
    
    if (opp.urgency === 'high') {
      tags.push({
        id: 3,
        name: "High Urgency",
        color: "#ef4444",
      })
    }
    
    return tags
  }

  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`)
  }

  // Get unique categories from opportunities for filter options
  const availableCategories = useMemo(() => {
    const categories = opportunities.map((opp) => opp.category.toLowerCase())
    return [...new Set(categories)]
  }, [opportunities])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search and Filter Section */}
            <div className="mb-8">
              {/* Search Bar and Buttons Container */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search Bar Container - Styled to match the image */}
                <div className="w-full md:w-[700px] bg-white rounded-lg shadow-md overflow-hidden flex items-center h-[52px]">
                  <div className="flex-1 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search for volunteer opportunities by city..."
                      className="w-full px-3 py-3 text-base border-none focus:outline-none focus:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-medium h-full px-6"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>

                {/* Sort and Filter Buttons - Styled to match the image */}
                <div className="flex gap-4 w-full md:w-auto">
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 bg-white rounded-lg shadow-md h-[52px] px-5 text-gray-700 font-medium">
                        <SortDesc className="h-5 w-5" />
                        <span>Sort</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      {SORT_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          className={`${activeSortOption === option.id ? "bg-teal-50 text-teal-700 font-medium" : ""}`}
                          onClick={() => handleSort(option.id)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

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
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Search icon component
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
