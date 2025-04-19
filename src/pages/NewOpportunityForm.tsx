"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/TextArea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/Form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Info, Upload } from "lucide-react"
import Navbar from "../components/Navbar"

// Category definitions with colors (same as in OpportunitiesPage)
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
})

export default function NewOpportunityForm() {
  const router = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Here you would normally send the data to your API
      console.log("Form submitted:", values)

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to opportunities page after successful submission
      router("/opportunities")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your opportunity. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col">

        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl">Create New Volunteer Opportunity</CardTitle>
                  <CardDescription className="text-teal-100">
                    Share your organization's volunteer needs with the community
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="org_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your organization's name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (City)</FormLabel>
                              <FormControl>
                                <Input placeholder="City where volunteers are needed" {...field} />
                              </FormControl>
                              <FormMessage />
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
                              <FormLabel>Opportunity Title</FormLabel>
                              <FormControl>
                                <Input placeholder="E.g., 'Beach Cleanup Volunteer'" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the volunteer opportunity, responsibilities, requirements, etc."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="urgency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Urgency Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select urgency level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="flex items-center text-xs">
                                <Info className="h-3 w-3 mr-1" />
                                High urgency opportunities are highlighted
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Opportunity Image</FormLabel>
                              <FormControl>
                                <div className="mt-1.5">
                                  <label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center w-full h-[42px] px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {imagePreview ? "Change Image" : "Upload Image"}
                                  </label>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs mt-1">Recommended: 16:9 ratio, max 5MB</FormDescription>
                              {imagePreview && (
                                <div className="mt-2">
                                  <div className="relative w-full h-32 rounded-md overflow-hidden">
                                    <img
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="contact@organization.org" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contact_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <CardFooter className="px-0 pt-4 flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router("/opportunities")}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                              Submitting...
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

        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} VolunteerHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
