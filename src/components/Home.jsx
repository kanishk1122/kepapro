import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { detailsContext } from "../utils/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import Cookies from "js-cookie";
import TextTransition, { presets } from 'react-text-transition';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "../utils/Axios";

const Home = () => {
  const { data, allvidoedata, setallvidoedata } = useContext(detailsContext); // State to hold the JWT string
  const [resultsearch, setsearchResult] = useState();
  const [showcatemenu, setShowcatemenu] = useState(false);
  const [currentcategory, setcurrentcategory] = useState("Action");
  const [index, setIndex] = useState(0);
  console.log(Cookies.get("token"));

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
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  //  Extract genres
const allGenres = data.flatMap((item) =>
  item.genres.flatMap((genre) =>
    genre
      .split("|")
      .map((g) => capitalize(g.trim()))
  )
);

  // Step 2: Remove duplicates using a Set
  const uniqueGenres = [...new Set(allGenres)];

  const divstyle = {
    background: `linear-gradient(#000000 50%, transparent 100%)`,
  };
  const divstyle1 = {
    background: `linear-gradient(to right,#00000099 75%, transparent 100%)`,
  };

  function settingcurrentcategoery (item){
    setcurrentcategory(()=>item)
    showcategorymenu()
  }


useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000, // every 3 seconds
    );
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
        {resultsearch == undefined || resultsearch == "" ? (
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
                {data
                  .filter((item) => item.trending)
                  .reverse()
                  .slice(0, 5)
                  .map((item, index) => (
                    <Link key={index} to={``}>
                      <SwiperSlide className="relative w-full h-full  ">
                        <Link
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                        >
                          <div className="text-3xl bg-zinc-900 text-white relative w-full overflow-hidden h-[100%]  ">
                            <div className="w-full h-[100%]  flex justify-between">
                              <div className="w-[65%] h-[100%] relative">
                                <div className="w-full h-[100%] flex justify-start">
                                  <div
                                    className="w-[90vw] h-[100%] max-sm:w-[150%] overflow-hidden"
                                    style={{
                                      ...clipPathStyle,
                                      position: "absolute",
                                      backdropFilter: "blur(30px)",
                                    }}
                                  >
                                    <div className="flex px-[20%] flex-col  justify-between h-full max-sm:p-10   p-20 bg-[rgba(0,0,0,0.8)]">
                                      <div className="flex flex-col gap-3">
                                        <p>season {item.season}</p>
                                        <h1 className="text-[6vw] leading-[7vw] font-semibold">
                                          {item.animename}
                                        </h1>
                                      </div>
                                      <div className="flex gap-3 justify-self-start items-center shrink-0">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          className="w-[10vw] h-[10vw] max-h-[50px]"
                                          version="1.1"
                                          viewBox="0 0 47.94 47.94"
                                          xmlSpace="preserve"
                                        >
                                          <path
                                            style={{ fill: "#ED8A19" }}
                                            d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956C22.602,0.567,25.338,0.567,26.285,2.486z"
                                          />
                                        </svg>
                                        <pre className="font-semibold text-2xl">
                                          {item.rating}%
                                        </pre>
                                      </div>
                                      <div className="w-full h-auto  flex flex-wrap">
                                        <div className="bg-[rgba(0,0,0,0.5)] px-4 rounded-full backdrop-blur-[60px] text-[60%]  py-2">
                                          Watch now
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <img
                                    className=" w-full h-full object-cover"
                                    src={item.thumnail}
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="w-[35%] max-sm:w-[70vw] h-full">
                                <img
                                  className="w-full  h-full object-cover"
                                  src={item.thumnail}
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    </Link>
                  ))}
              </Swiper>
            </div>
            <div>
              {/* here is trending section   */}
              <hr className="p-3 m-1  border-transparent bottom-2 h-[-10px] rounded-full" />
              <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
                <h2 className="text-3xl font-semibold">Trending</h2>
                <div className="w-full h-fit rounded-lg overflow-hidden">
                  <div className="scroll-ps-6 w-full h-fit flex  overflow-x-auto">
                    <div
                      className="h-fit rounded-lg  flex gap-4 overflow-auto flex-shrink-0"
                      style={{
                        width: "fitContent",
                        WebkitScrollbar: { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                      }}
                    >
                      {data
                        .reverse()
                        .filter((item) => item.trending)
                        .slice(0, 5)
                        .map((item, index) => (
                          <Link
                            key={index}
                            to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                          >
                            <div className="w-[50vw] h-[69vw] max-w-[300px] overflow-hidden max-h-[500px] rounded-lg  object-cover relative flex ">
                              <div className="w-[10vw] h-full bg-black ">
                                <div
                                  className="text-white flex p-3 w-full h-full justify-end items-end  text-end"
                                  style={verticalTextStyle}
                                >
                                  <div className="text-yellow-500 font-semibold max-md:text-[100%] text-2xl ">
                                    Episode : {findCurrentEpisodeNumber(item)}
                                    {console.log(findCurrentEpisodeNumber(item))}
                                  </div>
                                </div>
                              </div>
                              <div className="w-[40vw] h-[69vw] max-w-[300px] ml-[-1.3vw] max-h-[500px] rounded-lg overflow-hidden object-cover relative">
                                <div className="absolute flex flex-col overflow-hidden gap-5 duration-500 w-full h-full bg-[#00000099] text-white  p-4 felx-col opacity-0 hover:opacity-100  ">
                                  <h1 className="font-semibold">
                                    {item.animename}
                                  </h1>
                                  <div className="w-[30vw] h-fit ">
                                    <div
                                      style={{ flexDirection: "row" }}
                                      className="w-[50%] overflow-hidden h-fit"
                                    >
                                      <div
                                        className="w-full"
                                        style={{ flexShrink: 0 }}
                                      >
                                        {item.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="">
                                    <Link
                                      to="/"
                                      className="bg-[rgba(255,0,0,0.5)] text-2xl backdrop-blur-lg rounded-full px-4 py-1 "
                                    >
                                      {" "}
                                      watch now{" "}
                                    </Link>
                                  </div>
                                </div>
                                <img
                                  className="w-full h-full rounded-lg object-cover"
                                  src={item.thumnail}
                                  alt=""
                                />
                                <div className="absolute  overflow-hidden text-center top-3/4 text-3xl font-semibold max-md:text-[4vw] text-white left-0 z-20 w-full h-2/3 bg-[#000000a6] backdrop-blur-lg">
                                  {item.animename}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}

                      <card className="w-[40vw]  max-w-[300px] max-h-[200px]rounded-lg overflow-hidden object-cover relative">
                        <Link to="/all/trending">
                          <div className="absolute flex flex-col items-center gap-[1vw] justify-center  duration-500 w-full h-full bg-[#00000099] text-white felx p-4 felx-col opacity-100   ">
                            <h1 className="text-[10vw]">View all</h1>
                            <div className="mt-[20px]">
                              <Link
                                to="/"
                                className=" backdrop-blur-lg rounded-full text-3xl px-4 py-1 mt-[10px]"
                              >
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="64"
                                  height="64"
                                  fill="currentColor"
                                >
                                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </Link>
                      </card>
                    </div>
                  </div>
                </div>
              </div>

              {/* here is popular section */}
              <hr className="p-3 mt-3 border-zinc-500 h-[1px] rounded-full" />
              <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
                <h2 className="text-3xl font-semibold">Populer</h2>
                <div className="w-full h-fit rounded-lg overflow-hidden">
                  <div className="scroll-ps-6 w-full h-fit flex  overflow-x-auto">
                    <div
                      className="h-fit rounded-lg  flex gap-4 overflow-auto flex-shrink-0"
                      style={{
                        width: "fitContent",
                        WebkitScrollbar: { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                      }}
                    >
                      {data
                        .filter((item) => item.popular)
                        .reverse()
                        .slice(0, 5)
                        .map((item, index) => (
                          <Link
                            key={index}
                            to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                          >
                            <div className="w-[50vw] h-[69vw] max-w-[300px] overflow-hidden max-h-[500px] rounded-lg  object-cover relative flex ">
                              <div className="w-[10vw] h-full bg-black ">
                                <div
                                  className="text-white flex p-3 w-full h-full justify-end items-end  text-end"
                                  style={verticalTextStyle}
                                >
                                  <div className="text-yellow-500 font-semibold max-md:text-[100%] text-2xl ">
                                    Episode : {findCurrentEpisodeNumber(item)}
                                  </div>
                                </div>
                              </div>
                              <div className="w-[40vw] h-[69vw] max-w-[300px] ml-[-1.3vw] max-h-[500px] rounded-lg overflow-hidden object-cover relative">
                                <div className="absolute flex flex-col overflow-hidden gap-5 duration-500 w-full h-full bg-[#00000099] text-white  p-4 felx-col opacity-0 hover:opacity-100  ">
                                  <h1 className="font-semibold">
                                    {item.animename}
                                  </h1>
                                  <div className="w-[30vw] h-fit ">
                                    <div
                                      style={{ flexDirection: "row" }}
                                      className="w-[50%] overflow-hidden h-fit"
                                    >
                                      <div
                                        className="w-full"
                                        style={{ flexShrink: 0 }}
                                      >
                                        {item.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="">
                                    <Link
                                      to="/"
                                      className="bg-[rgba(255,0,0,0.5)] text-2xl backdrop-blur-lg rounded-full px-4 py-1 "
                                    >
                                      {" "}
                                      watch now{" "}
                                    </Link>
                                  </div>
                                </div>
                                <img
                                  className="w-full h-full rounded-lg object-cover"
                                  src={item.thumnail}
                                  alt=""
                                />
                                <div className="absolute  overflow-hidden text-center top-3/4 text-3xl max-md:text-[4vw] font-semibold text-white left-0 z-20 w-full h-2/3 bg-[#000000a6] backdrop-blur-lg">
                                  {item.animename}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}

                      <card className="w-[40vw]  max-w-[300px] max-h-[200px]rounded-lg overflow-hidden object-cover relative">
                        <Link to="/all/trending">
                          <div className="absolute flex flex-col items-center gap-[1vw] justify-center  duration-500 w-full h-full bg-[#00000099] text-white felx p-4 felx-col opacity-100   ">
                            <h1 className="text-[10vw]">View all</h1>
                            <div className="mt-[20px]">
                              <Link
                                to="/"
                                className=" backdrop-blur-lg rounded-full text-3xl px-4 py-1 mt-[10px]"
                              >
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="64"
                                  height="64"
                                  fill="currentColor"
                                >
                                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                                </svg>
                              </Link>
                            </div>
                          </div>
                        </Link>
                      </card>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="p-3 mt-3 border-transparent h-[1px] rounded-full" />
              <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
                {/* here is newly added section */}
                <h2 className="text-3xl font-semibold">newly added</h2>
                <div className="w-full flex flex-wrap gap-4 h-fit p-3 ">
                  {reversedData.map((item, index) =>
                    item.new === true ? (
                      <Link
                        key={index}
                        to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                      >
                        <div
                          key={index}
                          className="h-[28vw] min-h-[160px] min-w-[140px] flex justify-center items-center flex-col rounded-lg overflow-hidden w-[20vw] bg-zinc-700"
                        >
                          <div className="w-full h-2/3 rounded bg-black">
                            <img
                              src={item.thumnail}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div className="w-full h-1/3 text-center pt-3 text-[3vw]  font-semibold ">
                            {item.animename}
                          </div>
                        </div>
                      </Link>
                    ) : null
                  )}
                </div>

                {/* here his genres section */}
                <div className="w-full relative h-fit flex px-9 items-center flex-wrap">
                  {" "}
                  <h2 className="text-3xl text-transform: capitalize font-semibold ">
                  <TextTransition springConfig={presets.wobbly}>{currentcategory.toString()}</TextTransition>
                    {}
                  </h2>{" "}
                  <div className="flex felx-col justify-center items-center">
                    <button onClick={showcategorymenu}>
                      <div
                        className={`w-10 h-10 duration-200 ${
                          showcatemenu ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <svg viewBox="0 0 24 24" rotate={90} fill="white">
                          <path d="M12 16L6 10H18L12 16Z"></path>
                        </svg>
                      </div>
                    </button>
                    <div className={`bg-zinc-700 duration-300 overflow-hidden ${showcatemenu? 'h-[50vh] w-[20vw] max-md:w-full' : 'h-0 w-0'} absolute left-[30%] max-md:left-0 max-md:top-[5vh] top-1/2  rounded-2xl gap-1 text-center px-3 py-3 flex flex-col justify-center items-start`}>
                      {uniqueGenres.map((item, index) => (
                        <div
                        onClick={() =>  settingcurrentcategoery(item.toString())}

                          className={`flex overflow-hidden  justify-center items-center text-center rounded-2xl px-2 bg-zinc-400 ${showcatemenu? 'h-[50vh] w-full' : 'h-0 w-0'} py-2`}
                          key={index}
                        >
                          <div className="flex justify-center  max-md:text-2xl items-center text-2xl  w-full h-3xl max-md:h-2xl   py-2 lowercase"><p className="text-center cursor-pointer">{item}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div></div>{" "}
                </div>
                <div className="w-full flex flex-wrap gap-4 h-fit p-3 ">
                  {data
                    .filter((item) => item.genres.includes(currentcategory))
                    .map((item, index) => (
                      <Link
                        key={index}
                        to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                      >
                        <div
                          key={index}
                          className="h-[28vw] min-h-[260px] min-w-[140px] flex justify-center items-center flex-col rounded-lg overflow-hidden w-[20vw] bg-zinc-700"
                        >
                          <div className="w-full h-[78%] mt-[-10px] rounded bg-black">
                            <img
                              src={item.thumnail}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div className="w-full h-[2/3] text-center pt-3  max-md:text-[3vw] text-2xl flex flex-col font-semibold ">
                            {item.animename}
                            <p>season: {item.season} </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>

                <hr className="p-3 mt-3 border-transparent h-[1px] rounded-full" />
                <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4"></div>
                <h1 className="text-3xl font-semibold">ALL</h1>
                <div className="w-full flex flex-wrap gap-2 h-fit p-3 ">
                  {data.sort().map((item, index) => (
                    <Link
                      key={index}
                      to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                    >
                      <div
                        
                        className="h-[28vw] min-h-[160px] p-3  min-w-[300px] w-[45vw]  justify-start items-center flex gap-2 flex-shrink-0 rounded-lg overflow-hidden  "
                      >
                        <div className="flex flex-col justify-center items-end  w-[40%] h-full"><div className="w-full h-2/3 rounded-3xl mt-[-10px] overflow-hidden bg-black">
                          <img
                            src={item.thumnail}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="w-full h-1/3 text-center pt-3  max-md:text-[3vw] text-2xl flex flex-col font-semibold ">

                          {item.animename}
                        </div>
                        <div>
                          
                        </div>
                        
                        </div>
                        <div className="w-2/3 h-full flex flex-col justify-start items-start p-3  ">
                          
                          <p><span className="text-red-500 text-3xl font-semibold">season :</span> <span className=" text-3xl font-semibold" >{item.season}</span> </p>
                        <p>{item.description}</p>
                        <div className=" text-2xl text-center">Watch NOW</div>
                        </div>

                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-5 h-fit   ">
            <div className="w-full p-1 gap-9  rounded flex-wrap flex  h-fit">
              {data
                .filter((item) =>
                  item.animename
                    .toLowerCase()
                    .includes(resultsearch.toLowerCase())
                )
                .map((filteredItem, index) => (
                  <Link
                    key={index}
                    to={`/watch/${filteredItem.animename}/${filteredItem.season}/1`}
                  >
                    <div className="w-fit max-w-[140px] flex flex-col h-[30vh] rounded-lg justify-center items-center bg-zinc-800 p-3">
                      {/* Render your item details here */}
                      <div className="w-full h-[200px] rounded  overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={filteredItem.thumnail}
                          alt={filteredItem.animename}
                        />
                      </div>
                      <h2 className="font-semibold">
                        {filteredItem.animename}
                      </h2>
                      <p>Watch now</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
