"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/TextArea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/Form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AlertCircle, Calendar, Clock, Info, MapPin, Upload, X } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

// Category definitions with colors
const CATEGORIES = [
  { id: "education", name: "Education", color: "#f59e0b" },
  { id: "community", name: "Community", color: "#60a5fa" },
  { id: "environment", name: "Environment", color: "#10b981" },
  { id: "healthcare", name: "Healthcare", color: "#f87171" },
  { id: "animals", name: "Animals", color: "#a78bfa" },
  { id: "arts", name: "Arts & Culture", color: "#ec4899" },
  { id: "food", name: "Food", color: "#fbbf24" },
  { id: "outdoor", name: "Outdoor", color: "#34d399" },
  { id: "indoor", name: "Indoor", color: "#818cf8" },
]

// Form schema
const formSchema = z.object({
  org_name: z.string().min(2, { message: "Organization name is required" }),
  type_of_work: z.string().min(2, { message: "Type of work is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  urgency: z.string().min(1, { message: "Please select urgency level" }),
  contact_email: z.string().email({ message: "Please enter a valid email address" }),
  contact_phone: z.string().optional(),
  image: z.any().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.string().optional(),
  skills_needed: z.string().optional(),
  volunteers_needed: z.string().optional(),
})

export default function NewOpportunityForm() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [showDateTimeFields, setShowDateTimeFields] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org_name: "",
      type_of_work: "",
      category: "",
      location: "",
      description: "",
      urgency: "medium",
      contact_email: "",
      contact_phone: "",
      date: "",
      time: "",
      duration: "",
      skills_needed: "",
      volunteers_needed: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Image size exceeds 5MB limit")
        return
      }

      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    form.setValue("image", undefined)
    setImagePreview(null)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setFormError(null)
    setFormSuccess(null)

    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Add all form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "image" && value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        }
      })

      // In a real implementation, you would send this to your API
      console.log("Form submitted:", values)

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setFormSuccess("Opportunity created successfully! Redirecting...")

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormError("There was an error creating your opportunity. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {formError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-red-700">{formError}</p>
              </div>
            )}

            {formSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start">
                <div className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0">✓</div>
                <p className="text-green-700">{formSuccess}</p>
              </div>
            )}

            <Card className="border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg p-8">
                <CardTitle className="text-3xl font-bold">Create New Volunteer Opportunity</CardTitle>
                <CardDescription className="text-teal-100 text-lg mt-2">
                  Share your organization's volunteer needs with the community
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-8 px-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="org_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Organization Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your organization's name"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Location (City)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    placeholder="City where volunteers are needed"
                                    className="w-full h-11 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="type_of_work"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Opportunity Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g., 'Beach Cleanup Volunteer'"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Category</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                >
                                  <option value="" disabled>
                                    Select a category
                                  </option>
                                  {CATEGORIES.map((category) => (
                                    <option key={category.id} value={category.id}>
                                      {category.name}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Description</h3>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Opportunity Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the volunteer opportunity, responsibilities, requirements, etc."
                                className="min-h-[150px] w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                
                              />
                            </FormControl>
                            <FormDescription className="text-xs mt-1 text-gray-500">
                              Be specific about what volunteers will be doing and what skills they need.
                            </FormDescription>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="skills_needed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Skills Needed (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="E.g., 'First aid, gardening, teaching'"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="volunteers_needed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Volunteers Needed (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  placeholder="E.g., '5'"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="urgency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Urgency Level</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                >
                                  <option value="low">Low - Ongoing need</option>
                                  <option value="medium">Medium - Needed soon</option>
                                  <option value="high">High - Urgent need</option>
                                </select>
                              </FormControl>
                              <FormDescription className="flex items-center text-xs mt-1 text-gray-500">
                                <Info className="h-3 w-3 mr-1" />
                                High urgency opportunities are highlighted in search results
                              </FormDescription>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Opportunity Image</FormLabel>
                              <FormControl>
                                <div className="mt-1.5">
                                  <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center w-full h-11 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {imagePreview ? "Change Image" : "Upload Image"}
                                  </label>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => {
                                      handleImageChange(e)
                                      onChange(e.target.files?.[0] || null)
                                    }}
                                    {...fieldProps}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-1 text-gray-500">
                                Recommended: 16:9 ratio, max 5MB
                              </FormDescription>
                              {imagePreview && (
                                <div className="mt-2">
                                  <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200 group">
                                    <img
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={clearImage}
                                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                      aria-label="Remove image"
                                    >
                                      <X className="h-4 w-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Date and Time Toggle */}
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="show-date-time"
                          checked={showDateTimeFields}
                          onChange={() => setShowDateTimeFields(!showDateTimeFields)}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label htmlFor="show-date-time" className="text-sm font-medium text-gray-700">
                          This opportunity occurs on a specific date/time
                        </label>
                      </div>

                      {/* Date and Time Fields (Conditional) */}
                      {showDateTimeFields && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="date"
                                      className="w-full h-11 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                      
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Start Time</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      type="time"
                                      className="w-full h-11 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                      
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Duration (hours)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0.5"
                                    step="0.5"
                                    placeholder="2.5"
                                    className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    
                                  />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Contact Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="contact@organization.org"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Contact Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(123) 456-7890"
                                  className="w-full h-11 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  
                                />
                              </FormControl>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <CardFooter className="px-0 pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/opportunities")}
                        className="w-full sm:w-auto h-12 px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto h-12 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium shadow-md hover:shadow-lg transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-5 w-5 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                            Creating...
                          </>
                        ) : (
                          "Create Opportunity"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
