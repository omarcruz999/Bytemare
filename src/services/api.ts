// API service for interacting with the backend
const API_URL = 'http://localhost:5001/api';

export interface Opportunity {
  _id: string;
  org_name: string;
  category: string;
  location: string;
  type_of_work: string;
  urgency: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Volunteer {
  _id: string;
  name: string;
  phone: number;
  email: string;
  volunteering: Record<string, number>;
  history: Array<{
    opportunityId: {
      _id: string;
      org_name: string;
      category: string;
      location: string;
      type_of_work: string;
      description: string;
      image: string;
    };
    date: string;
  }>;
  aboutMe: string;
  preferredCategories: string[];
  profileImage: string;
}

export interface Organization {
  _id: string;
  org_name: string;
  phone: number;
  email: string;
  description: string;
  opportunities: Array<Opportunity> | Array<string>;
  logoImage: string;
}

const api = {
  // Opportunities
  opportunities: {
    getAll: async (): Promise<Opportunity[]> => {
      const response = await fetch(`${API_URL}/opportunities`);
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities');
      }
      return response.json();
    },
    
    getByCity: async (city: string): Promise<Opportunity[]> => {
      const response = await fetch(`${API_URL}/opportunities/location/${city}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities in ${city}`);
      }
      return response.json();
    },
    
    getUrgent: async (): Promise<Opportunity[]> => {
      const response = await fetch(`${API_URL}/opportunities/urgent`);
      if (!response.ok) {
        throw new Error('Failed to fetch urgent opportunities');
      }
      return response.json();
    },
    
    getById: async (id: string): Promise<Opportunity> => {
      const response = await fetch(`${API_URL}/opportunities/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch opportunity with ID ${id}`);
      }
      return response.json();
    }
  },
  
  // Volunteers
  volunteers: {
    getProfile: async (id: string): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers/profile/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch volunteer profile with ID ${id}`);
      }
      return response.json();
    },
    
    updateProfile: async (id: string, data: {
      aboutMe?: string;
      preferredCategories?: string[];
      profileImage?: string;
    }): Promise<Volunteer> => {
      const response = await fetch(`${API_URL}/volunteers/${id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to update volunteer profile with ID ${id}`);
      }
      return response.json();
    },
    
    getLeaderboard: async (city: string): Promise<Array<{
      _id: string;
      name: string;
      eventsCount: number;
    }>> => {
      const response = await fetch(`${API_URL}/volunteers/leaderboard/${city}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard for ${city}`);
      }
      return response.json();
    }
  },
  
  // Organizations
  organizations: {
    getAll: async (): Promise<Organization[]> => {
      const response = await fetch(`${API_URL}/organizations`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      return response.json();
    },
    
    getById: async (id: string): Promise<Organization> => {
      const response = await fetch(`${API_URL}/organizations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch organization with ID ${id}`);
      }
      return response.json();
    }
  }
};

export default api; 