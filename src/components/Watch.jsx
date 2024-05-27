import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import axios from '../utils/Axios';
import Cookies from "js-cookie";

const Watch = () => {
  const { name, seo, episode } = useParams();
  const [userdata, setuserdata] = useState({});
  const [video, setVideo] = useState("");
  const [disc, setDisc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [genres, setGenres] = useState([]);
  const [quality, setQuality] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [watchSeason, setWatchSeason] = useState(1);
  const [userLoginMenu, setUserLoginMenu] = useState(false);
  const [id, setid] = useState("");
  const [comment, setcomment] = useState("");
  const [allcomment, setallcomment] = useState([]);

  const token = Cookies.get("token");

  const jwtDecode = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

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
        const response = await axios.post("/userdetail", {
          email: jwtDecode(token).email
        }, { withCredentials: true });
        setuserdata(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const url = window.location.href;
  const decodedUrl = decodeURIComponent(url);
  const parts = decodedUrl.split('/');
  const desiredPart = parts.slice(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/watchall");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const filterData = () => {
      if (data.length === 0) {
        return null;
      }
      const filteredByName = data.filter(item => item.animename === desiredPart[0]);
      const filtered = filteredByName.find(item => item.season == desiredPart[1] && item.ep == desiredPart[2]);
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
      setThumbnail(filtered.thumbnail);
      setid(filtered._id);
      setallcomment(filtered.comments);
    }
  }, [data, desiredPart]);

  const userLogger = () => {
    setUserLoginMenu(!userLoginMenu);
    alert("You need an account first. Please register.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await axios.post("https://kepapro-back.onrender.com/user/addBookmark", {
        email: jwtDecode(token).email,
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

  const commenthandler = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await axios.post("https://kepapro-back.onrender.com/comment", {
        email: jwtDecode(token).email,
        image: userdata.userpic,
        comment: comment,
        animename: desiredPart[0],
        season: seo,
        ep: episode,
      }, {
        withCredentials: true,
      });

      setallcomment(response.data);
      setcomment("")

      if (response.data.message === "Comment added successfully") {
        alert("comment added");
       ; // Clear the comment input after successful submission
        // Fetch updated comments if needed
        setallcomment([...allcomment, { image: userdata.userpic, comment: comment }]); // Update the comment list
      } else {
        console.error("Failed to add comment");
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
          {data.map((item, index) => (
            item.animename === name && item.quality === 720 && item.ep === 1 ? (
              <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
                <div className="w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
                  <p>season : {item.season}</p>
                </div>
              </Link>
            ) : null
          ))}
        </div>
        <div className="h-fit px-2 flex flex-wrap w-screen gap-3">
          {/* Uncomment and modify this section if you need it */}
          {/* {data.map((item, index) => (
            item.animename === name && item.quality === 720 && item.ep === 1 ? (
              <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
                <div className="w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
                  <p>language : {item.language}</p>
                </div>
              </Link>
            ) : null
          ))} */}
        </div>
        <div className="h-fit pb-5 w-full p-4 flex flex-wrap gap-4">
          <div className="w-[930px] overflow-hidden min-w-[300px] h-[60vw] max-h-[400px] rounded-lg relative">
            <div className="w-full h-[50px] top-3 text-black left-[90%] bg-transparent absolute z-20"></div>
            <iframe
              className="w-full h-full rounded-lg z-10"
              src={video}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="w-[380px] bg-zinc-800 p-4 flex flex-col gap-2 rounded-lg">
            <div className="flex flex-col gap-3">
              <h1>Name: {filteredData ? filteredData.animename : ''}</h1>
              <h1>Description: {filteredData ? filteredData.description : ''}</h1>
              <h1>Genres: {filteredData ? filteredData.genres.join(' | ') : ''}</h1>
              <h1>Season: {seo}</h1>
              <h1>Episode: {episode}</h1>
            </div>

            {token ? (
              <form onSubmit={handleSubmit}>
                <input className="bg-transparent hidden" type="text" value={jwtDecode(token).email} name="email" />
                <input className="bg-transparent hidden" type="text" value={desiredPart[0]} name="animename" />
                <input className="bg-transparent hidden" type="number" value={seo} name="season" />
                <input className="bg-transparent hidden" type="number" value={episode} name="ep" />
                <input type="submit" value="Add to favorites" className="bg-yellow-600 px-2 py-1 text-2xl rounded-full font-semibold" />
              </form>
            ) : (
              <div className="w-fit flex justify-center flex-col rounded-3xl items-center bg-zinc-600 p-3">
                <button onClick={userLogger} className="bg-yellow-600 w-fit px-2 py-1 text-2xl rounded-full font-semibold">Add to favorites</button>
                <div className={`${userLoginMenu ? 'h-fit' : 'h-0'} duration-700 w-1/2 flex flex-col justify-center items-center text-center`}>
                  <Link className={`${userLoginMenu ? 'text-[100%]' : 'text-[0%]'} duration-700`} to="/register">Register</Link>
                  <hr className={`${userLoginMenu ? 'w-full' : 'w-0'}`} />
                  <Link className={`${userLoginMenu ? 'text-[100%]' : 'text-[0%]'} duration-700`} to="/login">Login</Link>
                </div>
              </div>
            )}
            {/* {
              jwtDecode(token).Admin === 'yes' ? ()
            } */}

          </div>
        </div>

        <div className="w-fit h-fit bg-black p-5 flex flex-wrap rounded gap-2">
          {data.map((item, index) => (
            item.animename === name && item.quality === 720 && item.season === watchSeason ? (
              <Link key={index} to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
                <div className="w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
                  <p>ep: {item.ep}</p>
                </div>
              </Link>
            ) : null
          ))}
        </div>
      </div>
      <div className="max-m:h-fit bg-zinc-800 flex flex-col gap-3 p-3 h-fit ">
        {allcomment.map((item, index) => (
          <div key={index} className="w-fit h-fit flex gap-3 flex-wrap ">
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-black">
              <img src={item.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="bg-zinc-400 rounded-md w-fit mt-4 max-w-[800px] p-3 text-black font-semibold text-xl max-md:text-[4vw] h-fit">
              <p>{item.comment}</p>
            </div>
          </div>
        ))}

        <div className="w-full h-fit px-3 flex ">
          <form onSubmit={commenthandler}  className="w-full h-fit flex flex-col gap-5 justify-end items-end">
            <textarea value={comment} onChange={(e) => setcomment(e.target.value)} style={{ resize: "none" }} className="w-2/3 bg-transparent rounded-lg border-zinc-100 border h-fit min-h-[100px] max-md:w-full" id=""></textarea>
            <input type="submit" value="Add comment" className="bg-zinc-100 text-black rounded-lg font-semibold px-2 py-1" />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Watch;
