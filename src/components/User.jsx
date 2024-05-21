import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';
import { detailsContext } from '../utils/Context.jsx';
import axios from '../utils/Axios.jsx';


const User = () => {
  const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
  const [decodedToken, setDecodedToken] = useState(""); 
  const [userdata,setuserdata] = useState({})
  const[showbookmark,setshowbookmark] = useState(false)
  
  
  const {username} = useParams()
  

  function jwt_decode (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



const decodingToken = () => {
  try {
    
    setDecodedToken(jwt_decode(token).email); // Update the decodedToken state with the decoded token
  } catch (error) {
    console.error("Error decoding token:", error); // Log any errors that occur during decoding
  }
};

console.log(jwt_decode(token).email);

useEffect(() => {
  const fetchuserdata = async () => {
    try {
      const response = await axios.get("/userdetail");
      setuserdata(response.data);
    } catch (error) {
      console.error("Error fetching userdata:", error);
      // Handle error if needed
    }
  };

  fetchuserdata(); // Call fetchuserdata immediately after defining it

}, []); // Add an empty dependency array to run the effect only once





const getbookmarkshower = ()=>{
  setshowbookmark(()=>!showbookmark)
}


  return (

    <>
    <Navbar/>
     <div className=''>
     {jwt_decode(token).email == username ? ( <div className='bg-neutral-900 w-full h-fit text-white'>
        <div className=' min-h-[50vh] justify-center gap-10 items-center h-fit flex flex-wrap relative w-[100vw]'>
            <div className='w-[200px] min-w-[200px] min-h-[200px]   h-[200px] bg-zinc-700 rounded-full'></div>
            <div className='text-4xl tracking-widest w-[300px] h-full text-center  flex flex-col gap-3  px-8 py-3 rounded-2xl '>
                <h1>{userdata.email}</h1>
               
                <h2>{userdata.username}</h2>
               
                
               
            </div>
            </div>
            <div className=' flex  p-3 flex flex-col  backdrop-blur-xl h-fit py-10 w-screen max-w-[840px] max-h-fit p-6 rounded-3xl  bg-[rgba(48,47,47,0.51)]'>
            <div className='w-120px flex  '>
            <div className='w-120px h-120px'>
            <svg xmlns="http://www.w3.org/2000/svg" onClick={getbookmarkshower} className={` ${showbookmark ? "w-[5vw] h-[5vw]": "w-[10vw] h-[10vw]" } min-h-[70px] min-w-[70px]  duration-700`} viewBox="0 0 24 24" fill="currentColor"><path d="M4 2H20C20.5523 2 21 2.44772 21 3V22.2763C21 22.5525 20.7761 22.7764 20.5 22.7764C20.4298 22.7764 20.3604 22.7615 20.2963 22.7329L12 19.0313L3.70373 22.7329C3.45155 22.8455 3.15591 22.7322 3.04339 22.4801C3.01478 22.4159 3 22.3465 3 22.2763V3C3 2.44772 3.44772 2 4 2ZM19 19.9645V4H5V19.9645L12 16.8412L19 19.9645ZM12 13.5L9.06107 15.0451L9.62236 11.7725L7.24472 9.45492L10.5305 8.97746L12 6L13.4695 8.97746L16.7553 9.45492L14.3776 11.7725L14.9389 15.0451L12 13.5Z"></path></svg>
            </div>
            <div onClick={getbookmarkshower}  className='text-4xl  font-semibold'>
              {showbookmark ?  <p>Bookmarks</p> : <div>click to show bookmarks</div>  }
              
            </div></div>
            <div>
              {showbookmark ? <div>lorem*100</div> : <p>hi</p> }
              
            </div>
            </div>
        </div>
    ) : (<div>
      somethinbg went wrong
    </div>) }
    
     </div>
    <Footer/>
    </>
  )
}

export default User