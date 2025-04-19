"use client"

import { useState } from "react"
import { CalendarDays, MapPin, Award, Edit, Clock, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - would come from your MongoDB in the real implementation
const volunteerData = {
  username: "SarahJohnson",
  fullName: "Sarah Johnson",
  profilePicture: "/placeholder.svg?height=300&width=300",
  location: "Portland, OR",
  joinDate: "March 2023",
  bio: "Passionate about making a difference in my community. I love working with children and the elderly, and I'm particularly interested in environmental conservation projects. In my free time, I enjoy hiking, reading, and practicing yoga.",
  skills: ["Teaching", "Event Planning", "First Aid Certified", "Gardening", "Social Media"],
  volunteerHistory: [
    {
      id: 1,
      organization: "City Food Bank",
      role: "Food Distribution Volunteer",
      date: "Jan 2024 - Mar 2024",
      hours: 45,
      description: "Assisted with sorting donations and distributing food packages to families in need.",
      impact: "Helped provide meals to over 200 families",
    },
    {
      id: 2,
      organization: "Green Earth Initiative",
      role: "Park Cleanup Coordinator",
      date: "Summer 2023",
      hours: 32,
      description: "Organized weekly park cleanup events and coordinated volunteer teams.",
      impact: "Removed over 500 lbs of trash from local parks",
    },
    {
      id: 3,
      organization: "Sunshine Senior Center",
      role: "Companion Volunteer",
      date: "Apr 2023 - Dec 2023",
      hours: 60,
      description:
        "Provided companionship and assistance to senior citizens, including reading, playing games, and helping with technology.",
      impact: "Regular visits to 5 seniors with limited family support",
    },
  ],
}

export default function VolunteerProfile() {
  const [activeTab, setActiveTab] = useState("history")

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="border-none shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-teal-400 to-sky-400"></div>
          <CardContent className="p-6 relative">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="absolute -top-16 border-4 border-white rounded-full shadow-lg">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={volunteerData.profilePicture || "/placeholder.svg"} alt={volunteerData.username} />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-2xl">
                    {volunteerData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-16 md:mt-0 md:ml-36 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{volunteerData.fullName}</h1>
                    <p className="text-gray-500">@{volunteerData.username}</p>
                  </div>
                  <Button className="bg-teal-600 hover:bg-teal-700 self-start">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-teal-600" />
                    {volunteerData.location}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4 text-teal-600" />
                    Joined {volunteerData.joinDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-teal-600" />
                    {volunteerData.volunteerHistory.reduce((acc, curr) => acc + curr.hours, 0)} Total Hours
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio and Skills */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">About Me</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 leading-relaxed">{volunteerData.bio}</p>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Skills & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {volunteerData.skills.map((skill, index) => (
                  <Badge key={index} className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Volunteer History</h2>
            <div className="flex items-center text-sm text-teal-600">
              <Award className="mr-1 h-4 w-4" />
              {volunteerData.volunteerHistory.length} Opportunities Completed
            </div>
          </div>

          <div className="space-y-4">
            {volunteerData.volunteerHistory.map((history) => (
              <Card key={history.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-800">{history.organization}</h3>
                          <p className="text-teal-600 font-medium">{history.role}</p>
                        </div>
                        <Badge className="bg-sky-100 text-sky-800">{history.date}</Badge>
                      </div>
                      <p className="mt-2 text-gray-600">{history.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock className="mr-1 h-4 w-4 text-teal-600" />
                          {history.hours} hours
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Heart className="mr-1 h-4 w-4 text-teal-600" />
                          {history.impact}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State for New Volunteers */}
        {volunteerData.volunteerHistory.length === 0 && (
          <Card className="border-dashed border-2 border-gray-200 bg-gray-50">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-teal-100 mb-4">
                <Award className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">No volunteer history yet</h3>
              <p className="text-gray-500 mt-2">When you complete volunteer opportunities, they'll appear here.</p>
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Find Opportunities</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
