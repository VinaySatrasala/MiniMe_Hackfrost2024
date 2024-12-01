import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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

    const { email, password } = formData;
    let formErrors = { email: "", password: "" };

    // Basic validation
    if (!email) {
      formErrors.email = "Email is required!";
    }
    if (!password) {
      formErrors.password = "Password is required!";
    }

    if (formErrors.email || formErrors.password) {
      setErrors(formErrors);
      return; // Stop form submission if there are validation errors
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({
          email: errorData.message || "Failed to sign in",
          password: "",
        });
        return;
      }

      const result = await response.json();
      console.log("Sign-in successful:", result);
      // Redirect or handle success as needed
      localStorage.setItem("token",result.token)
      navigate("/generate")
    } catch (error) {
      console.error("Error during sign in:", error);
      setErrors({
        email: "An unexpected error occurred. Please try again later.",
        password: "",
      });
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
          <p className="text-2xl text-black-100">
            "Your all-in-one platform for creating and managing impactful social media content with ease."
          </p>
        </div>
      </div>

      {/* Left Section: Sign-In Form */}
      <div className="flex flex-1 justify-center items-center p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-gray-900 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-6">Sign In</h2>

          {/* Email Address */}
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
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
