import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
        const {serverUrl, userData, setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage} = useContext(userDataContext)
    
  return (
    <div  onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
    }}
    className={`w-[100px] h-[150px] md:w-[150px] md:h-[250px] bg-blue-950 border-2 border-blue-950 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-600 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image? "border-4 border-white shadow-2xl shadow-blue-600" : null}`}>
        <img src={image} className='h-full object-cover ' />
    </div>
  )
}

export default Card
