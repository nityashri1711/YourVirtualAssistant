import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { MdMenuOpen } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";

const Home = () => {
    const {userData,serverUrl,setUserData, getGeminiResponse}= useContext(userDataContext)
    const navigate=useNavigate()
    const [listening, setListening] = useState(false)
    const [userText, setUserText] = useState("")
    const [aiText, setAiText] = useState("")
    const isSpeakingRef= useRef(false)
    const recognitionRef = useRef(null)
    const [ham, setHam] = useState(false)
    const isRecognizingRef = useRef(false)
    const synth=window.speechSynthesis

    const handleLogOut=async()=>{
        try{
            const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            setUserData(null)
            navigate("/signin")
        } catch(error) {
            setUserData(null)
            console.log(error)
        }
    }

    const startRecognition=()=>{
        if(!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
            recognitionRef.current?.start();
            setListening(true)
        } catch (error) {
            if(!error.message.includes("start")) {
                console.error("Recognition error:", error)
            }
        }
    }
    };

    const speak=(text)=> {
        const utterence= new SpeechSynthesisUtterance(text)
        utterence.lang='hi-IN';
        const voices=window.speechSynthesis.getVoices()
        const hindiVoice=voices.find(v=>v.lang==='hi-IN');
        if(hindiVoice) {
            utterence.voice=hindiVoice
        }

        isSpeakingRef.current=true
        utterence.onend=()=> {
            setAiText("")
            isSpeakingRef.current=false
            setTimeout(()=>{
                startRecognition()
            }, 800);
        }
        synth.cancel()
        synth.speak(utterence)
    }

    const handleCommand = (data) => {
        const { type, userInput, response } = data;
        speak(response);

        if (type === 'google_search') {
            const query = encodeURIComponent(userInput);
            window.open(`https://www.google.com/search?q=${query}`, '_blank');
        }

        if (type === 'youtube_search') {
            const query = encodeURIComponent(userInput);
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }

        if (type === 'youtube_play') {
            const query = encodeURIComponent(userInput);
            window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
        }

        if (type === 'calculator_open') {
            window.open('https://www.google.com/search?q=calculator', '_blank');
        }

        if (type === 'instagram_open') {
            window.open('https://www.instagram.com', '_blank');
        }

        if (type === 'facebook_open') {
            window.open('https://www.facebook.com', '_blank');
        }

        if (type === 'weather-show') {
            window.open('https://www.google.com/search?q=weather', '_blank');
        }
    };


    useEffect(()=>{
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition=new SpeechRecognition()
        recognition.continuous=true,
        recognition.lang='en-US'
        recognition.interimResults=false;

        recognitionRef.current=recognition
        // const isRecognizingRef={current:false}
        let isMounted=true;
        const startTimeout=setTimeout(()=>{
            if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start();
                    console.log("Recognition requested to start");
                } catch (error) {
                    if(error.name !== "InvalidStateError") {
                        console.error(error);
                    }
                }
            }
        }, 1000);

        const safeRecognition=()=>{
            if(!isSpeakingRef.current && !isRecognizingRef.current) {
                try {
                    recognition.start()
                    // console.log("Recognition requested to start");
                } catch (error) {
                    if(error.name !== "InvalidStateError") {
                        console.log("Start error:", error);
                    }
                }
            }
        };

        recognition.onstart=()=> {
            // console.log("Recognition started");
            isRecognizingRef.current=true
            setListening(true)
        };
        recognition.onend=()=> {
            // console.log("Recognition ended");
            isRecognizingRef.current=false
            setListening(false)
            if(isMounted && !isSpeakingRef.current) {
                setTimeout(()=> {
                    if(isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition restarted")
                        } catch(error) {
                            if(error.name !== "InvalidStateError") console.error(error)
                        }
                    }
                }, 1000);
            }
        };
        recognition.onerror=(event)=> {
            console.warn("Recognition error:", event.error);
            isRecognizingRef.current=false;
            setListening(false)
            if(event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
                setTimeout(()=> {
                    if(isMounted) {
                        try {
                            recognition.start();
                            console.log("Recognition restarted")
                        } catch (error) {
                            if(error.name !== "InvalidStateError") console.error(error)
                        }
                    }
                },1000)
            }
        };
        

        recognition.onresult=async (e)=>{
            const transcript=e.results[e.results.length-1][0].transcript.trim()
            console.log("heard : "+transcript)

            if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
                setUserText(transcript)
                setAiText("")
                recognition.stop()
                isRecognizingRef.current=false
                setListening(false)
                const data=await getGeminiResponse(transcript)
                console.log(data)
                handleCommand(data)
                setUserText("")
                setAiText(data.response)
            }
        }
        
            const greeting= new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with`);
            greeting.lang= 'hi-IN';
            
            window.speechSynthesis.speak(greeting);
       

        return ()=> {
            isMounted=false;
            clearTimeout(startTimeout)
            recognition.stop()
            setListening(false)
            isRecognizingRef.current=false
        }  
    },[])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-black to-blue-950 flex justify-center items-center flex-col'>
        <MdMenuOpen onClick={()=>setHam(true)}
        className=' text-white absolute top-[20px] right-[20px] w-[45px] h-[35px]'/>
        <div className={`absolute right-0 top-0 ${ham ? "block" : "hidden"} lg:${ham ? "block" : "hidden"} w-full lg:w-[30%] h-full bg-[#00000051] backdrop-blur-lg flex flex-col px-[40px] transition-transform`}>
            <IoCloseCircleOutline onClick={()=>setHam(false)}
            className=' text-white absolute top-[20px] right-[20px] w-[45px] h-[35px]'/>
            <button className='min-w-[150px] mt-[100px] h-[60px] bg-white cursor-pointer rounded-full text-black font-semibold text-[18px] ' onClick={handleLogOut}>Log Out</button>
            <button onClick={()=>navigate("/customize")}
            className='min-w-[150px] h-[60px] mt-[30px] bg-white cursor-pointer rounded-full text-black font-semibold text-[18px]  px-[20px] py-[10px] '>Customize your Assistant</button>
            <div className='w-full h-[2px] bg-gray-400 mt-[30px]'></div>
            <h1 className='text-white font-semibold text-[19px] mt-[30px]'>History</h1>

            <div className='w-full h-[60%] text-gray-200 mt-[10px] overflow-y-auto flex flex-col gap-[20px] pr-[10px]'>
                {userData.history?.map((his, index) => (
                    <span 
                        key={index} 
                        className='break-words whitespace-pre-wrap bg-white/10 px-3 py-2 rounded text-sm max-w-full'
                    >
                        {his}
                    </span>
                ))}
            </div>

        </div>


        <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-xl shadow-blue-600'>
            <img src={userData?.assistantImage} alt="" className='h-full object-cover '/>
        </div>
        <h1 className='text-white mt-[25px] text-[20px] font-semibold'>I'm {userData?.assistantName}</h1>
        {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
        {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
        
        <div className='w-[70%] flex justify-center items-center'>
            <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText? userText : aiText?aiText : null}</h1>
        </div>
    </div>
  )
}

export default Home