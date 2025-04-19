export default function AboutUs() {
    return (
      <section id="about" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            {/* About Text Block */}
            <div className="space-y-4 flex flex-col items-center text-center justify-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Us</h2>
              <p className="text-muted-foreground md:text-xl">
                VolunteerHub connects passionate individuals with meaningful volunteer opportunities. Our mission is to
                strengthen communities by making volunteering accessible to everyone.
              </p>
              <p className="text-muted-foreground md:text-xl">
                Founded in 2023, we've helped thousands of volunteers find their perfect match with organizations that
                need their skills and time.
              </p>
            </div>
  
            {/* About Image */}
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
                <img
                  src="https://placecats.com/300/200"
                  alt="Volunteers working together"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
  
          {/* Info Cards */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {/* Volunteer Card */}
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 max-w-sm">
              <div className="rounded-full bg-green-100 p-3">
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
                  className="h-6 w-6 text-green-600"
                >
                  <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <circle cx="12" cy="10" r="2" />
                  <line x1="8" x2="8" y1="2" y2="4" />
                  <line x1="16" x2="16" y1="2" y2="4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">For Volunteers</h3>
              <p className="text-center text-muted-foreground mx-auto">
                Find opportunities that match your skills, interests, and availability.
              </p>
            </div>
  
            {/* Organization Card */}
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 max-w-sm">
              <div className="rounded-full bg-green-100 p-3">
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
                  className="h-6 w-6 text-green-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">For Organizations</h3>
              <p className="text-center text-muted-foreground mx-auto">
                Post opportunities and connect with dedicated volunteers in your community.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }
  