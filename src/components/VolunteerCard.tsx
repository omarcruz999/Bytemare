"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/Button.tsx"

type Tag = {
  id: string | number
  name: string
  color?: string
  textColor?: string
}

interface VolunteerCardProps {
  id: string | number
  title: string
  city: string
  date: string
  tags: Tag[]
  imageUrl: string
  description: string
  organization: string
  urgency?: string
  onLearnMore: (id: string | number) => void
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  id,
  title,
  city,
  date,
  tags,
  imageUrl,
  description,
  organization,
  urgency,
  onLearnMore,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLearnMore = () => {
    onLearnMore(id)
  }

  const getUrgencyColor = () => {
    if (!urgency) return ""
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md mb-6 bg-white transition-transform duration-200 ${
        isHovered ? "transform -translate-y-1 shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex flex-col ${isDesktop ? "md:flex-row" : ""}`}>
        {/* Image */}
        <div className={`w-full ${isDesktop ? "md:w-1/3" : "h-52"} overflow-hidden`}>
          <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title + Organization */}
          <div className="mb-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{organization}</p>
              </div>

              {urgency && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor()}`}>
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)} Urgency
                </span>
              )}
            </div>
          </div>

          {/* Location + Date */}
          <div className="flex flex-col gap-2 text-sm text-slate-500 mb-3">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <LocationIcon />
                {city}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon />
                {date}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: tag.color || "#e2e8f0", color: tag.textColor || "#ffffff" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 mb-4 flex-grow line-clamp-3">{description}</p>

          {/* Learn More Button */}
          <div className="mt-auto text-right">
            <Button onClick={handleLearnMore}>Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icon components
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)
