"use client"

import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { VolunteerCard } from "../components/VolunteerCard"

// Mock data for volunteer opportunities
const mockOpportunities = [
  {
    id: "1",
    title: "Park Clean-Up",
    city: "San Francisco",
    date: "April 25, 2025",
    tags: [
      { id: 1, name: "Outdoor", color: "#34d399" },
      { id: 2, name: "Community", color: "#60a5fa" },
    ],
    imageUrl: "https://placecats.com/300/200",
    description: "Help clean up the community park. Tools and snacks provided!",
    organization: "Green SF Org",
  },
  {
    id: "2",
    title: "Food Bank Assistant",
    city: "Oakland",
    date: "April 30, 2025",
    tags: [
      { id: 3, name: "Indoor", color: "#f87171" },
      { id: 4, name: "Food", color: "#fbbf24" },
    ],
    imageUrl: "https://placecats.com/301/200",
    description: "Sort and package food donations for distribution to those in need.",
    organization: "Bay Area Food Bank",
  },
  {
    id: "3",
    title: "Senior Center Helper",
    city: "Berkeley",
    date: "May 5, 2025",
    tags: [
      { id: 5, name: "Elderly", color: "#a78bfa" },
      { id: 6, name: "Social", color: "#ec4899" },
    ],
    imageUrl: "https://placecats.com/302/200",
    description: "Spend time with seniors, help with activities, and brighten their day.",
    organization: "Golden Years Center",
  },
]

export default function OpportunitiesPage() {
  useEffect(() => {
    document.title = "Volunteer Opportunities | VolunteerHub"
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Volunteer Opportunities</h1>

          <div className="grid grid-cols-1 gap-6">
            {mockOpportunities.map((opportunity) => (
              <VolunteerCard
                key={opportunity.id}
                id={opportunity.id}
                title={opportunity.title}
                city={opportunity.city}
                date={opportunity.date}
                tags={opportunity.tags}
                imageUrl={opportunity.imageUrl}
                description={opportunity.description}
                organization={opportunity.organization}
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
