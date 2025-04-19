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
import api, { type Opportunity } from "../services/api"
import { useNavigate } from "react-router-dom"

// Mock data - would come from your MongoDB in the real implementation
const organizationData = {
  name: "Green Earth Initiative",
  username: "greenearthorg",
  profilePicture: "/placeholder.svg?height=300&width=300",
  location: "Portland, OR",
  foundedDate: "2015",
  mission:
    "Dedicated to environmental conservation and sustainability education. We organize community clean-ups, tree planting events, and educational workshops to promote eco-friendly practices. Our goal is to create a greener, more sustainable future for generations to come.",
  focusAreas: [
    "Environmental Conservation",
    "Community Education",
    "Sustainability",
    "Urban Gardening",
    "Climate Action",
  ],
  stats: {
    volunteersHelped: 1250,
    eventsHosted: 87,
    totalImpactHours: 4500,
  },
  contactInfo: {
    email: "contact@greenearth.org",
    phone: "(503) 555-1234",
    website: "www.greenearth.org",
  },
}

export default function OrganizationProfile() {
  const navigate = useNavigate()

  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`)
  }

  useEffect(() => {
    const fetchOrganizationOpportunities = async () => {
      try {
        setLoading(true)
        // In a real implementation, you would fetch opportunities by organization ID
        // For now, we'll use the mock API and filter by org name
        const allOpportunities: Opportunity[] = await api.opportunities.getAll()
        const orgOpportunities = allOpportunities.filter((opp) => opp.org_name === organizationData.name)
        setOpportunities(orgOpportunities)
      } catch (err) {
        console.error("Failed to fetch opportunities:", err)
        setError("Failed to load opportunities. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizationOpportunities()
  }, [])

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
                      src={organizationData.profilePicture || "/placeholder.svg"}
                      alt={organizationData.name}
                    />
                    <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                      {organizationData.name
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
                        <h1 className="text-2xl font-bold text-gray-800">{organizationData.name}</h1>
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      </div>
                      <p className="text-gray-500">@{organizationData.username}</p>
                    </div>
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
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-green-600" />
                      {organizationData.location}
                    </div>
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4 text-green-600" />
                      Founded in {organizationData.foundedDate}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-green-600" />
                      {organizationData.stats.volunteersHelped} Volunteers Engaged
                    </div>
                    <div className="flex items-center">
                      <Globe className="mr-1 h-4 w-4 text-green-600" />
                      <a
                        href={`https://${organizationData.contactInfo.website}`}
                        className="text-green-600 hover:underline"
                      >
                        {organizationData.contactInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission and Focus Areas */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 leading-relaxed">{organizationData.mission}</p>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {organizationData.focusAreas.map((area, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{organizationData.stats.volunteersHelped}</p>
                  <p className="text-gray-600">Volunteers Engaged</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{organizationData.stats.eventsHosted}</p>
                  <p className="text-gray-600">Events Hosted</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">{organizationData.stats.totalImpactHours}</p>
                  <p className="text-gray-600">Total Impact Hours</p>
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
                <a href={`mailto:${organizationData.contactInfo.email}`} className="text-green-600 hover:underline">
                  {organizationData.contactInfo.email}
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Phone:</span>
                <a href={`tel:${organizationData.contactInfo.phone}`} className="text-green-600 hover:underline">
                  {organizationData.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Website:</span>
                <a href={`https://${organizationData.contactInfo.website}`} className="text-green-600 hover:underline">
                  {organizationData.contactInfo.website}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Current Opportunities */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Current Opportunities</h2>

            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && opportunities.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">No active opportunities</h3>
                  <p className="text-gray-500 mt-2">Create your first volunteer opportunity to get started.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => navigate("/new-opportunity")}>
                    Post New Opportunity
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Sample opportunities - in a real app, these would come from the API */}
            <VolunteerCard
              id="1"
              title="Community Park Clean-Up"
              city="Portland, OR"
              date="May 15, 2025"
              tags={[
                { id: 1, name: "Environment", color: "#10b981" },
                { id: 2, name: "Outdoor", color: "#34d399" },
              ]}
              imageUrl="/placeholder.svg?height=200&width=400"
              description="Join us for our monthly park clean-up event. Help remove litter, plant native species, and beautify our community spaces. All equipment provided!"
              organization="Green Earth Initiative"
              urgency="medium"
              onLearnMore={handleLearnMore}
            />

            <VolunteerCard
              id="2"
              title="Sustainability Workshop Leader"
              city="Portland, OR"
              date="Ongoing"
              tags={[
                { id: 1, name: "Education", color: "#f59e0b" },
                { id: 2, name: "Environment", color: "#10b981" },
              ]}
              imageUrl="/placeholder.svg?height=200&width=400"
              description="We're looking for knowledgeable volunteers to lead our sustainability workshops for local schools and community groups. Perfect for those with teaching experience or environmental expertise."
              organization="Green Earth Initiative"
              urgency="high"
              onLearnMore={handleLearnMore}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
