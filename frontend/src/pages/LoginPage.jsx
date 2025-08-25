import React from 'react'
import Limage from '../assets/images/Loginimage.jpg'
import Logo from '../assets/images/sparklogo-removebg.png'

const LoginPage = () => {

  return (

        <div className='flex item-center justify-center mb-20 max-sm:px-6 mt-48  '>
    
            <div className=' flex items-stretch justify-between gap-4 '>
    
              <div className='relative w-96 max-md:hidden '>
                  <img src={Limage} alt="" className='  w-full h-full object-cover rounded-lg' />
    
                  <div className='  absolute inset-0 flex flex-col items-center justify-start gap-10 mt-10 '>
                       <h1 className=' text-white text-xl font-bold text-center px-2'>“Good to See You Again!”</h1>
                        <p className='text-white  text-lg font-bold text-center px-6'>
                          "Pick up where you left off join new events, track your contributions, and keep sparking impact."</p> 
                  </div>
    
              </div>
    
                <div className='flex flex-col h- h-full items-center justify-center gap-4 w-96 max-sm:w-[330px] mx-auto p-2 py-6 border-2
                 border-yellow-500 bg-white shadow-md rounded-lg'>
                    <img src={Logo} alt=""  className='w-42 h-28'></img>
                    <h1 className=' text-2xl font-medium max-sm:text-center'>Welcome Back to Spark</h1>
    
                     <form className="flex flex-col w-72">
    
                            {/* Email Address */}
                            <div className="mb-4 ">
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
    
                            <button
                              type="submit"
                              className=" w-60 mx-auto  bg-yellow-500 text-white py-2 rounded-full hover:bg-yellow-600 transition "
                            >
                              Login
                            </button>
    
    
                            <div className="text-center mt-4">
                                <a href="/login" className="text-yellow-500 font-medium hover:underline">
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