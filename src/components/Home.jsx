import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { detailsContext } from "../utils/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import Cookies from "js-cookie";
import TextTransition, { presets } from "react-text-transition";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "../utils/Axios";

const Home = () => {
  const { data, allvidoedata, setallvidoedata } = useContext(detailsContext); // State to hold the JWT string
  const [resultsearch, setsearchResult] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchTimerRef = useRef(null);
  const searchCache = useRef(new Map());

  const [showcatemenu, setShowcatemenu] = useState(false);
  const [currentcategory, setcurrentcategory] = useState("Action");
  const [index, setIndex] = useState(0);

  // Memoize heavy derived lists so we don't recompute every render
  const trendingItems = useMemo(
    () =>
      data
        .filter((i) => i.trending)
        .slice()
        .reverse()
        .slice(0, 8),
    [data]
  );
  const popularItems = useMemo(
    () =>
      data
        .filter((i) => i.popular)
        .slice()
        .reverse()
        .slice(0, 8),
    [data]
  );

  const uniqueGenres = useMemo(() => {
    const allGenres = data.flatMap((item) =>
      item.genres.flatMap((genre) => genre.split("|").map((g) => g.trim()))
    );
    return [...new Set(allGenres)].map((g) =>
      g.replace(/\b\w/g, (c) => c.toUpperCase())
    );
  }, [data]);

  const currentDate = new Date();
  const date10DaysAgo = new Date(currentDate);
  date10DaysAgo.setDate(currentDate.getDate() - 10);

  // Filter the data to include only entries from the last 10 days
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.dou);
    return itemDate >= date10DaysAgo;
  });

  function findCurrentEpisodeNumber(content) {
    // Filter the video data based on the anime name
    const currentContent = allvidoedata.filter(
      (video) => video.animename === content.animename
    );

    // Extract the episode numbers
    const episodeNumbers = currentContent.map((video) => video.ep);

    // Find the maximum episode number
    const maxEpisodeNumber = Math.max(...episodeNumbers);

    return maxEpisodeNumber;
  }

  // Reverse the filtered data
  const reversedData = filteredData.slice().reverse();

  const showcategorymenu = () => {
    setShowcatemenu(() => !showcatemenu);
  };
  const allAction = data.filter((item) => item.genres.includes("Action"));

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Debounced search: smart delay (longer if last char is space) + caching
  useEffect(() => {
    // clear previous timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }

    const q = resultsearch || "";
    if (!q.trim()) {
      setSearchResults([]);
      setDebouncedQuery("");
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lastCharIsSpace = q.endsWith(" ");
    const delay = lastCharIsSpace ? 1200 : 800;

    searchTimerRef.current = setTimeout(async () => {
      const key = q.trim().toLowerCase();
      setDebouncedQuery(key);
      // return cached if exists
      if (searchCache.current.has(key)) {
        setSearchResults(searchCache.current.get(key));
        setIsSearching(false);
        return;
      }

      // local client-side filter (cheap) — avoids backend calls entirely if data is available
      const matches = data.filter((item) => {
        const hay = `${item.animename} ${item.description} ${item.genres.join(
          " "
        )}`.toLowerCase();
        return key.split(/\s+/).every((term) => term && hay.includes(term));
      });

      // cache and set
      searchCache.current.set(key, matches);
      setSearchResults(matches);
      setIsSearching(false);
    }, delay);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [resultsearch, data]);

  // Helper: show search UI when debouncedQuery exists
  const inSearchMode = Boolean(debouncedQuery);

  const divstyle = {
    background: `linear-gradient(#000000 50%, transparent 100%)`,
  };
  const divstyle1 = {
    background: `linear-gradient(to right,#00000099 75%, transparent 100%)`,
  };

  function settingcurrentcategoery(item) {
    setcurrentcategory(() => item);
    showcategorymenu();
  }

  useEffect(() => {
    const intervalId = setInterval(() => setIndex((index) => index + 1), 3000);
    return () => clearTimeout(intervalId);
  }, []);

  const verticalTextStyle = {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    writingMode: "vertical-lr",
    textOrientation: "right",
    whiteSpace: "nowrap",
    transform: "rotate(180deg)",
  };
  const clipPathStyle = {
    clipPath: "polygon(0 0, 84% 0, 75% 100%, 0% 100%)",
  }; // Expires in 7 days
  return (
    <>
      <div className="bg-neutral-900 w-full  h-fit pb-[40px] text-white">
        <Navbar setsearchResult={setsearchResult} resultsearch={resultsearch} />
        {!inSearchMode ? (
          <div>
            <div className="h-fit relative">
              <div
                style={divstyle}
                className="absolute w-full z-20  h-[10%] top-0 bg-black"
              ></div>
              <Swiper
                spaceBetween={10}
                centeredSlides={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-[80vh] z-1 max-sm:h-[50vh]"
              >
                {trendingItems.slice(0, 5).map((item) => {
                  const key = `${item.animename}-${item.season}-${item.ep}`;
                  return (
                    <Link key={key} to={``}>
                      <SwiperSlide className="relative w-full h-full">
                        <Link
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                        >
                          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                            {/* background image */}
                            <img
                              className="absolute inset-0 w-full h-full object-cover brightness-75"
                              src={item.thumnail}
                              alt={item.animename}
                              loading="lazy"
                            />
                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                            {/* content */}
                            <div className="relative z-10 p-8 md:p-16 flex flex-col justify-between h-full">
                              <div>
                                <span className="inline-block text-sm bg-red-600/80 px-3 py-1 rounded-full font-medium">
                                  Season {item.season}
                                </span>
                              </div>
                              <div>
                                <h2 className="text-3xl md:text-6xl font-bold leading-tight">
                                  {item.animename}
                                </h2>
                                <p className="mt-4 text-zinc-200 max-w-xl">
                                  {item.description?.slice(0, 160)}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-full">
                                  <svg
                                    className="w-5 h-5 text-yellow-400"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                  <span className="font-semibold">
                                    {item.rating}%
                                  </span>
                                </div>
                                <Link
                                  className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
                                  to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                                >
                                  Watch
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    </Link>
                  );
                })}
              </Swiper>
            </div>
            <div>
              {/* here is trending section   */}
              <hr className="p-3 m-1  border-transparent bottom-2 h-[-10px] rounded-full" />
              <div className="h-fit w-full relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col gap-8 p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-pink-500 bg-clip-text text-transparent  ">
                    Trending Now
                  </h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                </div>

                {/* Carousel Container */}
                <div className="w-full h-fit">
                  <div className="scroll-smooth w-full h-fit flex overflow-x-auto gap-6 py-12 snap-x snap-mandatory scroll-ps-6 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-700 [&::-webkit-scrollbar-thumb]:bg-red-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {/* Trending Items */}
                    {trendingItems.slice(0, 5).map((item) => {
                      const key = `${item.animename}-${item.season}-${item.ep}`;
                      return (
                        <Link
                          key={key}
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                          className="flex-shrink-0 snap-center group"
                        >
                          <div className="w-64 h-80 rounded-xl overflow-hidden shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-2">
                            {/* Card Container */}
                            <div className="relative w-full h-full overflow-hidden bg-slate-900">
                              {/* Image */}
                              <img
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={item.thumnail}
                                alt={item.animename}
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                                {/* Hover Content */}
                                <div className="flex flex-col gap-3">
                                  <h3 className="text-white font-bold text-lg line-clamp-2">
                                    {item.animename}
                                  </h3>
                                  <p className="text-slate-300 text-sm line-clamp-3">
                                    {item.description}
                                  </p>
                                </div>

                                {/* Watch Button */}
                                <button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                  <span>Watch Now</span>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Episode Badge */}
                              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                Ep {findCurrentEpisodeNumber(item)}
                              </div>

                              {/* Title Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                <h4 className="text-white font-bold text-base line-clamp-2">
                                  {item.animename}
                                </h4>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    {/* View All Card */}
                    <Link
                      to="/all/trending"
                      className="flex-shrink-0 snap-center group"
                    >
                      <div className="w-64 h-80 rounded-xl overflow-hidden shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
                          <div
                            className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>

                        {/* Content */}
                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 p-6">
                          <div className="text-center">
                            <h3 className="text-white font-bold text-3xl md:text-4xl">
                              Explore
                            </h3>
                            <p className="text-red-100 text-sm mt-2">
                              More Trending
                            </p>
                          </div>

                          {/* Arrow Icon */}
                          <div className="bg-white/20 backdrop-blur-lg p-4 rounded-full group-hover:bg-white/30 transition-all duration-300 transform group-hover:translate-x-1">
                            <svg
                              className="w-8 h-8 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* here is popular section */}
              <hr className="p-3 mt-3 border-zinc-500 h-[1px] rounded-full" />
              <section className="w-full bg-neutral-900 px-4  ">
                <div className=" mx-auto space-y-8">
                  {/* Header */}
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-black text-white">
                      Popular Picks
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Fan favorites and most watched
                    </p>
                    <div className="h-1 w-12 bg-red-500 rounded-full"></div>
                  </div>

                  {/* Carousel */}
                  <div className="overflow-x-auto scrollbar-hide ">
                    <div className="flex gap-6 py-8 snap-x snap-mandatory">
                      {popularItems.slice(0, 5).map((item) => (
                        <PopularCard
                          key={`${item.animename}-${item.season}-${item.ep}`}
                          item={item}
                          findCurrentEpisodeNumber={findCurrentEpisodeNumber}
                        />
                      ))}

                      {/* View All Card */}
                      <Link
                        to="/all/popular"
                        className="flex-shrink-0 snap-center group"
                      >
                        <div className="min-w-64 h-72 rounded-xl bg-gradient-to-br from-orange-600 to-orange-800 overflow-hidden shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-2 relative flex items-center justify-center p-6">
                          <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black text-white">
                              Browse All
                            </h3>
                            <svg
                              className="w-8 h-8 text-white mx-auto animate-bounce"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="p-3 mt-3 border-transparent h-[1px] rounded-full" />
              <div className="h-fit w-full relative bg-transparent flex flex-col gap-8 p-6">
                {/* Newly Added Section */}
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    Newly Added
                  </h2>
                  <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {reversedData.map((item) =>
                      item.new === true
                        ? (() => {
                            const key = `${item.animename}-${item.season}-${item.ep}`;
                            return (
                              <Link
                                key={key}
                                to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                              >
                                <div className="group relative h-[340px] flex flex-col rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/20">
                                  <div className="relative w-full h-[70%] overflow-hidden">
                                    <img
                                      src={item.thumnail}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                      alt=""
                                    />
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                      NEW
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                                  </div>
                                  <div className="w-full h-[30%] flex items-center justify-center text-center px-4">
                                    <p className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                                      {item.animename}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })()
                        : null
                    )}
                  </div>
                </div>

                {/* Genres Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                      <TextTransition springConfig={presets.wobbly}>
                        {currentcategory.toString()}
                      </TextTransition>
                    </h2>
                    <div className="relative flex items-center">
                      <button
                        onClick={showcategorymenu}
                        className="group flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-200"
                      >
                        <span className="text-sm font-medium">
                          Change Genre
                        </span>
                        <div
                          className={`w-5 h-5 duration-200 ${
                            showcatemenu ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <svg viewBox="0 0 24 24" fill="white">
                            <path d="M12 16L6 10H18L12 16Z"></path>
                          </svg>
                        </div>
                      </button>
                      <div
                        className={`absolute duration-300 overflow-hidden ${
                          showcatemenu
                            ? "h-[60vh] w-[280px] max-md:w-[90vw] px-4 py-4 opacity-100"
                            : "h-0 w-0 opacity-0"
                        } left-0 top-14 max-md:left-1/2 max-md:-translate-x-1/2 bg-zinc-800/95 backdrop-blur-lg rounded-2xl shadow-2xl z-50 border border-zinc-700`}
                      >
                        <div className="h-full overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                          {uniqueGenres.map((genre) => (
                            <div
                              onClick={() => settingcurrentcategoery(genre)}
                              className={`flex justify-center items-center rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                                currentcategory === genre
                                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                  : "bg-zinc-700 hover:bg-zinc-600 text-gray-200"
                              }`}
                              key={genre}
                            >
                              <p className="text-base font-semibold capitalize">
                                {genre}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {data
                      .filter((item) => item.genres.includes(currentcategory))
                      .map((item) => {
                        const key = `${item.animename}-${item.season}-${item.ep}`;
                        return (
                          <Link
                            key={key}
                            to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                          >
                            <div className="group relative h-[380px] flex flex-col rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20">
                              <div className="relative w-full h-[75%] overflow-hidden">
                                <img
                                  src={item.thumnail}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                              </div>
                              <div className="w-full h-[25%] flex flex-col items-center justify-center text-center px-4 space-y-1">
                                <p className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                                  {item.animename}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Season {item.season}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

                {/* All Section */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
                    All Anime
                  </h1>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.map((item) => {
                      const key = `${item.animename}-${item.season}-${item.ep}`;
                      return (
                        <Link
                          key={key}
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                        >
                          <div className="group h-[220px] flex gap-4 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 p-4">
                            <div className="w-[35%] flex flex-col gap-2">
                              <div className="w-full h-[70%] rounded-xl overflow-hidden shadow-md">
                                <img
                                  src={item.thumnail}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  alt=""
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                                  {item.animename}
                                </p>
                              </div>
                            </div>
                            <div className="w-[65%] flex flex-col justify-between py-2">
                              <div className="space-y-2">
                                <p className="flex items-center gap-2">
                                  <span className="text-red-500 text-xl font-bold">
                                    Season:
                                  </span>
                                  <span className="text-2xl font-bold text-white">
                                    {item.season}
                                  </span>
                                </p>
                                <p className="text-gray-300 text-sm line-clamp-3">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors">
                                <span>Watch Now</span>
                                <svg
                                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-5 min-h-[50vh]">
            <div className="w-full p-1 gap-6 rounded flex-wrap flex h-fit">
              {isSearching ? (
                <div className="w-full flex flex-col items-center justify-center py-16">
                  {/* Loading Spinner */}
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-zinc-400 text-lg font-medium">
                    Searching...
                  </p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Finding the best anime for you
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-16">
                  {/* Empty State */}
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-zinc-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Results Found
                  </h3>
                  <p className="text-zinc-400 text-center max-w-md">
                    We couldn't find any anime matching{" "}
                    <span className="text-red-400 font-semibold">
                      "{debouncedQuery}"
                    </span>
                  </p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="w-full mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Search Results
                        <span className="ml-3 text-sm font-normal text-zinc-400">
                          {searchResults.length}{" "}
                          {searchResults.length === 1 ? "result" : "results"}{" "}
                          found
                        </span>
                      </h2>
                    </div>
                  </div>

                  {/* Results Grid */}
                  {searchResults.map((filteredItem, index) => {
                    const key = `${filteredItem.animename}-${filteredItem.season}-${filteredItem.ep}`;
                    return (
                      <Link
                        key={key}
                        to={`/watch/${filteredItem.animename}/${filteredItem.season}/1`}
                        className="block"
                      >
                        <div className="group relative w-[160px] md:w-[180px] h-[320px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/20">
                          {/* Image Container */}
                          <div className="relative w-full h-[65%] overflow-hidden">
                            <img
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              src={filteredItem.thumnail}
                              alt={filteredItem.animename}
                              loading="lazy"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <svg
                                  className="w-6 h-6 text-white ml-1"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>

                            {/* Episode Badge */}
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
                              EP {filteredItem.ep}
                            </div>

                            {/* Season Badge */}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                              S{filteredItem.season}
                            </div>
                          </div>

                          {/* Content Container */}
                          <div className="relative w-full h-[35%] p-4 flex flex-col justify-between">
                            {/* Title */}
                            <h2 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">
                              {filteredItem.animename}
                            </h2>

                            {/* Info & Watch Button */}
                            <div className="space-y-2">
                              <p className="text-xs text-zinc-400 font-medium">
                                Season {filteredItem.season} • Episode{" "}
                                {filteredItem.ep}
                              </p>
                              <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 transition-colors">
                                <span className="text-xs font-semibold">
                                  Watch Now
                                </span>
                                <svg
                                  className="w-3 h-3 group-hover:translate-x-1 transition-transform"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;

function PopularCard({ item, findCurrentEpisodeNumber }) {
  return (
    <Link
      to={`/watch/${item.animename}/${item.season}/${item.ep}`}
      className="flex-shrink-0 snap-center group"
    >
      <div className="min-w-64 h-72 rounded-xl overflow-hidden shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-2 bg-zinc-800">
        <div className="relative w-full h-full overflow-hidden flex">
          {/* Episode Side */}
          <div className="w-16 h-full bg-black flex items-end justify-end p-3">
            <div className="text-yellow-400 font-bold text-sm writing-vertical-rl rotate-180">
              Ep {findCurrentEpisodeNumber(item)}
            </div>
          </div>

          {/* Image and Info */}
          <div className="flex-1 relative overflow-hidden">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={item.thumnail}
              alt={item.animename}
              loading="lazy"
            />

            {/* Hover Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div>
                <h3 className="text-white font-bold text-lg line-clamp-2">
                  {item.animename}
                </h3>
              </div>
              <div className="space-y-3">
                <p className="text-zinc-300 text-xs line-clamp-2">
                  {item.description}
                </p>
                <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition-all duration-300">
                  Watch Now
                </button>
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <h4 className="text-white font-bold text-sm">{item.animename}</h4>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
