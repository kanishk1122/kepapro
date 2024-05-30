import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/Axios";
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
  const [newformdata, setNewformdata] = useState({
    videolink: "",
    season: "",
    ep: "",
    description: "",
    genres: "",
    animename: "",
    thumbnail: "",
    trending: "",
    popular: "",
    seasonname: "",
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
      const response = await axios.post(
        "https://kepapro-back-pv0z.onrender.com/user/addBookmark",
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
      const response = await axios.post(
        "https://kepapro-back-pv0z.onrender.com/comment",
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
      const updatevideo = await axios.post("updatevideo",
        newformdata,{withCredentials:true})
        console.log(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="bg-neutral-900 text-white w-full">
        <Navbar />
        <div className="h-fit px-2 flex flex-wrap w-screen gap-3">
          {data.map((item, index) =>
            item.animename === name && item.quality === 720 && item.ep === 1 ? (
              <Link
                key={index}
                to={`/watch/${item.animename}/${item.season}/${item.ep}`}
              >
                <div className="w-fit flex gap-3 rounded p-4 h-fit bg-zinc-700">
                  <p>season : {item.season}</p>
                </div>
              </Link>
            ) : null
          )}
        </div>
        <div className="h-fit px-2 flex flex-wrap w-screen gap-3"></div>
        <div className="h-fit pb-5 w-full p-4 flex flex-wrap gap-4">
          <div className="w-[930px] overflow-hidden min-w-[300px] h-[60vw] max-h-[400px] rounded-lg relative">
            <div className="w-[100vw] h-[50px] top-3 text-black  bg-transparent absolute z-20"></div>
            <iframe
              title="videoplayer"
              className="w-full h-full rounded-lg z-10"
              src={video}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="w-[380px] bg-zinc-800 p-4 flex flex-col gap-2 rounded-lg">
            {filteredData ? (
              <>
                <div className="flex flex-col gap-3">
                  <h1>Name: {filteredData.animename}</h1>
                  <h1>Description: {filteredData.description}</h1>
                  <h1>Genres: {filteredData.genres.join(" | ")}</h1>
                  <h1>Season: {seo}</h1>
                  <h1>Episode: {episode}</h1>
                </div>
                {token ? (
                  <form onSubmit={handleSubmit}>
                    <input
                      className="bg-transparent hidden"
                      type="text"
                      value={jwtDecode(token).email}
                      name="email"
                    />
                    <input
                      className="bg-transparent hidden"
                      type="text"
                      value={desiredPart[0]}
                      name="animename"
                    />
                    <input
                      className="bg-transparent hidden"
                      type="text"
                      value={seo}
                      name="season"
                    />
                    <input
                      className="bg-transparent hidden"
                      type="text"
                      value={episode}
                      name="episode"
                    />
                    <button
                      className="p-3 bg-orange-600 rounded mt-3 w-full"
                      type="submit"
                    >
                      Add to Watchlist
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={userLogger}
                    className="p-3 bg-orange-600 rounded mt-3 w-full"
                  >
                    Add to Watchlist
                  </button>
                )}
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
