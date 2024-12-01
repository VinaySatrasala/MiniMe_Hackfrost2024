import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token is present in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // Remove token and redirect to home
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };

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
          {isAuthenticated ? (
            <>
              <a href="/credentials" className="text-lg hover:text-gray-300">
                Credentials
              </a>
              <a href="/generate" className="text-lg hover:text-gray-300">
                Generate
              </a>
              <button
                onClick={handleLogout}
                className="text-lg hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/Signin" className="text-lg hover:text-gray-300">
                Signin
              </a>
              <a href="/Signup" className="text-lg hover:text-gray-300">
                Signup
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
