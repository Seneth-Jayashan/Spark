import React from 'react'
import { useNavigate } from 'react-router-dom'

const RoleSelect = () => {

       const navigate = useNavigate();

        const handleClick = (role) => {
        navigate('/signUp',{state: {role}})
    }

  return (

    <div className=' flex flex-col items-center justify-center min-h-screen gap-6'>
        <h1 className='text-2xl font-bold'>Sign Up</h1>

        <button
        onClick={()=> handleClick("Organization")}
        className=" px-6 py-3 bg-green-600 text-white rounded-lg"
        >
        Sign Up as Organization</button>

        <button
        onClick={()=>handleClick("Volunteer")}
        className='px-6 py-3 bg-blue-600 text-white rounded-lg'
        >
          Sign Up as Volunteer
        </button>
    </div>


  
  )
}

export default RoleSelect