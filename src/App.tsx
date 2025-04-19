import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import LandingPage from "./pages/LandingPage"
import UserRegister from "./pages/UserRegister"
import VolunteerProfile from "./pages/VolunteerProfile"
import OrganizationRegisterPage from "./pages/OrganizationRegisterPage"
import OpportunitiesPage from "./pages/OpportunitiesPage" 
import OpportunityDetailPage from "./pages/OportunitiesDetailPage"
import VolunteerApplicationFormPage from "./pages/VolunteerApplicationFormPage"
import NewOpportunityForm from "./pages/NewOpportunityForm"
import Dashboard from "./pages/Dashboard"
import OrgizationProfile from "./pages/OrginizationProfile"

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/register" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/organization/register" element={<OrganizationRegisterPage />} />
          <Route 
            path="/volunteer/profile" 
            element={
              <ProtectedRoute>
                <VolunteerProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/opportunities" element={<OpportunitiesPage />} /> 
          <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
          <Route 
            path="/new-opportunity" 
            element={
              <ProtectedRoute>
                <NewOpportunityForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/opportunity/:id/apply" 
            element={
              <ProtectedRoute>
                <VolunteerApplicationFormPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/orginization-profile/:id" element={<OrgizationProfile />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App