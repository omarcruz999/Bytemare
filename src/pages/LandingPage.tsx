import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SearchBar from "../components/SearchBar"
import AboutUs from "../components/AboutUs"
import ContactUs from "../components/ContactUs"
import { VolunteerCard } from "../components/VolunteerCard"

const featuredOpportunities = [
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
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-start px-4">
        <div className="w-full max-w-6xl mt-16">
          <SearchBar />

          {/* Featured Opportunities */}
          <div className="mt-12 mb-20">
            <h2 className="text-2xl font-semibold mb-6">Featured Opportunities</h2>
            <div className="space-y-6">
              {featuredOpportunities.map((opp) => (
                <VolunteerCard
                  key={opp.id}
                  id={opp.id}
                  title={opp.title}
                  city={opp.city}
                  date={opp.date}
                  tags={opp.tags}
                  imageUrl={opp.imageUrl}
                  description={opp.description}
                  organization={opp.organization}
                  onLearnMore={(id) => console.log(`Clicked Learn More on ID: ${id}`)}
                />
              ))}
            </div>
          </div>

          <AboutUs />
          <ContactUs />
        </div>
      </main>

      <Footer />
    </div>
  )
}
