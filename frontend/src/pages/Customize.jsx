import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { IoCloudUploadOutline } from "react-icons/io5";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowBack } from "react-icons/io";

const Customize = () => {
        
    const {serverUrl, userData, setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
    const navigate = useNavigate()
    const inputImage = useRef()
    const handleImage=(e)=> {
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

  return (
    <div className='w-full md:h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col p-[20px] gap-[30px]'>
        <IoMdArrowBack onClick={()=>navigate("/")}
        className='absolute top-[30px] cursor-pointer left-[30px] text-white w-[25px] h-[25px]' />
        <h1 className='text-white text-[30px] text-center'>Select your <span className='text-blue-500'>Assistant Image</span></h1>
        <div className='w-full max-w-[90%] flex justify-center items-center flex-wrap gap-[30px]'>
            <Card image={image1}/>
            <Card image={image2}/>
            <Card image={image3}/>
            <Card image={image4}/>
            <Card image={image5}/>
            <Card image={image6}/>
            <Card image={image7}/>
            <div onClick={()=>{
                inputImage.current.click() 
                setSelectedImage("input")}}
            className={`w-[100px] h-[150px] md:w-[150px] md:h-[250px] bg-blue-950 border-2 border-blue-950 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-600 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"? "border-4 border-white shadow-2xl shadow-blue-600" : null}`}>
                {!frontendImage && <IoCloudUploadOutline className='text-white w-[45px] h-[45px]'/>}
                {frontendImage && <img src={frontendImage} className='h-full object-cover' /> }
                
            </div>
            <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
        </div>
        {selectedImage && 
        <button onClick={()=>navigate("/customize2")}
        className='min-w-[150px] h-[60px] mt-[30px] cursor-pointer bg-white rounded-full text-black font-semibold text-[18px]'>Next</button>}
    </div>
  )
}

export default Customize
