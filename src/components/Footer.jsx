import React, { useState } from "react";
import { Link } from "react-router-dom";
import smallgirl2 from "../assets/public/images/smallgirl.png";

const Footer = () => {
  const [smallgirl, setsmallgirl] = useState(smallgirl2);
  const [temp, setTemp] = useState("");

  return (
    <footer className="relative w-full bg-gradient-to-b from-black via-zinc-900 to-black text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Left: Branding & Message */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-black text-3xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                kepapro
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your ultimate destination for streaming anime. Discover, watch,
              and enjoy thousands of episodes.
            </p>
            <div className="flex gap-4">
              <Link
                to="https://t.me/+seOVVsx7hywzZGU1"
                target="_blank"
                className="group relative p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 240 240"
                  className="relative z-10"
                >
                  <path
                    d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z"
                    fill="#fff"
                  />
                </svg>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </Link>
             
            </div>
          </div>

          {/* Center: Character & Message */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <img
                src={smallgirl}
                alt="Anime Character"
                className="relative w-32 h-32 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Still haven't found anything interesting?
              </h3>
              <p className="text-zinc-500 text-sm">
                Explore our vast collection of anime series
              </p>
            </div>
          </div>

          {/* Right: Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/all/popular"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-all group"
              >
                <svg
                  className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                Popular
              </Link>
              <Link
                to="/all/trending"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-all group"
              >
                <svg
                  className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 2L3 14h9l-2 8 10-12h-9z" />
                </svg>
                Trending
              </Link>
              <Link
                to="/news"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-all group"
              >
                <svg
                  className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
                News
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-all group"
              >
                <svg
                  className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                About
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 mb-8 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2024 kepapro</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
    </footer>
  );
};

export default Footer;
