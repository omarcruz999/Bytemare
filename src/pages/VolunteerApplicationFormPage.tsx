"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Button } from "../components/ui/Button"
import api, { type Opportunity } from "../services/api"

export default function VolunteerApplicationFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    availability: {
      weekdays: false,
      weekends: false,
      mornings: false,
      afternoons: false,
      evenings: false,
    },
    startDate: "",
    experience: "",
    motivation: "",
    specialNeeds: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const opportunityData = await api.opportunities.getById(id)
        setOpportunity(opportunityData)
        document.title = `Apply: ${opportunityData.type_of_work} | VolunteerHub`
      } catch (err) {
        console.error("Failed to fetch opportunity details:", err)
        setError("Failed to load opportunity details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunityDetails()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    if (name === "agreeToTerms") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      // Handle availability checkboxes
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [name]: checked,
        },
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions to continue.")
      return
    }

    setSubmitting(true)

    try {
      // In a real application, you would send this data to your backend
      // await api.applications.submit(id, formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitSuccess(true)

      // Scroll to top to show success message
      window.scrollTo(0, 0)

      // In a real app, you might redirect after a delay
      setTimeout(() => {
        navigate(`/opportunity/${id}`)
      }, 5000)
    } catch (err) {
      console.error("Failed to submit application:", err)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1) // Go back to previous page
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-teal-700">Loading opportunity details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !opportunity) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error || "Opportunity not found"}</p>
            <Button onClick={handleGoBack}>Go Back</Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-teal-700 hover:text-teal-900 mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to opportunity
          </button>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Application Submitted Successfully!</h2>
              <p className="text-green-700 mb-6">
                Thank you for applying to volunteer for "{opportunity.type_of_work}" with {opportunity.org_name}. They
                will review your application and contact you soon.
              </p>
              <p className="text-green-600 text-sm">
                You will be redirected back to the opportunity page in a few seconds...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 bg-teal-600 text-white">
                <h1 className="text-2xl font-bold">Volunteer Application</h1>
                <p className="mt-2">
                  {opportunity.type_of_work} with {opportunity.org_name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Personal Information */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        ZIP Code
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </section>

                {/* Availability */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Availability</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        When are you available to volunteer? (Select all that apply)
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="weekdays"
                            checked={formData.availability.weekdays}
                            onChange={handleCheckboxChange}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Weekdays</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="weekends"
                            checked={formData.availability.weekends}
                            onChange={handleCheckboxChange}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Weekends</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="mornings"
                            checked={formData.availability.mornings}
                            onChange={handleCheckboxChange}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Mornings</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="afternoons"
                            checked={formData.availability.afternoons}
                            onChange={handleCheckboxChange}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Afternoons</span>
                        </label>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="evenings"
                            checked={formData.availability.evenings}
                            onChange={handleCheckboxChange}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span>Evenings</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        When can you start? <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </section>

                {/* Experience & Motivation */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Experience & Motivation</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Do you have any relevant experience or skills for this opportunity?
                      </label>
                      <textarea
                        id="experience"
                        name="experience"
                        rows={3}
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Describe any relevant experience or skills you have..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
                        Why are you interested in this volunteer opportunity? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="motivation"
                        name="motivation"
                        rows={4}
                        required
                        value={formData.motivation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Tell us why you want to volunteer for this opportunity..."
                      />
                    </div>
                  </div>
                </section>

                {/* Additional Information */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700">
                        Do you have any special needs or accommodations we should be aware of?
                      </label>
                      <textarea
                        id="specialNeeds"
                        name="specialNeeds"
                        rows={3}
                        value={formData.specialNeeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Please let us know if you require any accommodations..."
                      />
                    </div>
                  </div>
                </section>

                {/* Terms and Conditions */}
                <section>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleCheckboxChange}
                        className="rounded text-teal-600 focus:ring-teal-500 mt-1"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="#" className="text-teal-600 hover:underline">
                          terms and conditions
                        </a>{" "}
                        and understand that my personal information will be processed in accordance with the
                        <a href="#" className="text-teal-600 hover:underline">
                          {" "}
                          privacy policy
                        </a>
                        . I confirm that all information provided is accurate and complete.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </section>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 text-lg bg-teal-600 hover:bg-teal-700"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Application...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
