"use client"

import { useState, useEffect } from "react"
import { CalendarDays, MapPin, Award, Edit, Clock } from "lucide-react" //deleted "Heart" from import
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"
import { Button } from "../components/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/card"
import { Badge } from "../components/badge"
import Navbar from "../components/Navbar"
import { VolunteerCard } from "../components/VolunteerCard.tsx"
import api, { Opportunity } from "../services/api"
import { useNavigate } from "react-router-dom"
import ProfileEditForm from "../components/ProfileEditForm"
import { useAuth } from "../contexts/AuthContext"
import { format } from "date-fns"
import badge1 from "../assets/VolunteerBadges/bronze1.png"
import badge2 from "../assets/VolunteerBadges/bronze2.png"
import badge3 from "../assets/VolunteerBadges/bronze3.png"
import badge4 from "../assets/VolunteerBadges/bronze4.png"
import badge5 from "../assets/VolunteerBadges/gold1.png"
import badge6 from "../assets/VolunteerBadges/gold2.png"
import badge7 from "../assets/VolunteerBadges/gold3.png"
import badge8 from "../assets/VolunteerBadges/gold4.png"
import badge9 from "../assets/VolunteerBadges/silver1.png"
import badge10 from "../assets/VolunteerBadges/silver2.png"
import badge11 from "../assets/VolunteerBadges/silver3.png"
import badge12 from "../assets/VolunteerBadges/silver4.png"

const badges = [badge1, badge2, badge3, badge4, badge5, badge6, badge7, badge8, badge9, badge10, badge11, badge12]
const randomBadge = badges[Math.floor(Math.random() * badges.length)]

// Define interfaces for the volunteer data structure
interface VolunteerHistory {
  opportunityId: {
    _id: string;
    org_name: string;
    type_of_work: string;
    location: string;
    description: string;
  };
  date: string;
}

interface Volunteer {
  _id: string;
  name: string;
  email: string;
  aboutMe?: string;
  preferredCategories?: string[];
  profileImage?: string;
  eventsByCity?: Record<string, number>;
  totalHours?: number;
  totalEvents?: number;
  history?: VolunteerHistory[];
  joinDate?: string;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Volunteer;
  onSave: () => void;
}

// Dialog for editing profile
function EditProfileDialog({ isOpen, onClose, volunteer, onSave }: EditProfileDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <ProfileEditForm 
          volunteerId={volunteer._id} 
          currentData={{
            name: volunteer.name,
            aboutMe: volunteer.aboutMe || '',
            preferredCategories: volunteer.preferredCategories || [],
            profileImage: volunteer.profileImage || ''
          }}
          onSuccess={() => {
            onSave();
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default function VolunteerProfile() {
  const navigate = useNavigate()
  const { user } = useAuth() // Get authenticated user from Firebase
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Fetch volunteer data
  useEffect(() => {
    const fetchVolunteerProfile = async () => {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        const volunteerData = await api.volunteers.getProfileByEmail(user.email);
        setVolunteer(volunteerData);
      } catch (err) {
        console.error("Failed to fetch volunteer profile:", err);
        setError("Failed to load your profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVolunteerProfile();
  }, [user]);

  // Fetch recommended opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const allOpportunities = await api.opportunities.getAll();
        const randomized = [...allOpportunities].sort(() => Math.random() - 0.5).slice(0, 3);
        setOpportunities(randomized);
      } catch (err) {
        console.error("Failed to fetch opportunities:", err);
      }
    };
    
    fetchOpportunities();
  }, []);

  const handleLearnMore = (id: string | number) => {
    navigate(`/opportunity/${id}`);
  };
  
  // Format join date
  const formatJoinDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM yyyy");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50 pt-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-teal-700">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !volunteer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50 pt-6 flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error || "Could not load profile information"}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-sky-50 pt-6">
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          {/* Profile Header */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-teal-400 to-sky-400"></div>
            <CardContent className="p-6 relative">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="absolute -top-16 border-4 border-white rounded-full shadow-lg">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={volunteer.profileImage} alt={volunteer.name} />
                    <AvatarFallback className="bg-teal-100 text-teal-800 text-2xl">
                      {volunteer.name
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
                        <h1 className="text-2xl font-bold text-gray-800">{volunteer.name}</h1>
                        <img 
                          src={randomBadge} 
                          alt="Volunteer Badge" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <p className="text-gray-500">@{volunteer.name.replace(/\s+/g, '').toLowerCase()}</p>
                    </div>
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 self-start"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-teal-600" />
                      {/* Display city if available */}
                      {volunteer.eventsByCity && Object.keys(volunteer.eventsByCity).length > 0
                        ? Object.keys(volunteer.eventsByCity)[0]
                        : "No location yet"}
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="mr-1 h-4 w-4 text-teal-600" />
                      Joined {formatJoinDate(volunteer.joinDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-teal-600" />
                      {volunteer.totalHours || 0} Total Hours
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
              {volunteer.aboutMe ? (
                <p className="text-gray-600 leading-relaxed">{volunteer.aboutMe}</p>
              ) : (
                <p className="text-gray-500 italic">
                  No information provided yet. Click "Edit Profile" to add your bio.
                </p>
              )}
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Skills & Interests</h3>
                {volunteer.preferredCategories && volunteer.preferredCategories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {volunteer.preferredCategories.map((skill, index) => (
                      <Badge key={index} className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No skills or interests listed yet. Click "Edit Profile" to add them.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Volunteer History */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Volunteer History</CardTitle>
            </CardHeader>
            <CardContent>
              {volunteer.history && volunteer.history.length > 0 ? (
                <div className="space-y-4">
                  {volunteer.history.map((entry, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-gray-800">
                        {entry.opportunityId.org_name} - {entry.opportunityId.type_of_work}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {entry.opportunityId.location} • {format(new Date(entry.date), "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{entry.opportunityId.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <Award className="h-12 w-12 text-teal-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700">No volunteer history yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    When you participate in volunteer opportunities, they'll be listed here.
                  </p>
                  <Button 
                    className="mt-4 bg-teal-600 hover:bg-teal-700"
                    onClick={() => navigate('/opportunities')}
                  >
                    Find Opportunities
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Opportunities */}
          {opportunities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended for You</h2>
              <div className="space-y-6">
                {opportunities.map(opp => {
                  // Create tags for the volunteer card
                  const tags = [
                    { id: 1, name: opp.category, color: "#60a5fa" },
                    { id: 2, name: opp.type_of_work, color: "#34d399" }
                  ];
                  
                  if (opp.urgency === "high") {
                    tags.push({ id: 3, name: "High Urgency", color: "#f87171" });
                  }
                  
                  return (
                    <VolunteerCard
                      key={opp._id}
                      id={opp._id}
                      title={opp.type_of_work}
                      city={opp.location}
                      date={opp.createdAt ? format(new Date(opp.createdAt), "MMMM d, yyyy") : "Flexible"}
                      tags={tags}
                      imageUrl={opp.image}
                      description={opp.description}
                      organization={opp.org_name}
                      onLearnMore={handleLearnMore}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        volunteer={volunteer}
        onSave={() => {
          // Refresh the volunteer data
          if (user?.email) {
            api.volunteers.getProfileByEmail(user.email)
              .then(data => setVolunteer(data))
              .catch(err => console.error("Failed to refresh profile:", err));
          }
        }}
      />
    </>
  )
}
