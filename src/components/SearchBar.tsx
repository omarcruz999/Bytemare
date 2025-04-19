import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "./icons/search"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = () => {
    const city = searchQuery.trim()
    if (!city) return
    navigate(`/opportunities?city=${encodeURIComponent(city)}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative mb-12">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for volunteer opportunities by city..."
          className="pl-12 pr-4 py-8 text-lg rounded-full shadow-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-6"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  )
}
