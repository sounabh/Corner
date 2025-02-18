/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthLayout } from "./components/authLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast"; // Import react-hot-toast for displaying notifications

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" }); // Form state
  const [isLoading, setIsLoading] = useState(false); // Loading state to handle button text change
  const [error, setError] = useState(""); // Error state to handle error messages

  const setAuth = useAuthStore((state) => state.setAuth); // Use auth store to set token and userId
  const location = useLocation(); // To track the previous location for redirect after login
  const navigate = useNavigate(); // Navigation hook to navigate after login

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the specific field
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setError(""); // Clear previous errors
    setIsLoading(true); // Set loading state to true

    try {
      // Send POST request to backend API with form data
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_BASE_URL}/auth/login`,
        formData
      );

      // Set the user authentication details to the global state
      setAuth(response.data.user.token, response.data.user);

      // Display success toast
      toast.success("Login successful!");

      // Redirect the user to the homepage or previous location
      navigate("/", { state: { from: location } });
    } catch (err) {
      // Handle error and display appropriate toast
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage); // Set error state for rendering error message
      toast.error(errorMessage); // Display error toast notification
    } finally {
      // Set loading state to false after the request completes
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <motion.form
        onSubmit={handleSubmit} // Handle form submission
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email} // Bind to formData state
            onChange={handleChange} // Update state on change
            placeholder="you@example.com"
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password} // Bind to formData state
            onChange={handleChange} // Update state on change
            required
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Display error message if exists */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-[#1D4ED8] hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}{" "}
          {/* Change button text during loading */}
        </Button>

        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <NavLink to="/signup" className="text-[#1D4ED8] hover:underline">
            Sign up
          </NavLink>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
