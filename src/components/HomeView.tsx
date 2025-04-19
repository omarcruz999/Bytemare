import { useState } from 'react';
import { Search } from '../components/icons/search.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';

interface SearchProps {
  onSearch: (city: string) => void;
}

export default function HomeView({ onSearch }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      if (searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
        <>
        {/* Hero Section with Search as Main Focus */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Find Volunteer Opportunities
              </h1>
              <div className="w-full max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for volunteer opportunities by city..."
                    className="pl-12 pr-4 py-8 text-lg rounded-full shadow-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 py-6"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
    )
}