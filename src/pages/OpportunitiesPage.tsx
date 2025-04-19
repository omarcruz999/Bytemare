"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { VolunteerCard } from "../components/VolunteerCard"
import LeaderboardCard from "../components/LeaderboardCard"
import api, { type Opportunity } from "../services/api"
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
  const navigate = useNavigate()
  const city = searchParams.get("city") || ""
  const [searchQuery, setSearchQuery] = useState(city)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [activeSortOption, setActiveSortOption] = useState<string>("urgency-high")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.title = "Volunteer Opportunities | Helping Hand"
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

  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`)
  }

  const toggleFilter = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const clearFilters = () => {
    setActiveFilters([])
  }

  const handleSort = (sortOption: string) => {
    setActiveSortOption(sortOption)
  }

  const getTagsFromOpportunity = (opp: Opportunity) => {
    const categoryColors: Record<string, string> = {
      education: "#f59e0b",
      community: "#60a5fa",
      city: "#34d399",
      environment: "#10b981",
      healthcare: "#f87171",
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
      },
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

  const availableCategories = useMemo(() => {
    const categories = opportunities.map((opp) => opp.category.toLowerCase())
    return [...new Set(categories)]
  }, [opportunities])

const filteredAndSortedOpportunities = useMemo(() => {
    let result = opportunities
  
    if (activeFilters.length > 0) {
      result = result.filter((opp) => activeFilters.includes(opp.category.toLowerCase()))
    }
  
    return [...result].sort((a, b) => {
      // Helper function to convert urgency string to numeric value
      const getUrgencyValue = (urgency: string): number => {
        switch (urgency.toLowerCase()) {
          case "high": return 3;
          case "medium": return 2;
          case "low": return 1;
          default: return 0;
        }
      };
  
      switch (activeSortOption) {
        case "urgency-high":
          return getUrgencyValue(b.urgency) - getUrgencyValue(a.urgency);
        case "urgency-low":
          return getUrgencyValue(a.urgency) - getUrgencyValue(b.urgency);
        case "date-new":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        case "date-old":
          return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
        case "distance":
          return 0;
        default:
          return 0;
      }
    })
  }, [opportunities, activeFilters, activeSortOption])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search + Sort + Filter Controls */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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

                <div className="flex gap-4 w-full md:w-auto">
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

                  <button
                    className={`flex items-center gap-2 rounded-lg shadow-md h-[52px] px-5 font-medium ${
                      activeFilters.length > 0 ? "bg-teal-600 text-white" : "bg-white text-gray-700"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                    {activeFilters.length > 0 && (
                      <span className="bg-white text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold ml-1">
                        {activeFilters.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Filter Tags */}
              {showFilters && (
                <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-700 text-lg">Filter by Category</h3>
                    {activeFilters.length > 0 && (
                      <button onClick={clearFilters} className="text-gray-500 hover:text-gray-700 flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        Clear filters
                      </button>
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
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isActive ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          }`}
                          style={{ backgroundColor: isActive ? categoryInfo.color : undefined }}
                        >
                          {categoryInfo.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Layout */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {/* Results Column - Takes 2/3 on desktop */}
              <div className="md:col-span-2">
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                )}

                {error && !loading && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
                    {error}
                  </div>
                )}

                {!loading && !error && filteredAndSortedOpportunities.length === 0 && (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
                    <p className="text-gray-600 mb-6">
                      {city ? `We couldn't find any opportunities in ${city}.` : "No opportunities match your filters."}
                    </p>
                    {activeFilters.length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}

                {!loading &&
                  !error &&
                  filteredAndSortedOpportunities.length > 0 &&
                  filteredAndSortedOpportunities.map((opp) => (
                    <VolunteerCard
                      key={opp._id}
                      id={opp._id}
                      title={opp.type_of_work}
                      city={opp.location}
                      date={opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "Flexible"}
                      tags={getTagsFromOpportunity(opp)}
                      imageUrl={opp.image}
                      description={opp.description}
                      organization={opp.org_name}
                      urgency={opp.urgency}
                      onLearnMore={handleLearnMore}
                    />
                  ))}
              </div>

              {/* Sidebar - Takes 1/3 on desktop */}
              <div className="space-y-6">
                {/* Leaderboard Card */}
                {city && <LeaderboardCard city={city} />}
                
                {/* Other sidebar content */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-lg border-b pb-2 mb-3">Quick Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>Filter by category to find opportunities matching your interests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>Look for "High Urgency" tags for opportunities that need immediate help</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>Create an account to save your favorite opportunities and track your volunteer hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
