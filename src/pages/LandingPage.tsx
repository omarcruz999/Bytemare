import Navbar from "../components/Navbar.tsx"
import Footer from "../components/Footer.tsx"
import HomeView from "../components/HomeView.tsx"
import { VolunteerCard } from "../components/VolunteerCard.tsx"
import AboutUs from "../components/AboutUs.tsx"
import { useEffect } from "react"
import ContactUs from "../components/ContactUs.tsx"
import { useLocation } from "react-router-dom"

export default function LandingPage() {
  const location = useLocation()

  useEffect(() => {
    document.title = "VolunteerHub"

    // scroll to the specified section if passed in location.state
    const scrollToId = location.state?.scrollToId
    if (scrollToId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const el = document.getElementById(scrollToId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }    
  }, [location])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex justify-center items-start">
        <div className="mx-auto">
          <HomeView />
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

          <AboutUs />
          <ContactUs />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
