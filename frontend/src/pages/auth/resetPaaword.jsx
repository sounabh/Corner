/* eslint-disable no-unused-vars */


import { useState } from "react";
import { motion } from "framer-motion";
import { AuthLayout } from "./components/authLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "../../store/authStore";

export default function ResetPassword() {
  const { toast } = useToast();
  const token = useAuthStore(state => state.token);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  console.log("f",formData);
  const handleSubmit = async (e) => {
    console.log("f",formData);
    
    e.preventDefault();
    setError("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BACKEND_BASE_URL}/auth/reset-password`, {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      },
      {withCredentials: true,
      headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
      }});
console.log(response);

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your new password below">
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-gray-300">
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            required
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            className="bg-gray-800 border-gray-700 text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full bg-[#1D4ED8] hover:bg-blue-700 transition-colors" disabled={isLoading}>
          {isLoading ? "Resetting password..." : "Reset Password"}
        </Button>
      </motion.form>
    </AuthLayout>
  );
}
