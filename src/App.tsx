import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import UserRegister from "./pages/UserRegister"
import VolunteerProfile from "./pages/VolunteerProfile"
import OrganizationRegisterPage from "./pages/OrganizationRegisterPage"
import OpportunitiesPage from "./pages/OpportunitiesPage" 
import OpportunityDetailPage from "./pages/OportunitiesDetailPage"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/organization/register" element={<OrganizationRegisterPage />} />
        <Route path="/volunteer/profile" element={<VolunteerProfile />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} /> 
        <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
