import React, { useState } from 'react'
import Limage from '../assets/images/Loginimage.jpg'
import Logo from '../assets/images/sparklogo-removebg.png'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      console.log('Form Submitted:', formData)
      // TODO: API call for login
    }
  }

  return (
    <div className="flex item-center justify-center mb-20 max-sm:px-6 mt-48">
      <div className="flex items-stretch justify-between gap-4">
        {/* Left Side Image */}
        <div className="relative w-96 max-md:hidden">
          <img src={Limage} alt="" className="w-full h-full object-cover rounded-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-start gap-10 mt-10">
            <h1 className="text-white text-xl font-bold text-center px-2">
              “Good to See You Again!”
            </h1>
            <p className="text-white text-lg font-bold text-center px-6">
              "Pick up where you left off join new events, track your contributions, and keep
              sparking impact."
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col items-center justify-center gap-4 w-96 max-sm:w-[330px] mx-auto p-2 py-6 border-2 border-yellow-500 bg-white shadow-md rounded-lg">
          <img src={Logo} alt="" className="w-42 h-28" />
          <h1 className="text-2xl font-medium max-sm:text-center">Welcome Back to Spark</h1>

          <form className="flex flex-col w-72" onSubmit={handleSubmit}>
            {/* Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-1 p-2 border rounded-lg focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-60 mx-auto bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-600 transition"
            >
              Login
            </button>

            <div className="text-center mt-4">
              <a href="/forgot-password" className="text-yellow-500 font-medium hover:underline">
                Forget Password ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
