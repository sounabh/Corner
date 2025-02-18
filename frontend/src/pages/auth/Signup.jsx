/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "./components/authLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useToast } from "@/hooks/use-toast"; // Importing the custom toast hook

export default function Signup() {
  // Initialize form data, error state, and loading state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(""); // State to store any form errors
  const [isLoading, setIsLoading] = useState(false); // Loading state for button text

  let navigate = useNavigate(); // For navigation after successful signup
  let location = useLocation(); // To track the previous location for redirect after signup
  const { toast } = useToast(); // Access the toast function for notifications

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    setFormError(""); // Clear any previous errors

    // Client-side validation to ensure all fields are filled
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("All fields are required."); // Set form error message
      return; // Stop execution if validation fails
    }

    setIsLoading(true); // Set loading state to true while submitting the form

    try {
      // Send POST request to backend API with form data
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_BASE_URL}/auth/signup`,
        formData
      );

      console.log("====================================");
      console.log(response);
      console.log("====================================");

      // Show a success toast with the verification token
      toast({
        title: "Your Verification Code,Kindly move to verify route 🐋",
        description: `${response.data.user.verificationToken}`,
      });

      // Optionally, navigate to the verification page after successful signup
       //navigate("/verify", { state: { from: location } });

    } catch (error) {
      // Handle any API errors and show an error message
      setFormError("An error occurred. Please try again."); // Set form error message
      toast.error("An error occurred. Please try again."); // Show error toast
    } finally {
      setIsLoading(false); // Set loading state back to false after request completion
    }
  };

  // Updates form data state on input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value })); // Dynamically update formData
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey with us today"
    >
      {/* Form with Framer Motion for animations */}
      <motion.form
        onSubmit={handleSubmit} // Trigger handleSubmit on form submission
        className="space-y-4"
        initial={{ opacity: 0 }} // Initial opacity for animation
        animate={{ opacity: 1 }} // Animate to full opacity
        transition={{ delay: 0.3 }} // Delay the animation slightly
      >
        {/* Error Display */}
        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        {/* Full Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#1D4ED8] hover:bg-blue-700 transition-colors"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Creating account..." : "Create Account"} {/* Button text based on loading state */}
        </Button>

        {/* Sign-in Link */}
        <p className="text-center text-gray-400 text-sm">
          Remember Your Code?{" "}
          <NavLink to="/verify" className="text-[#1D4ED8] hover:underline">
            Verify
          </NavLink>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
