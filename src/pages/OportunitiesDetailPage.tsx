"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/badge"
import api, { type Opportunity, type Organization } from "../services/api"

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedOpportunities, setRelatedOpportunities] = useState<Opportunity[]>([])

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch opportunity details
        const opportunityData = await api.opportunities.getById(id)
        setOpportunity(opportunityData)
        document.title = `${opportunityData.type_of_work} | Helping Hand`

        // Find organization by name
        const orgs = await api.organizations.getAll()
        const matchingOrg = orgs.find((org) => org.org_name === opportunityData.org_name)
        if (matchingOrg) {
          setOrganization(matchingOrg)
        }

        // Fetch related opportunities (same category or location)
        const allOpportunities = await api.opportunities.getAll()
        const related = allOpportunities
          .filter(
            (opp) =>
              opp._id !== id &&
              (opp.category === opportunityData.category || opp.location === opportunityData.location),
          )
          .slice(0, 3) // Limit to 3 related opportunities

        setRelatedOpportunities(related)
      } catch (err) {
        console.error("Failed to fetch opportunity details:", err)
        setError("Failed to load opportunity details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunityDetails()
  }, [id])

  const handleApply = () => {
    navigate(`/opportunity/${id}/apply`)
  }

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-teal-700">Loading opportunity details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !opportunity) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error || "Opportunity not found"}</p>
            <Button onClick={handleGoBack}>Go Back</Button>
          </div>
        </div>
      </>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Flexible"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-teal-700 hover:text-teal-900 mb-6 transition-colors"
          >
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
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to opportunities
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Hero image */}
            <div className="h-64 md:h-80 w-full relative">
              <img
                src={opportunity.image || "/placeholder.svg?height=400&width=800"}
                alt={opportunity.type_of_work}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{opportunity.type_of_work}</h1>
                  <p className="text-xl opacity-90">{opportunity.org_name}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Main content - 2/3 width on desktop */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Opportunity</h2>
                    <p className="text-gray-700 whitespace-pre-line">{opportunity.description}</p>
                  </div>

                  {/* Organization info if available */}
                  {organization && (
                    <div className="border-t pt-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">About {organization.org_name}</h2>
                      <div className="flex items-start gap-4">
                        {organization.logoImage && (
                          <img
                            src={organization.logoImage || "/placeholder.svg"}
                            alt={organization.org_name}
                            className="w-16 h-16 object-contain rounded"
                          />
                        )}
                        <div>
                          <p className="text-gray-700">{organization.description}</p>
                          {organization.email && <p className="mt-2 text-teal-700">Contact: {organization.email}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Related opportunities */}
                  {relatedOpportunities.length > 0 && (
                    <div className="border-t pt-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Opportunities</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {relatedOpportunities.map((opp) => (
                          <div
                            key={opp._id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/opportunity/${opp._id}`)}
                          >
                            <div className="flex gap-3">
                              <img
                                src={opp.image || "/placeholder.svg?height=80&width=80"}
                                alt={opp.type_of_work}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div>
                                <h3 className="font-semibold text-gray-800">{opp.type_of_work}</h3>
                                <p className="text-sm text-gray-600">{opp.org_name}</p>
                                <p className="text-sm text-gray-600">{opp.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar - 1/3 width on desktop */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-teal-600 mt-0.5"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-700">Location</p>
                          <p className="text-gray-600">{opportunity.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-teal-600 mt-0.5"
                        >
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-700">Date</p>
                          <p className="text-gray-600">{formatDate(opportunity.createdAt || "")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-teal-600 mt-0.5"
                        >
                          <path d="M12 2H2v10h10V2Z" />
                          <path d="M22 12h-10v10h10V12Z" />
                          <path d="M12 12H2v10h10V12Z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-700">Category</p>
                          <p className="text-gray-600">{opportunity.category}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-teal-600 mt-0.5"
                        >
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="m14.5 9-5 5" />
                          <path d="m9.5 9 5 5" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-700">Urgency</p>
                          <Badge
                            className={
                              opportunity.urgency === "high"
                                ? "bg-red-100 text-red-800"
                                : opportunity.urgency === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {opportunity.urgency.charAt(0).toUpperCase() + opportunity.urgency.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply section */}
                  <div className="bg-teal-50 rounded-lg p-6 border border-teal-100">
                    <h3 className="text-lg font-semibold text-teal-800 mb-4">Ready to help?</h3>
                    <p className="text-teal-700 mb-4">
                      Join this volunteer opportunity and make a difference in your community.
                    </p>
                    <Button className="w-full py-3 text-base" onClick={handleApply}>
                      Apply Now
                    </Button>
                    <p className="text-sm text-teal-600 mt-3 text-center">
                      You'll need to sign in or create an account
                    </p>
                  </div>

                  {/* Share section */}
                  <div className="bg-white rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this opportunity</h3>
                    <div className="flex justify-center gap-4">
                      <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <path d="m22 6-10 7L2 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
