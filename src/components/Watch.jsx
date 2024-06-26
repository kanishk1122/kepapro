import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/Axios";
import Cookies from "js-cookie";
import { detailsContext } from "../utils/Context";


const Watch = () => {
  const { name, seo, episode } = useParams();
  const {loading, setLoading} = useContext(detailsContext)
  const [userdata, setuserdata] = useState({});
  const [video, setVideo] = useState("");
  const [disc, setDisc] = useState("");
  const [Thumbnail, setThumbnail] = useState("");
  const [Name, setName] = useState("")
  const [genres, setGenres] = useState([]);
  const [quality, setQuality] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [watchSeason, setWatchSeason] = useState(1);
  const [userLoginMenu, setUserLoginMenu] = useState(false);
  const [id, setid] = useState("");
  const [comment, setcomment] = useState("");
  const [downloadlink, setdownloadlink] = useState('')
  const [updatefromshow, setupdatefromshow] = useState(false)
  const [allcomment, setallcomment] = useState([]);
  const [newformdata, setNewformdata] = useState({
    videolink: "" ,
    season: 0,
    ep:"",
    description: "",
    genres: "",
    animename:"",
    thumbnail:"",
    trending: false,
    popular: false,
    seasonname: "",
    oldanimename:"",
    oldseason:0,
    oldep:0,
    download:'',
  });


  const token = Cookies.get("token");

  const jwtDecode = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await axios.post(
          "/userdetail",
          {
            email: jwtDecode(token).email,
          },
          { withCredentials: true }
        );
        setuserdata(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const url = window.location.href;
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split("/");
  const desiredPart = parts.slice(4);
  const [showSeasons, setShowSeasons] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/watchall");
        setData(response.data);
        if (response.data) {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error) {
          setLoading(true)
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (data.length === 0) {
        return null;
      }
      const filteredByName = data.filter(
        (item) => item.animename === desiredPart[0]
      );
      const filtered = filteredByName.find(
        (item) => item.season == desiredPart[1] && item.ep == desiredPart[2]
      );
      return filtered;
    };

    setWatchSeason(Number(desiredPart[1]));

    const filtered = filterData();
    setFilteredData(filtered);

    if (filtered) {
      setVideo(filtered.videolink);
      setDisc(filtered.description);
      setGenres(filtered.genres);
      setQuality(filtered.quality);
      setThumbnail(filtered.thumnail);
      setid(filtered._id);
      setName(filtered.animename)
      setallcomment(filtered.comments);
      setdownloadlink(filtered.download)
    }
  }, [data, desiredPart,newformdata]);

  const userLogger = () => {
    setUserLoginMenu(!userLoginMenu);
    alert("You need an account first. Please register.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await axios.post(
        "/user/addBookmark",
        {
          email: jwtDecode(token).email,
          animename: desiredPart[0],
          season: seo,
          ep: episode,
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);

      if (response.data.message === "Bookmark added successfully") {
        alert("This video added to favorites");
      } else {
        console.error("Failed to add video details.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const commenthandler = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await axios.post(
        "/comment",
        {
          email: jwtDecode(token).email,
          image: userdata.userpic,
          comment: comment,
          animename: desiredPart[0],
          season: seo,
          ep: episode,
        },
        {
          withCredentials: true,
        }
      );

      setallcomment(response.data);
      setcomment("");

      if (response.data.message === "Comment added successfully") {
        alert("comment added");
        // Clear the comment input after successful submission
        // Fetch updated comments if needed
        setallcomment([
          ...allcomment,
          { image: userdata.userpic, comment: comment },
        ]); // Update the comment list
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }; 





  const updatevideohandler = async (e)=>{
    e.preventDefault();

    try {
      const response = await axios.post("/updatevideo",
        newformdata,{withCredentials:true})
        alert(response.data.message);
    } catch (error) {
      console.log(error)
    }
  }

   



    const updateformdata =()=>{
      setNewformdata({
        videolink: video,
        season: desiredPart[1],
        ep: desiredPart[2],
        description: disc,
        genres: genres,
        animename: desiredPart[0],
        thumbnail: Thumbnail,
        trending: false,
        popular: false,
        seasonname: filteredData.seasonname ,
        oldanimename:desiredPart[0],
        oldseason:desiredPart[1],
        oldep:desiredPart[2],
        download:filteredData.download
      });
      setupdatefromshow(()=>!updatefromshow)
    }

    const handleToggleSeasons = () => {
      setShowSeasons(!showSeasons);
    };

    const bgImage = {
      backgroundImage: `url(${Thumbnail})`,
      objectFit:"cover",
    };
    const bgab={
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    backdropFilter: 'blur(30px)', // Apply blur effect
    }

  return (
    <div style={bgImage} >
    <div style={bgab}>
      <div className="bg-[rgb(0,0,0,0.5)] text-white w-full">
        <Navbar />
        <div className="h-fit px-2 mt-5 justify-center items-center flex flex-wrap w-full ">
         <img src={Thumbnail} className="w-[300px] rounded-3xl object-cover h-[400px] " alt="" />
        </div>
        <div className=" px-2 flex flex-wrap w-screen gap-3"></div>
        <div className="h-fit pb-5 w-full p-2 flex justify-center items-center  flex-wrap gap-1">
          <div className="w-[70%] justify-center items-center  flex flex-wrap-reverse gap-6    min-w-[300px] max-md:w`-full h-fit   relative">
          <div className="w-[30%] rounded-2xl max-md:w-full min-h-[200px] min-w-[300px] justify-center items-center bg-[rgb(0,0,0,0.5)] p-5 flex flex-col gap-2">
  <button
    onClick={handleToggleSeasons}
    className="bg-red-700 text-white p-2 rounded"
  >
    {showSeasons ? 'Hide Seasons' : 'Show Seasons'}
  </button>
  <div className={`w-full ${showSeasons ? "h-20" : 'h-0'} overflow-scroll flex flex-col gap-3 duration-500`}>
    {showSeasons && (
      <div className="flex flex-col gap-3">
        {data
          .filter((item) => item.animename === name && item.quality === 720 && item.ep === 1)
          .map((item, index) => (
            <Link
              key={index}
              to={`/watch/${item.animename}/${item.season}/${item.ep}`}
            >
              <div className="w-full flex gap-3 rounded p-4 h-fit bg-zinc-700">
                <p>Season: {item.season}</p>
              </div>
            </Link>
          ))}
      </div>
    )}
  </div>
  <div className="w-full h-60 overflow-scroll flex justify-center items-center flex-wrap gap-3">
    {data
      .filter((item) => item.animename === name && item.quality === 720 && item.season === watchSeason)
      .map((item, index) => (
        <Link
          key={index}
          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
        >
          <div className="w-[100%] flex gap-1 rounded p-2 h-fit bg-zinc-700">
            <p>Episode: {item.ep}</p>
          </div>
        </Link>
      ))}
  </div>
</div>

   <div className="w-full md:w-[60%] max-md:min-h-[200px]   h-[45vh] relative max-md:h-[30vh] rounded-2xl overflow-hidden  z-10 ">
   <div className=" bg-transparent absolute w-full top-1 max-md:h-[30%] h-[20%]"></div>
    <iframe
              title="videoplayer"
              className="w-full   h-full object-cover"
              src={video}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            </div>
            
          </div>
           
          

          <div className="w-[380px] h-fit bg-zinc-800 p-4 flex flex-col gap-2 rounded-lg">
            <div className="flex h-fit flex-col gap-3">
              <h1>Name: {filteredData ? filteredData.animename : ""}</h1>
              <h1>
                Description: {filteredData ? filteredData.description : ""}
              </h1>
              <h1>
                Genres: {filteredData ? filteredData.genres.join(" | ") : ""}
              </h1>
              <h1>Season: {seo}</h1>
              <h1>Episode: {episode}</h1>
            </div>

            {token ? (
              <div className="w-full flex gap-3 justify-center items-center">
              <form onSubmit={handleSubmit} className="flex">
                <input
                  className="bg-[rgb(0,0,0,0.5)] hidden"
                  type="text"
                  value={jwtDecode(token).email}
                  name="email"
                  />
                <input
                  className="bg-[rgb(0,0,0,0.5)] hidden"
                  type="text"
                  value={desiredPart[0]}
                  name="animename"
                />
                <input
                  className="bg-[rgb(0,0,0,0.5)] hidden"
                  type="number"
                  value={seo}
                  name="season"
                />
                <input
                  className="bg-[rgb(0,0,0,0.5)] hidden"
                  type="number"
                  value={episode}
                  name="ep"
                />
                <input
                  type="submit"
                  value="Add to favorites"
                  className="bg-red-700 px-2 py-1 text-2xl rounded-full font-semibold"
                />
               
                
              </form>
              {Cookies.get("token") && jwtDecode(token).Admin === import.meta.env.VITE_UPDATE_PASS &&<button className="bg-blue-500  px-2 py-1a rounded-full" onClick={updateformdata}>
              EDIT
           </button>}
              
              </div>
              
            ) : (
              <div className="w-fit flex justify-center flex-col rounded-3xl items-center bg-zinc-600 p-3">
                <button
                  onClick={userLogger}
                  className="bg-red-700 w-fit px-2 py-1 text-2xl rounded-full font-semibold"
                >
                  Add to favorites
                </button>
                <div
                  className={`${
                    userLoginMenu ? "h-fit" : "h-0"
                  } duration-700 w-1/2 flex flex-col justify-center items-center text-center`}
                >
                  <Link
                    className={`${
                      userLoginMenu ? "text-[100%]" : "text-[0%]"
                    } duration-700`}
                    to="/register"
                  >
                    Register
                  </Link>
                  <hr className={`${userLoginMenu ? "w-full" : "w-0"}`} />
                  <Link
                    className={`${
                      userLoginMenu ? "text-[100%]" : "text-[0%]"
                    } duration-700`}
                    to="/login"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
             <div className="flex w-full justify-end items-end">
              {downloadlink !== null && downloadlink !== undefined  && <a className="bg-white cursor-pointer text-black px-3 py-1 text-2xl font-semibold rounded-xl" target="_blank" href={downloadlink}>Download</a> }
            </div>

          </div>
        </div>

       
        
           {
              Cookies.get("token") && jwtDecode(token).Admin === import.meta.env.VITE_UPDATE_PASS ?  
              ( 
                <div className="flex flex-col justify-center items-center h-fit w-full  ">
                
             {updatefromshow&&
              <form  onSubmit={updatevideohandler} className="w-full justify-center items-center m-4  h-fit p-6 flex flex-col gap-3    *:rounded-lg  px-14 rounded-lg  bg-[rgb(0,0,0,0.5)] ">
             
                <div className=" h-fit flex flex-wrap w-full   justify-between gap-5 items-center">
                <fieldset className="flex justify-center w-[40%] flex-col  p-3 h-fit items-center gap-7   *:bg-[rgb(0,0,0,0.5)]   ">
                  <div>
                  <iframe
              title="videoplayer"
              className="w-full h-full rounded-lg z-10 "
              src={newformdata.videolink}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            ></iframe>
                  </div>
                 <div className="w-full h-full flex flex-wrap justify-center items-center">
                 <h3>enter videolink</h3>
                  <input
                    type="text"
                    value={newformdata.videolink}
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, videolink: e.target.value })
                    }
                    name=""
                    id=""
                  />
                 </div>
                </fieldset>
               
               <div className="flex flex-col h-fit w-[40%]  p-3 justify-center items-center">
               <fieldset className="flex justify-center p-3 w-full border-zinc-400 border rounded-xl h-fit items-center gap-7    ">
                  <legend>enter animename</legend>
                  <input
                    type="text"
                    value={
                      newformdata.animename
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200  bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, animename: e.target.value })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
                <fieldset className="flex justify-center p-3 w-full border-zinc-400 border rounded-xl h-fit items-center gap-7     ">
                  <legend>enter season name</legend>
                  <input
                    type="text"
                    value={
                      newformdata.seasonname
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, seasonname: e.target.value })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
                <fieldset className="flex justify-center p-3 w-full border-zinc-400 border rounded-xl h-fit items-center gap-7     ">
                  <legend>enter thumbnail</legend>
                  <input
                    type="text"
                    value={
                      newformdata.thumbnail
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, thumbnail: e.target.value })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
               </div>
               </div>
    
              <div className="flex-wrap justify-center items-center gap-4 w-full h-fit">
              <fieldset className=" p-3 h-fit w-full border-zinc-400 border  gap-7 flex rounded-lg justify-center items-center   ">
                  <legend>enter genres</legend>
                  <input
                    type="text"
                    value={
                      newformdata.genres
                    }
                    style={{resize:"none"}}
                    className="w-full h-fit p-3 rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({
                        ...newformdata,
                        genres: e.target.value.split(","),
                      })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
                <fieldset className=" p-3 h-fit w-full border-zinc-400 border  gap-7 flex rounded-lg justify-center items-center   ">
                  <legend>enter download link</legend>
                  <input
                    type="text"
                    value={
                      newformdata.download
                    }
                    style={{resize:"none"}}
                    className="w-full h-fit p-3 rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({
                        ...newformdata,
                        download: e.target.value,
                      })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
    
                <fieldset className=" p-3 h-fit w-full border-zinc-400 border rounded-lg gap-7 flex justify-center items-center   ">
                  <legend>enter description</legend>
                  <textarea
                    type="text"
                    value={
                      newformdata.description
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({
                        ...newformdata,
                        description: e.target.value,
                      })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
              </div>
                <div className="flex flex-wrap gap-4">
                <fieldset className="flex justify-center p-3 h-20 items-center gap-7 border-zinc-400 border rounded-lg  ">
                  <legend>enter season no</legend>
                  <input
                    type="Number"
                    value={
                      newformdata.season
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, season: e.target.value })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
                <fieldset className="flex justify-center p-3 h-20 items-center gap-7 *:flex *:justify-center border-zinc-400 border rounded-lg  ">
                  <legend>enter episode</legend>
                  <input
                    type="Number"
                    value={
                      newformdata.ep
                    }
                    className="w-full h-fit rounded-lg order border-zinc-200 bg-zinc-700 px-2 py-1 bg-[rgb(0,0,0,0.5)]  "
                    onChange={(e) =>
                      setNewformdata({ ...newformdata, ep: e.target.value })
                    }
                    name=""
                    id=""
                  />
                </fieldset>
    
                <fieldset className="flex justify-center p-3 h-20 items-center gap-7 border-zinc-400 rounded-lg *:flex *:justify-center *:items-center *:gap-1 border order-zinc-200 ">
                  <legend>Select popular</legend>
                  <div>
                    <input
                      type="radio"
                      id="yes"

                      onClick={(e) =>
                        setNewformdata({
                          ...newformdata,
                          popular:true,
                        })
                      }
                      value="true"
                      name="popular"
                    />
    
                    <label htmlFor="yes">yes</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="No"
                      onClick={(e) =>
                        setNewformdata({
                          ...newformdata,
                          popular:false,
                        })
                      }
                      value="false"
                      name="popular"
                    />
                    <label htmlFor="No">No</label>
                  </div>
                </fieldset>
                <fieldset className="flex justify-center p-3 h-20 items-center gap-7   rounded-lg *:flex *:justify-center *:items-center *:gap-1 border border-zinc-200 ">
                  <legend>select trending</legend>
                  <div>
                    <input
                      type="radio"
                      value="yes"
                      onClick={(e) =>
                        setNewformdata({
                          ...newformdata,
                          trending:true,
                        })
                      }
                      name="trending"
                      id="yse"
                    />
                    <label htmlFor="yse">yes</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      onClick={(e) =>
                        setNewformdata({
                          ...newformdata,
                          trending:false,
                        })
                      }
                      value="no"
                      name="trending"
                      id="off"
                    />
                    <label htmlFor="off">No</label>
                  </div>
                </fieldset>
                
                </div>
                <div className="flex justify-center items-center">
                <input type="submit" value="update" className="bg-blue-600 rounded-lg px-2 py-1" />
                </div>
              </form>
               }

            </div>
              )
            :null 
             }  
       
      </div>
      <div className="max-m:h-fit bg-[rgb(0,0,0,0.5)]  flex flex-col gap-3 p-3 h-fit ">
         {allcomment.map((item, index) => (
          <div key={index} className="w-fit h-fit flex gap-3 flex-wrap ">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-[rgb(0,0,0,0.5)]">
              <img
                src={item.image}
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="bg-zinc-400 rounded-md w-fit mt-4 max-w-[800px] p-3 text-black font-semibold text-xl max-md:text-[4vw] h-fit">
              <p>{item.comment}</p>
            </div>
          </div>
        ))} 

        <div className="w-full h-fit px-3 flex ">
          <form
            onSubmit={commenthandler}
            className="w-full h-fit flex flex-col gap-5 justify-end items-end"
          >
            <textarea
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
              style={{ resize: "none" }}
              className="w-2/3 bg-[rgb(0,0,0,0.5)] rounded-lg border-zinc-100 border h-fit min-h-[100px] max-md:w-full"
              id=""
            ></textarea>
            <input
              type="submit"
              value="Add comment"
              className="bg-zinc-100 text-black rounded-lg font-semibold px-2 py-1"
            />
          </form>
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default Watch;
