import React, { useState } from 'react'
import bg from "../assets/authBg.png"
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from "axios"

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {serverUrl,userData, setUserData}=useContext(userDataContext)
    const navigate = useNavigate()
    const [name,setName]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const handleSignUp = async(e)=> {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, {
                name, email,password
            }, {withCredentials:true})
            setUserData(result.data)
            setLoading(false)
            navigate("/customize")
        } catch(error) {
            console.log(error)
            setUserData(null)
            setError(error.response.data.message)
            setLoading(false)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
        <form onSubmit={handleSignUp}
        className='px-[20px] w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur rounded-2xl shadow-lg shadow-black-500 flex flex-col items-center justify-center gap-[20px]'>
            <h1 className='text-white mb-[30px] text-[30px] font-semibold'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
            <input type="text" placeholder='Enter your Name' required onChange={(e)=>setName(e.target.value)} value={name} className='px-[20px] py-[20px] rounded-full w-full h-[60px] text-[18px] outline-none bg-transparent text-white placeholder-gray-300 border-2 border-white' />
            <input type="email" placeholder='Enter your Email' required onChange={(e)=>setEmail(e.target.value)} value={email} className='px-[20px] py-[20px] rounded-full w-full h-[60px] text-[18px] outline-none bg-transparent text-white placeholder-gray-300 border-2 border-white' />
            <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                
                <input type={showPassword?"text":"password"} placeholder='Enter your Password' required onChange={(e)=>setPassword(e.target.value)} value={password} className='px-[20px] py-[20px] rounded-full w-full h-[60px] text-[18px] outline-none bg-transparent text-white placeholder-gray-300 border-2 border-white' />
                {!showPassword && <IoEye onClick={()=>setShowPassword(true)}
                className='absolute top-[20px] right-[20px] text-white text-2xl cursor-pointer '/>}
                {showPassword && <IoMdEyeOff onClick={()=>setShowPassword(false)}
                className='absolute top-[20px] right-[20px] text-white text-2xl cursor-pointer'/>}
            </div>
            {error.length>0 && <p className='text-[17px] text-red-500'>*{error}</p> }
            <button className='min-w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black font-semibold text-[18px]' disabled={loading}>{loading?"Loading..":"Sign Up"}</button>
            <p onClick={()=>navigate("/signin")} 
            className='text-white text-[18px] cursor-pointer'>Aldready have an account ? <span className='text-blue-300'>Sign In</span></p>
        </form>
    </div>
  )
}

export default SignUp