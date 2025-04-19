export default function Footer() {
    return (
      <footer className="w-full py-4 px-6 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} VolunteerHub. All rights reserved.</p>
        </div>
      </footer>
    )
  }
  