"use client"

import { useNavigate } from "react-router-dom"
import { Search } from "./icons/search"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

export default function SearchBar() {
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/opportunities") // replace this with real search logic later
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for volunteer opportunities, organizations..."
          className="pl-12 pr-4 py-8 text-lg rounded-full shadow-lg"
        />
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-6"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
