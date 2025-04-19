import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import UserRegister from "./pages/UserRegister"
import OrganizationRegisterPage from "./pages/OrganizationRegisterPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/organization/register" element={<OrganizationRegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
