import React, { useState, useContext } from "react";
import Logo from "../assets/images/sparklogo-removebg.png";
import VSImage from "../assets/images/VSignupimage.jpg";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const SignUpVolunteer = () => {
  const { signup, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    user_first_name: "",
    user_last_name: "",
    user_email: "",
    user_password: "",
    confirm_password: "",
    user_phone_number: "",
    user_address: "",
    terms: false,
    user_role: 'volunteer',
  });

  const [errors, setErrors] = useState({});

  // ✅ Validation function
  const validate = () => {
    let newErrors = {};

    if (!formData.user_first_name.trim()) {
      newErrors.user_first_name = "First name is required";
    }

    if (!formData.user_last_name.trim()) {
      newErrors.user_last_name = "Last name is required";
    }

    if (!formData.user_email) {
      newErrors.user_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      newErrors.user_email = "Email format is invalid";
    }

    if (!formData.user_password) {
      newErrors.user_password = "Password is required";
    } else if (formData.user_password.length < 8) {
      newErrors.user_password = "Password must be at least 8 characters";
    }

    if (formData.confirm_password !== formData.user_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (!formData.user_phone_number) {
      newErrors.user_phone_number = "Phone number is required";
    } else if (!/^(?:0\d{9}|\+94\d{9})$/.test(formData.user_phone_number)) {
      newErrors.user_phone_number =
        "Enter a valid phone number (e.g. 0771234567 or +94771234567)";
    }

    if (!formData.user_address.trim()) {
      newErrors.user_address = "Address is required";
    }

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup(formData);
      Swal.fire({
        title: "Success",
        text: "Volunteer signed up successfully!",
        icon: "success",
        confirmButtonColor: "#2563EB" // blue-600
      });
    } catch (err) {
      console.log(err);
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center mb-20 px-4 max-sm:px-6">
      <div className="flex items-stretch justify-between gap-4">
        {/* Left side image */}
        <div className="relative w-96 max-md:hidden">
          <img
            src={VSImage}
            alt="Volunteer"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-10 mb-[110px]">
            <h1 className="text-white text-xl font-bold text-center px-2">
              “Find Your Next Volunteering Opportunity.”
            </h1>
            <p className="text-white text-lg font-bold text-center px-6">
              "Browse events, join causes you care about, and make a real
              difference in your community."
            </p>
          </div>
        </div>

        {/* Signup form */}
        <div className="flex flex-col items-center justify-center gap-4 w-96 max-sm:w-[330px] mx-auto p-6 border-2 border-blue-600 bg-white shadow-lg rounded-xl">
          <img src={Logo} alt="Logo" className="w-42 h-28" />
          <h1 className="text-2xl font-medium max-sm:text-center">
            Join As a Volunteer
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            {/* First Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="user_first_name"
                value={formData.user_first_name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="Enter your first name"
              />
              {errors.user_first_name && (
                <p className="text-red-500 text-sm">{errors.user_first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="user_last_name"
                value={formData.user_last_name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="Enter your last name"
              />
              {errors.user_last_name && (
                <p className="text-red-500 text-sm">{errors.user_last_name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="you@example.com"
              />
              {errors.user_email && (
                <p className="text-red-500 text-sm">{errors.user_email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="Create a password"
              />
              {errors.user_password && (
                <p className="text-red-500 text-sm">{errors.user_password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="Re-enter your password"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="user_phone_number"
                value={formData.user_phone_number}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="e.g., +94 771234567"
              />
              {errors.user_phone_number && (
                <p className="text-red-500 text-sm">
                  {errors.user_phone_number}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="user_address"
                value={formData.user_address}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                placeholder="Street, City, ZIP"
              />
              {errors.user_address && (
                <p className="text-red-500 text-sm">{errors.user_address}</p>
              )}
            </div>

            {/* Terms */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              />
              <label className="ml-2 text-sm">
                I agree to the Terms & Conditions
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Sign Up
            </button>
            {error && <p className="text-red-500">{error}</p>}

            {/* Login link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 font-medium hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpVolunteer;
