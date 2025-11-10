import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { detailsContext } from "../utils/Context";
import { Link, useParams } from "react-router-dom";

const AllAnime = () => {
  const { type } = useParams();
  const { data } = useContext(detailsContext);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = () => {
      if (data.length === 0) {
        return; // Return if data is empty
      }
      // Filter data based on type
      const filteredByType = data.filter(
        (item) => item.season === 1 && item.trending === true
      );
      setFilteredData(filteredByType);
    };

    filterData(); // Call filter function
  }, [data, type]); // Add data and type as dependencies

  return (
    <>
      <Navbar />
      <div className="p-3 flex gap-10 flex-wrap">
        {filteredData.map((item, index) => (
          <Link
            key={index}
            to={`/watch/${item.animename}/${item.season}/${item.ep}`}
          >
            <div className="group relative w-[40vw] max-w-[200px] h-[350px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/20">
              {/* Image Container */}
              <div className="relative w-full h-[70%] overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={item.thumnail}
                  alt={item.animename}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

                {/* Play Button Overlay (appears on hover) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Episode Badge */}
                {item.ep && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                    EP {item.ep}
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="relative w-full h-[30%] p-4 flex flex-col justify-between">
                {/* Title */}
                <h2 className="text-white font-bold text-base line-clamp-2 group-hover:text-red-400 transition-colors">
                  {item.animename}
                </h2>

                {/* Season Info & Watch Button */}
                <div className="flex items-center justify-between mt-2">
                  {item.season && (
                    <span className="text-xs text-zinc-400 font-medium">
                      Season {item.season}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-red-400 group-hover:text-red-300 transition-colors">
                    <span className="text-xs font-semibold">Watch</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default AllAnime;
