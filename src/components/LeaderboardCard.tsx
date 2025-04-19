"use client"

import { useEffect, useState } from "react"
import { Trophy, Award, Medal } from "lucide-react"
import api from "../services/api"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

interface LeaderboardCardProps {
  city: string
}

interface LeaderboardEntry {
  _id: string
  name: string
  eventsCount: number
  profileImage?: string
}

export default function LeaderboardCard({ city }: LeaderboardCardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!city) return

      setLoading(true)
      setError(null)

      try {
        const data = await api.volunteers.getLeaderboard(city)
        setLeaderboard(data)
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err)
        setError("Could not load leaderboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [city])

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Render rank badge based on position
  const getRankBadge = (position: number) => {
    switch (position) {
      case 0: // 1st place
        return (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1" title="1st Place">
            <Trophy className="h-4 w-4 text-white" />
          </div>
        )
      case 1: // 2nd place
        return (
          <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1" title="2nd Place">
            <Medal className="h-4 w-4 text-white" />
          </div>
        )
      case 2: // 3rd place
        return (
          <div className="absolute -top-1 -right-1 bg-amber-700 rounded-full p-1" title="3rd Place">
            <Award className="h-4 w-4 text-white" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-teal-600 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Top Volunteers in {city}
        </h2>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p>No volunteer data available for this city yet.</p>
            <p className="text-sm mt-2">Be the first to volunteer!</p>
          </div>
        )}

        {!loading && !error && leaderboard.length > 0 && (
          <ul className="space-y-4">
            {leaderboard.map((entry, index) => (
              <li key={entry._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 relative">
                    <Avatar className="h-10 w-10 border-2 border-gray-200">
                      <AvatarImage src={entry.profileImage || "/placeholder.svg"} alt={entry.name} />
                      <AvatarFallback className="bg-teal-100 text-teal-800">{getInitials(entry.name)}</AvatarFallback>
                    </Avatar>
                    {getRankBadge(index)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{entry.name}</p>
                    <p className="text-xs text-gray-500">
                      {entry.eventsCount} {entry.eventsCount === 1 ? "event" : "events"}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-teal-600">#{index + 1}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
