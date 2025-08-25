import React from 'react'
import Logo from '../assets/images/sparklogo-removebg.png'
import OSImage from '../assets/images/OSignupimage.jpg'

const SignUpOrganization = () => {

  return (

    <div className='flex item-center justify-center mb-20 max-sm:px-6  '>

        <div className=' flex items-stretch justify-between gap-4 '>

          <div className='relative w-96 max-md:hidden '>
              <img src={OSImage} alt="" className='  w-full h-full object-cover rounded-lg' />

              <div className='  absolute inset-0 flex flex-col items-center justify-start gap-10 mt-40 '>
                   <h1 className=' text-Black text-xl font-bold text-center px-2'>“Spark Change. Start Today.”</h1>
                    <p className='text-Black  text-lg font-bold text-center px-6'>
                      "Join thousands of volunteers and organizations working together to create a brighter future."</p> 
              </div>

          </div>

            <div className='flex flex-col h- h-full items-center justify-center gap-4 w-96 max-sm:w-[330px] mx-auto p-2 py-6 border-2
             border-yellow-500 bg-white shadow-md rounded-lg'>
                <img src={Logo} alt=""  className='w-42 h-28'></img>
                <h1 className=' text-2xl font-medium max-sm:text-center'>Join As a Organization Admin</h1>

                 <form >

                        {/* First Name */}
                        <div className="mb-4">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            name="firstName"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="mb-4">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            name="lastName"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

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
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            name="password"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            name="confirmPassword"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            placeholder="e.g., +94 771234567"
                            name="phone"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            id="address"
                            type="text"
                            placeholder="Street, City, ZIP"
                            name="address"
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>


                          {/* Checkbox */}
                        <div className="mb-4 flex items-center">
                          <input
                            id="terms"
                            type="checkbox"
                            name="terms"
                            required
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor="terms"
                            className="ml-2 block text-sm font-medium text-gray-700"
                          >
                            I agree to the Terms & Conditions
                          </label>
                        </div>


                        <button
                          type="submit"
                          className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                        >
                          Sign Up
                        </button>


                        <div className="text-center mt-4">
                          <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="/login" className="text-yellow-500 font-medium hover:underline">
                              Login here
                            </a>
                          </p>
                        </div>

                 </form>

     

            </div>

            



        </div>






    </div>
  )
}

export default SignUpOrganization