import { useState } from 'react'
import { Button } from './ui/Button'
import api from '../services/api'

interface ProfileEditFormProps {
  volunteerId: string
  currentData: {
    name: string
    aboutMe: string
    preferredCategories: string[]
    profileImage: string
  }
  onSuccess: () => void
  onCancel: () => void
}

export default function ProfileEditForm({
  volunteerId,
  currentData,
  onSuccess,
  onCancel
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    name: currentData.name || '',
    aboutMe: currentData.aboutMe || '',
    profileImage: currentData.profileImage || '',
    preferredCategories: currentData.preferredCategories.join(', ') || ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Convert categories string back to array
      const preferredCategories = formData.preferredCategories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0)
      
      await api.volunteers.updateProfile(volunteerId, {
        name: formData.name,
        aboutMe: formData.aboutMe,
        profileImage: formData.profileImage,
        preferredCategories
      })
      
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 text-sm text-white bg-red-500 rounded-md">{error}</div>}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="aboutMe" className="text-sm font-medium text-gray-700">
          About Me
        </label>
        <textarea
          id="aboutMe"
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="profileImage" className="text-sm font-medium text-gray-700">
          Profile Image URL
        </label>
        <input
          id="profileImage"
          name="profileImage"
          type="url"
          value={formData.profileImage}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="preferredCategories" className="text-sm font-medium text-gray-700">
          Skills & Interests (comma-separated)
        </label>
        <input
          id="preferredCategories"
          name="preferredCategories"
          type="text"
          value={formData.preferredCategories}
          onChange={handleChange}
          placeholder="Teaching, Event Planning, First Aid"
          className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div className="flex gap-3 justify-end pt-2">
        <Button 
          type="button" 
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
} 