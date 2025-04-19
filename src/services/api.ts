// API service for interacting with the backend
const API_URL = import.meta.env.VITE_API_URL
export const API_BASE_URL = API_URL

// Helper to get auth header with JWT token
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Opportunity {
  _id: string
  org_name: string
  category: string
  location: string
  type_of_work: string
  urgency: string
  description: string
  image: string
  createdAt?: string
  updatedAt?: string
}

export interface Volunteer {
  _id: string
  name: string
  phone: number
  email: string
  volunteering: Record<string, number>
  history: Array<{
    opportunityId: {
      _id: string
      org_name: string
      category: string
      location: string
      type_of_work: string
      description: string
      image: string
    }
    date: string
  }>
  aboutMe: string
  preferredCategories: string[]
  profileImage: string
}

export interface Organization {
  _id: string
  org_name: string
  phone: number
  email: string
  description: string
  opportunities: Array<Opportunity> | Array<string>
  logoImage: string
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'volunteer' | 'organization';
  profileImage?: string;
}

// Mock data for development
const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    _id: "1",
    org_name: "Green Earth Initiative",
    category: "Environment",
    location: "San Francisco",
    type_of_work: "Park Cleanup",
    urgency: "Medium",
    description:
      "Join us for our monthly park cleanup event! We'll be removing trash and invasive species from Golden Gate Park. All equipment provided. Great for families and individuals of all ages.",
    image:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-15T12:00:00Z",
  },
  {
    _id: "2",
    org_name: "City Food Bank",
    category: "Food",
    location: "San Francisco",
    type_of_work: "Food Distribution",
    urgency: "High",
    description:
      "Help us distribute food packages to families in need. We're experiencing high demand and need volunteers to help sort donations and prepare packages for distribution.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-20T14:30:00Z",
  },
  {
    _id: "3",
    org_name: "Literacy Partners",
    category: "Education",
    location: "San Francisco",
    type_of_work: "Reading Tutor",
    urgency: "Medium",
    description:
      "Become a reading tutor for elementary school students. Help children improve their reading skills and develop a love for books. Training provided.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-18T09:15:00Z",
  },
  {
    _id: "4",
    org_name: "Animal Rescue League",
    category: "Animals",
    location: "San Francisco",
    type_of_work: "Dog Walker",
    urgency: "Low",
    description:
      "Help exercise our shelter dogs by taking them for walks. This is a great opportunity for animal lovers to make a difference in the lives of shelter animals waiting for their forever homes.",
    image:
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-10T16:45:00Z",
  },
  {
    _id: "5",
    org_name: "Community Health Clinic",
    category: "Healthcare",
    location: "San Francisco",
    type_of_work: "Front Desk Assistant",
    urgency: "High",
    description:
      "Assist with check-ins, paperwork, and general administrative tasks at our community health clinic. Help us provide accessible healthcare to underserved populations.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-22T10:00:00Z",
  },
  {
    _id: "6",
    org_name: "Senior Connections",
    category: "Community",
    location: "San Francisco",
    type_of_work: "Companion Visitor",
    urgency: "Medium",
    description:
      "Visit seniors in their homes to provide companionship and assistance with light tasks. Help combat isolation and make a meaningful connection with an elderly community member.",
    image:
      "https://images.unsplash.com/photo-1516307365426-bea591f05011?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-16T13:20:00Z",
  },
  {
    _id: "7",
    org_name: "Arts for All",
    category: "Arts",
    location: "San Francisco",
    type_of_work: "Gallery Assistant",
    urgency: "Low",
    description:
      "Help at our community art gallery by greeting visitors, providing information about exhibits, and assisting with special events. Perfect for art enthusiasts!",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-12T11:30:00Z",
  },
  {
    _id: "8",
    org_name: "Neighborhood Cleanup Crew",
    category: "Community",
    location: "San Francisco",
    type_of_work: "Street Cleanup",
    urgency: "Medium",
    description:
      "Join our weekly neighborhood cleanup efforts. We target different areas of the city each week to remove litter and improve our community spaces.",
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    createdAt: "2023-04-19T15:00:00Z",
  },
]

const api = {
  baseUrl: API_URL,
  
  // Auth endpoints
  auth: {
    // Login
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }
        
        return response.json();
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    // Register
    register: async (userData: any): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }
        
        return response.json();
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    // Register Organization
    registerOrganization: async (orgData: any): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/register/organization`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orgData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Organization registration failed');
        }
        
        return response.json();
      } catch (error) {
        console.error('Organization registration error:', error);
        throw error;
      }
    },
    
    // Get current logged-in user
    getCurrentUser: async (): Promise<User> => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            ...getAuthHeader(),
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to get user data');
        }
        
        return response.json();
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    },
    
    // Handle Google OAuth callback
    handleGoogleCallback: async (code: string): Promise<{ user: User; token: string }> => {
      try {
        const response = await fetch(`${API_URL}/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Google authentication failed');
        }
        
        const data = await response.json();
        
        // Save token to localStorage
        localStorage.setItem('authToken', data.token);
        
        return data;
      } catch (error) {
        console.error('Google callback error:', error);
        throw error;
      }
    },
  },

  // Opportunities
  opportunities: {
    getAll: async (): Promise<Opportunity[]> => {
      try {
        const response = await fetch(`${API_URL}/opportunities`)
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities")
        }
        return response.json()
      } catch (error) {
        console.warn("Using mock data due to API error:", error)
        return MOCK_OPPORTUNITIES
      }
    },

    getByCity: async (city: string): Promise<Opportunity[]> => {
      try {
        const response = await fetch(`${API_URL}/opportunities/location/${city}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch opportunities in ${city}`)
        }
        return response.json()
      } catch (error) {
        console.warn("Using mock data due to API error:", error)
        // Filter mock data by city for development
        return MOCK_OPPORTUNITIES.filter((opp) => opp.location.toLowerCase() === city.toLowerCase())
      }
    },

    getUrgent: async (): Promise<Opportunity[]> => {
      try {
        const response = await fetch(`${API_URL}/opportunities/urgent`)
        if (!response.ok) {
          throw new Error("Failed to fetch urgent opportunities")
        }
        return response.json()
      } catch (error) {
        console.warn("Using mock data due to API error:", error)
        // Filter mock data for urgent opportunities
        return MOCK_OPPORTUNITIES.filter((opp) => opp.urgency.toLowerCase() === "high")
      }
    },

    getById: async (id: string): Promise<Opportunity> => {
      try {
        const response = await fetch(`${API_URL}/opportunities/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch opportunity with ID ${id}`)
        }
        return response.json()
      } catch (error) {
        console.warn("Using mock data due to API error:", error)
        const opportunity = MOCK_OPPORTUNITIES.find((opp) => opp._id === id)
        if (!opportunity) {
          throw new Error(`Opportunity with ID ${id} not found`)
        }
        return opportunity
      }
    },

    create: async (data: {
      org_name: string
      category: string
      location: string
      type_of_work: string
      urgency: string
      description: string
      image?: string
    }): Promise<Opportunity> => {
      try {
        const response = await fetch(`${API_URL}/opportunities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          throw new Error("Failed to create opportunity")
        }
        return response.json()
      } catch (error) {
        console.error("Error creating opportunity:", error)
        throw error
      }
    },
  },

  // Volunteers
  volunteers: {
    getProfile: async (id: string): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers/profile/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch volunteer profile with ID ${id}`)
      }
      return response.json()
    },

    updateProfile: async (
      id: string,
      data: {
        aboutMe?: string
        preferredCategories?: string[]
        profileImage?: string
        name?: string
      },
    ): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers/${id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to update volunteer profile with ID ${id}`)
      }
      return response.json()
    },

    create: async (data: {
      name: string
      email: string
      phone: number
      aboutMe?: string
      preferredCategories?: string[]
      profileImage?: string
    }): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to create volunteer profile")
      }
      return response.json()
    },

    getLeaderboard: async (city: string): Promise<{ _id: string; name: string; eventsCount: number; profileImage?: string }[]> => {
      try {
        const response = await fetch(`${API_URL}/volunteers/leaderboard/${city}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard for ${city}`)
        }
        return response.json()
      } catch (error) {
        console.warn("Generating leaderboard from volunteer data due to API error:", error)
        
        // Fetch all volunteers from the database
        try {
          // Get all volunteers
          const allVolunteers = await api.volunteers.getAll();
          
          // Filter and map volunteers who have worked in this city
          const cityVolunteers = allVolunteers
            .filter(volunteer => volunteer.volunteering && volunteer.volunteering[city])
            .map(volunteer => ({
              _id: volunteer._id,
              name: volunteer.name,
              eventsCount: volunteer.volunteering[city] || 0,
              profileImage: volunteer.profileImage
            }))
            .sort((a, b) => b.eventsCount - a.eventsCount); // Sort by number of events (descending)
            
          return cityVolunteers;
        } catch (err) {
          console.error("Failed to generate leaderboard:", err);
          return [];
        }
      }
    },

    getAll: async (): Promise<Volunteer[]> => {
      try {
        const response = await fetch(`${API_URL}/volunteers`)
        if (!response.ok) {
          throw new Error("Failed to fetch volunteers")
        }
        return response.json()
      } catch (error) {
        console.error("Failed to fetch volunteers:", error)
        return [] // Return empty array instead of mock data
      }
    },

    // Get volunteer profile by email
    getProfileByEmail: async (email: string) => {
      try {
        const response = await fetch(`${API_URL}/volunteers/by-email/${email}`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch volunteer profile for email ${email}`);
        }
        
        return response.json();
      } catch (error) {
        console.error("Error getting volunteer profile by email:", error);
        throw error;
      }
    },
  },

  // Organizations
  organizations: {
    getAll: async (): Promise<Organization[]> => {
      const response = await fetch(`${API_URL}/organizations`)
      if (!response.ok) {
        throw new Error("Failed to fetch organizations")
      }
      return response.json()
    },

    getById: async (id: string): Promise<Organization> => {
      const response = await fetch(`${API_URL}/organizations/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch organization with ID ${id}`)
      }
      return response.json()
    },

    create: async (data: {
      org_name: string
      email: string
      phone: number
      description: string
      logoImage?: string
    }): Promise<Organization> => {
      const response = await fetch(`${API_URL}/organizations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to create organization")
      }
      return response.json()
    },

    addOpportunity: async (orgId: string, opportunityId: string): Promise<Organization> => {
      const response = await fetch(`${API_URL}/organizations/${orgId}/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ opportunityId }),
      })
      if (!response.ok) {
        throw new Error(`Failed to add opportunity to organization`)
      }
      return response.json()
    },
  },
}

export default api