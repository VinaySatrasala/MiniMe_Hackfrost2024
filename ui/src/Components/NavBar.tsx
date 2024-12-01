export default function Navbar() {
    return (
      <nav className="fixed top-0 left-0 w-full bg-black text-white py-4 shadow-lg z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <a href="/" className="text-white hover:text-gray-300">
              Mini Me
            </a>
          </div>
          <div className="space-x-8">
            <a href="/" className="text-lg hover:text-gray-300">
              Home
            </a>
            <a href="/Signup" className="text-lg hover:text-gray-300">
              Signin
            </a>
            <a href="/Signin" className="text-lg hover:text-gray-300">
              Signup
            </a>
          </div>
        </div>
      </nav>
    )
  }
  