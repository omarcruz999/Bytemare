// API service for interacting with the backend
const API_URL = import.meta.env.VITE_API_URL

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
      },
    ): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers/${id}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`Failed to update volunteer profile with ID ${id}`)
      }
      return response.json()
    },

    getLeaderboard: async (
      city: string,
    ): Promise<
      Array<{
        _id: string
        name: string
        eventsCount: number
      }>
    > => {
      const response = await fetch(`${API_URL}/volunteers/leaderboard/${city}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard for ${city}`)
      }
      return response.json()
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
  },
}

export default api
