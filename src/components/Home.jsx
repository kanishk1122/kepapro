import { useRef, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { detailsContext } from "../utils/Context";
import { Swiper, SwiperSlide } from "swiper/react";
import image from "../assets/public/images/peakpx.jpg"
import Cookies from 'js-cookie';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import axios from "../utils/Axios";

const Home = () => {
  const [data] = useContext(detailsContext); // State to hold the data
  const [resultsearch, setsearchResult] = useState();
  const [token, setToken] = useState(Cookies.get("token")); // State to hold the JWT string

  // Sort the data from newest to oldest
  const sortedData = data.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

  // Filter the newly added items to show only those added within the last 10 days
  const newlyAddedData = sortedData.filter(item => {
    const addedDate = new Date(item.addedDate);
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    return addedDate >= tenDaysAgo;
  });

  const divstyle = {
    background: `linear-gradient(#000000 50%, transparent 100%)`,
  };

  const divstyle1 = {
    background: `linear-gradient(to right,#00000099 75%, transparent 100%)`,
  };

  const clipPathStyle = {
    clipPath: "polygon(0 0, 84% 0, 75% 100%, 0% 100%)",
  };

  return (
    <>
      <div className="bg-neutral-900 w-full h-fit pb-[40px] text-white">
        <Navbar setsearchResult={setsearchResult} resultsearch={resultsearch} />
        {resultsearch == undefined || resultsearch == "" ? (
          <div>
            <div className="h-fit relative">
              <div
                style={divstyle}
                className="absolute w-full z-20 h-[10%] top-0 bg-black"
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
                {data.slice(0, 5).map((item, index) => (
                  <Link key={index} to={``}>
                    <SwiperSlide className="relative w-full h-full">
                      <Link
                        to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                      >
                        <div className="text-3xl bg-zinc-900 text-white relative w-full overflow-hidden h-[100%]">
                          <div className="w-full h-[100%] flex justify-between">
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
                                  <div className="flex px-[20%] flex-col justify-between h-full max-sm:p-10 p-20 bg-[rgba(0,0,0,0.8)]">
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
                                    <div className="w-full h-auto flex flex-wrap">
                                      <div className="bg-[rgba(0,0,0,0.5)] px-4 rounded-full backdrop-blur-[60px] text-[60%] py-2">
                                        Watch now
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <img
                                  className="w-full h-full object-cover"
                                  src={item.thumnail}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="w-[35%] max-sm:w-[70vw] h-full">
                              <img
                                className="w-full h-full object-cover"
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
            <hr className="p-3 m-1 border-transparent bottom-2 h-[-10px] rounded-full" />
            <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
              <h1 className="text-3xl font-semibold">Trending</h1>
              <div className="w-full h-fit rounded-lg overflow-hidden">
                <div className="scroll-ps-6 w-full h-fit flex overflow-x-auto">
                  <div
                    className="h-fit rounded-lg flex gap-4 overflow-auto flex-shrink-0"
                    style={{
                      width: "fitContent",
                      WebkitScrollbar: { display: "none" },
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    {data.map((item, index) =>
                      item.trending ? (
                        <Link
                          key={index}
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                        >
                          <div className="w-[40vw] h-[69vw] max-w-[300px] max-h-[500px] rounded-lg overflow-hidden object-cover relative">
                            <div className="absolute flex flex-col gap-5 duration-500 w-full h-full bg-[#00000099] text-white flex p-4 felx-col opacity-0 hover:opacity-100">
                              <h1 className="font-semibold">{item.animename}</h1>
                              <div className="w-[30vw] h-fit">
                                <div
                                  style={{ flexDirection: "row" }}
                                  className="w-full overflow-hidden h-fit"
                                >
                                  <div className="w-full" style={{ flexShrink: 0 }}>
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <Link
                                  to="/"
                                  className="bg-[rgba(255,0,0,0.5)] text-2xl backdrop-blur-lg rounded-lg p-2 w-fit px-6 font-semibold"
                                >
                                  Watch now
                                </Link>
                              </div>
                            </div>
                            <img
                              className="w-full h-full object-cover"
                              src={item.thumbnail}
                              alt=""
                            />
                          </div>
                        </Link>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr className="p-3 m-1 border-transparent bottom-2 h-[-10px] rounded-full" />
            <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
              <h1 className="text-3xl font-semibold">Newly Added</h1>
              <div className="w-full h-fit rounded-lg overflow-hidden">
                <div className="scroll-ps-6 w-full h-fit flex overflow-x-auto">
                  <div
                    className="h-fit rounded-lg flex gap-4 overflow-auto flex-shrink-0"
                    style={{
                      width: "fitContent",
                      WebkitScrollbar: { display: "none" },
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    {newlyAddedData.map((item, index) => (
                      <Link
                        key={index}
                        to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                      >
                        <div className="w-[40vw] h-[69vw] max-w-[300px] max-h-[500px] rounded-lg overflow-hidden object-cover relative">
                          <div className="absolute flex flex-col gap-5 duration-500 w-full h-full bg-[#00000099] text-white flex p-4 felx-col opacity-0 hover:opacity-100">
                            <h1 className="font-semibold">{item.animename}</h1>
                            <div className="w-[30vw] h-fit">
                              <div
                                style={{ flexDirection: "row" }}
                                className="w-full overflow-hidden h-fit"
                              >
                                <div className="w-full" style={{ flexShrink: 0 }}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <Link
                                to="/"
                                className="bg-[rgba(255,0,0,0.5)] text-2xl p-2 w-fit px-6 font-semibold rounded-lg"
                              >
                                Watch now
                              </Link>
                            </div>
                          </div>
                          <img
                            className="w-full h-full object-cover"
                            src={item.thumbnail}
                            alt=""
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <hr className="p-3 m-1 border-transparent bottom-2 h-[-10px] rounded-full" />
            <div className="h-fit w-full relative bg-transparent flex flex-col gap-4 p-4">
              <h1 className="text-3xl font-semibold">Recommended for you</h1>
              <div className="w-full h-fit rounded-lg overflow-hidden">
                <div className="scroll-ps-6 w-full h-fit flex overflow-x-auto">
                  <div
                    className="h-fit rounded-lg flex gap-4 overflow-auto flex-shrink-0"
                    style={{
                      width: "fitContent",
                      WebkitScrollbar: { display: "none" },
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    {data.map((item, index) =>
                      item.recommend == true ? (
                        <Link
                          key={index}
                          to={`/watch/${item.animename}/${item.season}/${item.ep}`}
                        >
                          <div className="w-[40vw] h-[69vw] max-w-[300px] max-h-[500px] rounded-lg overflow-hidden object-cover relative">
                            <div className="absolute flex flex-col gap-5 duration-500 w-full h-full bg-[#00000099] text-white flex p-4 felx-col opacity-0 hover:opacity-100">
                              <h1 className="font-semibold">{item.animename}</h1>
                              <div className="w-[30vw] h-fit">
                                <div
                                  style={{ flexDirection: "row" }}
                                  className="w-full overflow-hidden h-fit"
                                >
                                  <div className="w-full" style={{ flexShrink: 0 }}>
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                              <div className="">
                                <Link
                                  to="/"
                                  className="bg-[rgba(255,0,0,0.5)] text-2xl backdrop-blur-lg rounded-lg p-2 w-fit px-6 font-semibold"
                                >
                                  Watch now
                                </Link>
                              </div>
                            </div>
                            <img
                              className="w-full h-full object-cover"
                              src={item.thumbnail}
                              alt=""
                            />
                          </div>
                        </Link>
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-4 max-sm:grid-cols-2 max-[300px]:grid-cols-1 gap-3 m-5 max-sm:m-2">
              {resultsearch.map((item, index) => (
                <div
                  className="h-fit w-full p-3 m-1 border border-white rounded-lg flex flex-col gap-3 justify-start"
                  key={index}
                >
                  <div className="h-fit w-full">
                    <Link to={`/watch/${item.animename}/${item.season}/${item.ep}`}>
                      <img
                        className="object-cover w-full h-[30vh] max-sm:h-[20vh]"
                        src={item.thumbnail}
                        alt=""
                      />
                    </Link>
                  </div>
                  <div className="w-full h-fit flex flex-col gap-2 justify-start">
                    <div className="text-xl flex justify-start font-semibold">
                      {item.animename}
                    </div>
                    <div className="text-[75%] flex justify-start font-light">
                      {item.description}
                    </div>
                    <div className="w-full h-fit flex justify-start items-center">
                      <div className="bg-red-800 w-fit p-1 px-4 rounded-lg">Play</div>
                    </div>
                  </div>
                </div>
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
