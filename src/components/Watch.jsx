import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import axios from '../utils/Axios';
import Cookies from "js-cookie";

const Watch = () => {

  const { name, seo, episode } = useParams(); // Accessing the 'name', 'season', and 'episode' parameters using useParams

  const [video, setVideo] = useState("");
  const [disc, setdisc] = useState("");
  const [thumnail, setthumnail] = useState("");
  const [genrec, setgenrec] = useState([]);
  const [quality, setquality] = useState("");
  const [animelogo, setanimelogo] = useState("");
  const [data, setData] = useState([]);
  const [live, setLive] = useState(false); // Assuming this is meant to track if content is live
  const [filteredData, setFilteredData] = useState(null); // Initialize filteredData with null
  const [videoquality,setvideoquality] = useState("720");
  const [watchseason, setwatchseason] = useState(1)
  const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string
  const [decodedToken, setDecodedToken] = useState({}); 
  const [userdata,setuserdata] = useState({})
  const[userloginmenu,setuserloginmenu] = useState(false)
  

  

if (Cookies.get("token")) {
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
}


useEffect(() => {
  const fetchuserdata = async () => {
    try {
      const response = await axios.get("/userdetail");
      setuserdata(response.userdata);
    } catch (error) {
      console.error("Error fetching userdata:", error);
      // Handle error if needed
    }
  };

  fetchuserdata(); // Call fetchuserdata immediately after defining it

}, []); // Add an empty dependency array to run the effect only once


  
  
  const url = window.location.href;
  
  // Decode the URL
  const decodedUrl = decodeURIComponent(url);
  
  // Extract the desired part
  const parts = decodedUrl.split('/');
  const desiredPart = parts.slice(4);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/watchall");
        setData(response.data);
      
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error if needed
      }
    };

    fetchData()
      .then(() => {
        // Set 'live' state based on fetched data
        // For example, if data indicates the content is live, setLive(true);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        // Handle error if needed
      });


    return () => {
      console.log("Component unmounted");
      // Cleanup function (if needed)
    };
  }, []); 

  useEffect(() => {
    const filterData = () => {
      if (data.length === 0) {
        return null; // Return null if data is empty
      }
      // Filter data based on name parameter
      const filteredByName = data.filter(item => item.animename === desiredPart[0]);
      // Find the entry that matches both season and episode within the filtered data
      const filtered = filteredByName.find(item => item.season == desiredPart[1] && item.ep == desiredPart[2]  );
      console.log(desiredPart,"thisis here")
      return filtered;
    };

    
    setwatchseason(Number(desiredPart[1]));
  

    const filtered = filterData();
    setFilteredData(filtered); // Update filteredData

    if (filtered) {
      setVideo(filtered.videolink);
      setdisc(filtered.discription);
      setgenrec(filtered.genrec);
      setquality(filtered.quality);
      setthumnail(filtered.thumnail);
    }
  }, [data, name, seo, episode, videoquality,watchseason]); // Added 'videoquality' to the dependency array

  const userloger =()=>{
    setuserloginmenu(()=>!userloginmenu)
    alert("you need a accound first do it")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");  // Get the token from cookies

    try {
        const response = await axios.post("https://kepapro-back.onrender.com/user/addBookmark", {
            email: jwt_decode(token).email,
            animename: desiredPart[0],
            season: seo,
            ep: episode
        }, {
            withCredentials: true,
        });

        console.log(response.data);

        if (response.data.message === "Bookmark added successfully") {
            alert("This video added to favorites");
        } else {
            console.error("Failed to add video details.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


  return (
    <>
      <div className="bg-neutral-900 text-white w-full">
        <Navbar />
        <div className="h-fit px-2 flex flex-wrap w-screen gap-3">
        {data.map((item, index) => {
    return item.animename === name && item.quality === 720 && item.ep === 1 ? (
      <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
        <div className="  w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
        
          <p>season : {item.season}  </p>
          
          </div>
       
      </Link>
    ) : null;
  })}
        </div>
        <div className="h-fit pb-5 w-full p-4 flex flex-wrap gap-4">
          {/* Conditional rendering of iframe */}
          <div className="w-[930px] overflow-hidden min-w-[300px] h-[60vw] max-h-[400px] rounded-lg relative">

<div className="w-full h-[50px] top-3 text-black left-[90%] bg-transparent absolute z-20"></div>
 
          {
           <iframe
           className="w-full h-full rounded-lg z-10"
           src={video}
           scrolling="no"
           frameborder="0"
           allowfullscreen="true"
         ></iframe>
         }
          </div>


          <div className="w-[380px] bg-zinc-800 p-4 flex flex-col gap-2 rounded-lg">
         
            <div className=" flex flex-col gap-3">
            <h1>Name: {filteredData ? filteredData.animename : ''}</h1>
            <h1>Discription :  {filteredData ? filteredData.description : ''}</h1>
            <h1>Genrec : {filteredData ? filteredData.genres.join(' | ') : ''}</h1>
            <h1>Season:  {seo}</h1>
            <h1>Episode :  {episode}</h1>
            </div>

            {Cookies.get("token") ? <form onSubmit={handleSubmit}>
              <input type="text" className="bg-transparent hidden " value={jwt_decode(token).email}  name="email"/>
              <input type="text" className="bg-transparent   hidden " value={desiredPart[0]}  name="animename"/>
              <input type="number" className="bg-transparent hidden  " value={seo}  name="season"/>
              <input type="number" className="bg-transparent hidden  " value={episode}  name="ep"/>
              <input type="submit" value="Add to favrate" className="bg-yellow-600 px-2 py-1 text-2xl rounded-full font-semibold "  />
            </form> :  <div className="w-fit flex justify-center flex-col rounded-3xl items-center bg-zinc-600 p-3">
          <button onClick={userloger}  className="bg-yellow-600 w-fit  px-2 py-1 text-2xl rounded-full font-semibold " >Add to favrate</button>
          <div className={`${userloginmenu ? ' h-fit' :' h-0' } duration-700  w-1/2 h-fit flex flex-col justify-center item-center text-center`}>
            <Link className={` w-[30%] ${userloginmenu ? ' text-[100%]' :' text-[0%]' } duration-700 `} to="/register">Register</Link>
            <hr className={`${userloginmenu ? ' w-full' :' w-0' }`} />
            <Link className={` w-[30%] ${userloginmenu ? ' text-[100%]' :' text-[0%]' } duration-700 `}  to="login">Login</Link>
          </div>
            </div>  }
          
                  
          </div>
        </div>
       

        <div className="w-fit  h-fit bg-black p-5 flex flex-wrap rounded gap-2">

        {data.map((item, index) => {
    return item.animename === name && item.quality === 720 && item.season === watchseason  ? (
      <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
        <div className="  w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
        
          <p>ep: {item.ep}  </p>
          
          </div>
       
      </Link>
    ) : null;
  })}
</div>


        </div>
   
      <Footer />
    </>
  );
};

export default Watch;
