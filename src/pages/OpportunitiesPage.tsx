"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SearchBar from "../components/SearchBar"
import { VolunteerCard } from "../components/VolunteerCard"
import api, { type Opportunity } from "../services/api"
import { Button } from "../components/ui/Button"
import { Filter, SortDesc, X, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

// Category definitions with colors
const CATEGORIES: Record<string, { name: string; color: string }> = {
  education: { name: "Education", color: "#f59e0b" },
  community: { name: "Community", color: "#60a5fa" },
  environment: { name: "Environment", color: "#10b981" },
  healthcare: { name: "Healthcare", color: "#f87171" },
  animals: { name: "Animals", color: "#a78bfa" },
  arts: { name: "Arts & Culture", color: "#ec4899" },
  food: { name: "Food", color: "#fbbf24" },
  outdoor: { name: "Outdoor", color: "#34d399" },
  indoor: { name: "Indoor", color: "#818cf8" },
  default: { name: "Other", color: "#cbd5e1" },
}

// Sort options
const SORT_OPTIONS = [
  { id: "urgency-high", label: "Urgency: High to Low" },
  { id: "urgency-low", label: "Urgency: Low to High" },
  { id: "date-new", label: "Date: Newest First" },
  { id: "date-old", label: "Date: Oldest First" },
  { id: "distance", label: "Distance: Nearest First" },
]

export default function OpportunitiesPage() {
  const [searchParams] = useSearchParams()
  const city = searchParams.get("city") || ""
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filtering and sorting states
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [activeSortOption, setActiveSortOption] = useState<string>("urgency-high")
  const [showFilters, setShowFilters] = useState(false)

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

    return [
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
            {/* Search and Filter Section - Wrapped in a container for alignment */}
            <div className="relative mb-8">
              {/* Search Bar and Buttons Container */}
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                {/* Search Bar Container */}
                <div className="w-full md:flex-1 relative">
                  {/* This div ensures SearchBar's parent has the right structure */}
                  <div className="w-full max-w-none">
                    <SearchBar />
                  </div>
                </div>

                {/* Sort and Filter Buttons - Aligned with search bar */}
                <div className="flex gap-2 w-full md:w-auto self-center md:self-auto">
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 bg-white shadow-md h-[60px] px-6">
                        <SortDesc className="h-5 w-5" />
                        <span className="text-base">Sort</span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
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

                  {/* Filter Button */}
                  <Button
                    variant={activeFilters.length > 0 ? "default" : "outline"}
                    className={`flex items-center gap-2 h-[60px] px-6 ${
                      activeFilters.length > 0 ? "bg-teal-600" : "bg-white shadow-md"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-5 w-5" />
                    <span className="text-base">Filter</span>
                    {activeFilters.length > 0 && (
                      <span className="bg-white text-teal-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {activeFilters.length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Filter Tags */}
              {showFilters && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">Filter by Category</h3>
                    {activeFilters.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear filters
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableCategories.map((category) => {
                      const categoryInfo = CATEGORIES[category.toLowerCase()] || CATEGORIES.default
                      const isActive = activeFilters.includes(category)

                      return (
                        <button
                          key={category}
                          onClick={() => toggleFilter(category)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            isActive ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          }`}
                          style={{
                            backgroundColor: isActive ? categoryInfo.color : undefined,
                          }}
                        >
                          {categoryInfo.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-teal-700 mb-6">
              {city ? `Volunteer Opportunities in ${city}` : "Volunteer Opportunities"}
              {activeFilters.length > 0 && (
                <span className="text-lg font-normal text-gray-500 ml-2">
                  ({filteredAndSortedOpportunities.length} results)
                </span>
              )}
            </h1>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                  <p>{error}</p>
                  <p className="text-sm mt-2">Try searching for a different city or removing filters.</p>
                </div>
              </div>
            )}

            {!loading && !error && filteredAndSortedOpportunities.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg inline-block">
                  <p>No opportunities match your current filters.</p>
                  <Button variant="link" onClick={clearFilters} className="text-teal-600 mt-2">
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6">
                {filteredAndSortedOpportunities.map((opp) => (
                  <VolunteerCard
                    key={opp._id}
                    id={opp._id}
                    title={opp.type_of_work}
                    city={opp.location}
                    date={opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "Flexible"}
                    tags={getTagsFromOpportunity(opp)}
                    imageUrl={opp.image || "/placeholder.svg?height=300&width=400"}
                    description={opp.description}
                    organization={opp.org_name}
                    urgency={opp.urgency}
                    onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
                  />
                ))}
              </div>
            )}

            {/* No results state */}
            {!loading && !error && opportunities.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md mx-auto">
                  <div className="rounded-full bg-teal-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Filter className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No opportunities found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any volunteer opportunities in {city}. Try searching for a different city or check
                    back later.
                  </p>
                  <Button onClick={() => (window.location.href = "/opportunities")}>Clear Search</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
