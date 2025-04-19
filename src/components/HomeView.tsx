import SearchBar from "../components/SearchBar"

export default function HomeView() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Find Volunteer Opportunities
          </h1>
          <SearchBar />
        </div>
      </div>
    </section>
  )
}
