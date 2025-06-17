import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const {userData, backendImage, selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
    const [loading, setLoading]=useState(false)
    const navigate=useNavigate()

    const handleUpdateAssistant=async()=> {
        setLoading(true)
        try {
            let formData=new FormData()
            formData.append("assistantName", assistantName)
            if(backendImage) {
                formData.append("assistantName", backendImage)
            } else {
                formData.append("imageUrl", selectedImage)
            }
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
            setLoading(false)
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col p-[20px] gap-[30px] relative'>
        <IoMdArrowBack onClick={()=>navigate("/customize")}
        className='absolute top-[30px] cursor-pointer left-[30px] text-white w-[25px] h-[25px]' />
        <h1 className='text-white text-[30px] text-center'>Enter your <span className='text-blue-600'>Assistant Name</span></h1>
        <input onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}
        type="text" placeholder='Enter your Assistant Name' required className='px-[20px] py-[20px] rounded-full w-full max-w-[600px] h-[60px] text-[18px] outline-none bg-transparent text-white placeholder-gray-300 border-2 border-white' />
        {assistantName && <button disabled={loading} onClick={()=>{
            
            handleUpdateAssistant()
        }}
        className='min-w-[150px] h-[60px] mt-[30px] cursor-pointer bg-white rounded-full text-black font-semibold text-[18px]'>{!loading?"Create":"Loading.."}</button>}
        
    </div>
  )
}

export default Customize2
