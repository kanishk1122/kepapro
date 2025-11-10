import { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommentSection from "./CommentSection";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/Axios";
import { detailsContext } from "../utils/Context";

// Ensure axios sends credentials (cookies) by default for cross-origin requests
axios.defaults.withCredentials = true;

const Watch = () => {
  const { name, seo, episode } = useParams();
  const { loading, setLoading } = useContext(detailsContext);
  const [userdata, setuserdata] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [video, setVideo] = useState("");
  const [disc, setDisc] = useState("");
  const [Thumbnail, setThumbnail] = useState("");
  const [Name, setName] = useState("");
  const [genres, setGenres] = useState([]);
  const [quality, setQuality] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [watchSeason, setWatchSeason] = useState(1);
  const [userLoginMenu, setUserLoginMenu] = useState(false);
  const [id, setid] = useState("");
  const [downloadlink, setdownloadlink] = useState("");
  const [updatefromshow, setupdatefromshow] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newformdata, setNewformdata] = useState({
    videolink: "",
    season: 0,
    ep: "",
    description: "",
    genres: "",
    animename: "",
    thumbnail: "",
    trending: false,
    popular: false,
    seasonname: "",
    oldanimename: "",
    oldseason: 0,
    oldep: 0,
    download: "",
  });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("/session", { withCredentials: true });
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setuserdata(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error) {
          setLoading(true);
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
      setName(filtered.animename);
      setdownloadlink(filtered.download);
    }

    // Check if description is missing and prompt reload
    if (filtered && !filtered.description) {
      const shouldReload = window.confirm(
        "Video data is incomplete. Would you like to reload the page?"
      );
      if (shouldReload) {
        window.location.reload();
      }
    }
  }, [data, desiredPart, newformdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(
        "/user/addBookmark",
        {
          animename: desiredPart[0],
          season: seo,
          ep: episode,
        },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updatevideohandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/updatevideo", newformdata, {
        withCredentials: true,
      });
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const updateformdata = () => {
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
      seasonname: filteredData.seasonname,
      oldanimename: desiredPart[0],
      oldseason: desiredPart[1],
      oldep: desiredPart[2],
      download: filteredData.download,
    });
    setupdatefromshow(() => !updatefromshow);
  };

  const handleToggleSeasons = () => {
    setShowSeasons(!showSeasons);
  };

  const bgImage = {
    backgroundImage: `url(${Thumbnail})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const bgab = {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    backdropFilter: "blur(50px)",
    minHeight: "100vh",
  };

  // Use userdata from /session to determine admin status
  const isAdmin = !!userdata?.isAdmin;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Skeleton Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Skeleton Thumbnail */}
            <div className="w-full lg:w-1/4">
              <div className="w-full rounded-2xl shadow-2xl aspect-[2/3] bg-zinc-800 animate-pulse"></div>
            </div>

            {/* Skeleton Video Info */}
            <div className="w-full lg:w-3/4 space-y-6">
              <div className="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <div className="h-10 bg-zinc-700 rounded-lg w-3/4 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
                  <div className="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-20 bg-zinc-700 rounded-full animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skeleton Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-48 bg-zinc-700 rounded-lg animate-pulse"></div>
                <div className="h-12 w-32 bg-zinc-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Skeleton Video Player and Episodes */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skeleton Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl aspect-video animate-pulse flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-zinc-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </div>
            </div>

            {/* Skeleton Episodes Sidebar */}
            <div className="bg-zinc-800/50 backdrop-blur-md rounded-2xl shadow-xl p-6">
              <div className="h-12 bg-zinc-700 rounded-lg mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-zinc-700 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton Comments Section */}
          <div className="mt-8 bg-zinc-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <div className="h-8 bg-zinc-700 rounded-lg w-1/4 mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-zinc-700/30 p-4 rounded-lg"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex-shrink-0 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={bgImage} className="min-h-screen">
      <div style={bgab}>
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Thumbnail */}
            <div className="w-full lg:w-1/4">
              <img
                src={Thumbnail}
                className="w-full rounded-2xl shadow-2xl object-cover aspect-[2/3]"
                alt={Name}
              />
            </div>

            {/* Video Info */}
            <div className="w-full lg:w-3/4 space-y-6">
              <div className="bg-zinc-800/50 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                <h1 className="text-4xl font-bold text-white mb-4">{Name}</h1>
                <div className="space-y-3 text-zinc-300">
                  <p className="text-lg">
                    <span className="text-red-500 font-semibold">Season:</span>{" "}
                    {seo}
                    <span className="mx-4">|</span>
                    <span className="text-red-500 font-semibold">
                      Episode:
                    </span>{" "}
                    {episode}
                  </p>
                  <p className="text-base leading-relaxed">{disc}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-600/80 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <>
                    <form onSubmit={handleSubmit}>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <span>❤️</span> Add to Favorites
                      </button>
                    </form>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          updateformdata();
                          setShowUpdateForm(!showUpdateForm);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      >
                        {showUpdateForm ? "Cancel Edit" : "Edit Video"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="bg-zinc-700/50 backdrop-blur-md p-4 rounded-lg">
                    <p className="text-white mb-3">
                      Sign in to add to favorites
                    </p>
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
                {downloadlink && (
                  <a
                    href={downloadlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <span>⬇️</span> Download
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Video Player and Episodes Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
                {/* Invisible overlay to block clicks on video */}
                <div className="absolute inset-0 z-20 bg-transparent pointer-events-none">
                  {/* Top-right corner blocker - blocks the redirect link */}
                  <div
                    className="absolute top-0 right-0 w-32 h-16 bg-black/0 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                <iframe
                  title="videoplayer"
                  className="w-full h-full relative z-10"
                  src={video}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>
            </div>

            {/* Episodes Sidebar */}
            <div className="bg-zinc-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
              {/* Seasons Toggle Button */}
              <div className="p-6 border-b border-zinc-700/50">
                <button
                  onClick={handleToggleSeasons}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>{showSeasons ? "▲" : "▼"}</span>
                  {showSeasons ? "Hide Seasons" : "Show All Seasons"}
                </button>
              </div>

              {/* Seasons List */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  showSeasons ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 py-4 border-b border-zinc-700/50">
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="text-red-500">📺</span>
                    All Seasons
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {data
                      .filter(
                        (item) =>
                          item.animename === name &&
                          item.quality === 720 &&
                          item.ep === 1
                      )
                      .sort((a, b) => a.season - b.season)
                      .map((item, index) => (
                        <Link
                          key={index}
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                          onClick={() => setShowSeasons(false)}
                        >
                          <div
                            className={`${
                              item.season == watchSeason
                                ? "bg-red-600 shadow-lg"
                                : "bg-zinc-700 hover:bg-zinc-600"
                            } p-3 rounded-lg transition-all my-1 cursor-pointer group flex items-center justify-between`}
                          >
                            <span className="text-white font-medium flex items-center gap-2">
                              <span className="text-xs bg-zinc-900/50 px-2 py-1 rounded">
                                S{item.season}
                              </span>
                              {item.seasonname || `Season ${item.season}`}
                            </span>
                            {item.season == watchSeason && (
                              <span className="text-white text-xs">▶</span>
                            )}
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>

              {/* Episodes List */}
              <div className="px-6 py-4">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2 sticky top-0 bg-zinc-800/95 py-2 z-10">
                  <span className="text-red-500">🎬</span>
                  Season {watchSeason} Episodes
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {data
                    .filter(
                      (item) =>
                        item.animename === name &&
                        item.quality === 720 &&
                        item.season === watchSeason
                    )
                    .sort((a, b) => a.ep - b.ep)
                    .map((item, index) => (
                      <Link
                        key={index}
                        to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                      >
                        <div
                          className={`${
                            item.ep == episode
                              ? "bg-red-600 shadow-lg scale-[1.02]"
                              : "bg-zinc-700 hover:bg-zinc-600 hover:scale-[1.01]"
                          } p-4 rounded-lg transition-all my-1 duration-200 cursor-pointer group flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                item.ep == episode
                                  ? "bg-white/20"
                                  : "bg-zinc-900/30"
                              }`}
                            >
                              <span className="text-white text-sm">
                                {item.ep}
                              </span>
                            </div>
                            <span className="text-white font-medium">
                              Episode {item.ep}
                            </span>
                          </div>
                          {item.ep == episode ? (
                            <span className="text-white text-sm font-semibold">
                              ▶ Playing
                            </span>
                          ) : (
                            <span className="text-zinc-400 text-xs group-hover:text-white transition-colors">
                              Watch →
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Update Form */}
          {isAuthenticated && isAdmin && showUpdateForm && (
            <div className="mt-8 bg-zinc-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Video Details
              </h2>
              <form onSubmit={updatevideohandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Link */}
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Video Link</label>
                    <input
                      type="text"
                      value={newformdata.videolink}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          videolink: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Anime Name */}
                  <div>
                    <label className="block text-white mb-2">Anime Name</label>
                    <input
                      type="text"
                      value={newformdata.animename}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          animename: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Season Name */}
                  <div>
                    <label className="block text-white mb-2">Season Name</label>
                    <input
                      type="text"
                      value={newformdata.seasonname}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          seasonname: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Season Number */}
                  <div>
                    <label className="block text-white mb-2">
                      Season Number
                    </label>
                    <input
                      type="number"
                      value={newformdata.season}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          season: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Episode */}
                  <div>
                    <label className="block text-white mb-2">Episode</label>
                    <input
                      type="number"
                      value={newformdata.ep}
                      onChange={(e) =>
                        setNewformdata({ ...newformdata, ep: e.target.value })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">
                      Thumbnail URL
                    </label>
                    <input
                      type="text"
                      value={newformdata.thumbnail}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          thumbnail: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Genres */}
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">
                      Genres (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newformdata.genres}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          genres: e.target.value.split(","),
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                      value={newformdata.description}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {/* Download Link */}
                  <div className="md:col-span-2">
                    <label className="block text-white mb-2">
                      Download Link
                    </label>
                    <input
                      type="text"
                      value={newformdata.download}
                      onChange={(e) =>
                        setNewformdata({
                          ...newformdata,
                          download: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Trending & Popular */}
                  <div className="flex gap-8">
                    <div>
                      <label className="block text-white mb-2">Trending</label>
                      <div className="flex gap-4">
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="trending"
                            checked={newformdata.trending === true}
                            onChange={() =>
                              setNewformdata({
                                ...newformdata,
                                trending: true,
                              })
                            }
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="trending"
                            checked={newformdata.trending === false}
                            onChange={() =>
                              setNewformdata({
                                ...newformdata,
                                trending: false,
                              })
                            }
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white mb-2">Popular</label>
                      <div className="flex gap-4">
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="popular"
                            checked={newformdata.popular === true}
                            onChange={() =>
                              setNewformdata({
                                ...newformdata,
                                popular: true,
                              })
                            }
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center text-white">
                          <input
                            type="radio"
                            name="popular"
                            checked={newformdata.popular === false}
                            onChange={() =>
                              setNewformdata({
                                ...newformdata,
                                popular: false,
                              })
                            }
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  Update Video
                </button>
              </form>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection
            animename={desiredPart[0]}
            season={desiredPart[1]}
            episode={desiredPart[2]}
            userdata={userdata}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Watch;
