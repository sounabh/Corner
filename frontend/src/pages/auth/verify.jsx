/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "./components/authLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Initialize code state
  const inputs = useRef([]); // To manage focus of input fields
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  const [formError, setFormError] = useState(""); // To manage error state
  const navigate = useNavigate(); // For navigation

  // Handle input change for each digit
  const handleChange = (index, value) => {
    if (value.length > 1) return; // Ensure only one digit per input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus(); // Focus on next input if a digit is entered
    }
  };

  // Handle backspace behavior
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus(); // Move focus to previous input if backspace is pressed
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(""); // Clear any previous error messages

    // Validate code input
    if (code.some((digit) => !digit)) {
      setFormError("Please enter the complete verification code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND_BASE_URL}/auth/verify-email`,
        { code: code.join("") }
      );

      console.log(response); // Handle response as needed (e.g., navigate to dashboard)
       navigate("/login"); // Uncomment to navigate after successful verification
    } catch (error) {
      setFormError(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false); // Disable loading state after request completes
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code sent to your email">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Input
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputs.current[index] = el)} // Focus management
                className="w-12 h-12 text-center text-xl bg-gray-800 border-gray-700 text-white"
              />
            </motion.div>
          ))}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#1D4ED8] hover:bg-blue-700 transition-colors"
          disabled={isLoading || code.some((digit) => !digit)} // Disable if loading or not all fields are filled
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        <p className="text-center text-gray-400 text-sm">
          Verified?{" "}
          <NavLink to="/login" className="text-[#1D4ED8] hover:underline">
            Login
          </NavLink>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
