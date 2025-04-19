"use client"

import { useState, useEffect } from "react"
import { MapPin, Award, Edit, Users, Building, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Badge } from "../components/badge"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { VolunteerCard } from "../components/VolunteerCard.tsx"
import api, { type Opportunity, type Organization } from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function OrganizationProfile() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`)
  }

  const userIsOrgOwner = user?.email === organization?.email

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!id) {
        setError("Organization ID is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch organization details
        const orgData = await api.organizations.getById(id)
        setOrganization(orgData)
        
        // Fetch organization's opportunities
        const allOpportunities = await api.opportunities.getAll()
        const orgOpportunities = allOpportunities.filter(
          (opp) => opp.org_name === orgData.org_name
        )
        setOpportunities(orgOpportunities)
        
      } catch (err) {
        console.error("Failed to fetch organization data:", err)
        setError("Failed to load organization data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationData()
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 pt-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </>
    )
  }

  if (error || !organization) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 pt-6 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700">{error || "Organization not found"}</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 pt-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Organization Header */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <CardContent className="p-6 relative">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="absolute -top-16 border-4 border-white rounded-full shadow-lg">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={organization.logoImage || "/placeholder.svg"}
                      alt={organization.org_name}
                    />
                    <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                      {organization.org_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-16 md:mt-0 md:ml-36 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-800">{organization.org_name}</h1>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <p className="text-gray-500">@{organization.org_name.toLowerCase().replace(/\s+/g, '')}</p>
                    </div>
                    { (
                      <div className="flex flex-col gap-2">
                        <Button className="bg-green-600 hover:bg-green-700 self-start">
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700 self-start"
                          onClick={() => navigate("/new-opportunity")}
                        >
                          + Post New Opportunity
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-green-600" />
                      {opportunities[0]?.location || "Location not specified"}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-green-600" />
                      {opportunities.length} Active Opportunities
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-1 h-4 w-4 text-green-600" />
                      <a
                        href={`mailto:${organization.email}`}
                        className="text-green-600 hover:underline"
                      >
                        {organization.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission and Description */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">About Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 leading-relaxed">{organization.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{opportunities.length}</p>
                  <p className="text-gray-600">Active Opportunities</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{typeof organization.phone === 'number' ? organization.phone.toString().slice(-4) : 'N/A'}</p>
                  <p className="text-gray-600">Contact Number</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{opportunities.filter(o => o.urgency === 'high').length}</p>
                  <p className="text-gray-600">Urgent Needs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-24">Email:</span>
                <a href={`mailto:${organization.email}`} className="text-green-600 hover:underline">
                  {organization.email}
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Phone:</span>
                <a href={`tel:${organization.phone}`} className="text-green-600 hover:underline">
                  {organization.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Current Opportunities */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Current Opportunities</h2>

            {opportunities.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">No active opportunities</h3>
                  <p className="text-gray-500 mt-2">This organization doesn't have any active opportunities at the moment.</p>
                  {userIsOrgOwner && (
                    <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => navigate("/new-opportunity")}>
                      Post New Opportunity
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Render actual opportunities from API */}
            {opportunities.map((opportunity) => (
              <VolunteerCard
                key={opportunity._id}
                id={opportunity._id}
                title={opportunity.type_of_work}
                city={opportunity.location}
                date={opportunity.createdAt ? new Date(opportunity.createdAt).toLocaleDateString() : "Ongoing"}
                tags={[
                  { id: 1, name: opportunity.category, color: "#10b981" },
                  { id: 2, name: opportunity.urgency, color: opportunity.urgency === "high" ? "#ef4444" : "#f59e0b" },
                ]}
                imageUrl={opportunity.image || "/placeholder.svg?height=200&width=400"}
                description={opportunity.description}
                organization={opportunity.org_name}
                urgency={opportunity.urgency}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
