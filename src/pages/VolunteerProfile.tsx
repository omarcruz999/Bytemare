"use client"

//import { useState } from "react"
import { CalendarDays, MapPin, Award, Edit, Clock } from "lucide-react" //deleted "Heart" from import
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Badge } from "../components/badge"
import Navbar from "../components/Navbar"
import { VolunteerCard } from "../components/VolunteerCard.tsx"

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
  //const [activeTab, setActiveTab] = useState("history")

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50 pt-6">
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
                    <h1 className="text-2xl font-bold text-gray-800">{"Sarah Johnson"}</h1>
                    <p className="text-gray-500">@{"SarahJohnson"}</p>
                  </div>
                  <Button className="bg-teal-600 hover:bg-teal-700 self-start">
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-teal-600" />
                    {"Portland, OR"}
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4 text-teal-600" />
                    Joined {"March 2023"}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-teal-600" />
                    {"137"} Total Hours
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
        <VolunteerCard
            id="1"
            title="Park Clean-Up"
            city="San Francisco"
            date="April 25, 2025"
            tags={[
              { id: 1, name: "Outdoor", color: "#34d399" },
              { id: 2, name: "Community", color: "#60a5fa" },
            ]}
            imageUrl="https://placecats.com/300/200" // or use a placeholder: "https://via.placeholder.com/400x200"
            description="Help clean up the community park. Tools and snacks provided!"
            organization="Green SF Org"
            onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
          />
          <VolunteerCard
            id="1"
            title="Park Clean-Up"
            city="San Francisco"
            date="April 25, 2025"
            tags={[
              { id: 1, name: "Outdoor", color: "#34d399" },
              { id: 2, name: "Community", color: "#60a5fa" },
            ]}
            imageUrl="https://placecats.com/300/200" // or use a placeholder: "https://via.placeholder.com/400x200"
            description="Help clean up the community park. Tools and snacks provided!"
            organization="Green SF Org"
            onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
          />

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
    </>
  )
}
