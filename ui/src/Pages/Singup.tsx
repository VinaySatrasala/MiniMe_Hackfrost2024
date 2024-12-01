import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required!");
      return;
    }

    const payload = { firstName, lastName, email, password };
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to sign up"}`);
        return;
      }

      const result = await response.json();
      alert("Sign up successful!");
      console.log("Response:", result);
      localStorage.setItem("token",result.token)
      navigate("/credentials")

      // Clear the form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Right Section: Quote/Description */}
      <div className="hidden md:flex flex-1 items-center justify-center p-4 bg-transparent">
        <div className="max-w-md text-center bg-gradient-to-b from-white via-white/80 to-transparent p-6 rounded-lg shadow-lg">
          <h3 className="text-5xl font-bold mb-4 text-black">Welcome to MiniMe</h3>
          <p className="text-2xl text-white-500">
            "Your all-in-one platform for creating and managing impactful social media content with ease."
          </p>
        </div>
      </div>

      {/* Left Section: Sign-Up Form */}
      <div className="flex flex-1 justify-center items-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="johndoe@example.com"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
                id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="********"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-lg transition ${
              loading ? "bg-gray-500" : "bg-white text-black hover:bg-gray-300"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
