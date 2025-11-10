import {
  useRef,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link, NavLink } from "react-router-dom";
import "../assets/public/css/navbar.css";
import { detailsContext } from "../utils/Context";
import Cookies from "js-cookie";
import axios from "../utils/Axios.jsx";

axios.defaults.withCredentials = true;

const Navbar = ({ setsearchResult, resultsearch }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, setData, result, setResult } = useContext(detailsContext);
  const [styles, setStyles] = useState({ o: 0, t: "scale(0)" });
  const [CursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState(false);
  const [temp, setTemp] = useState(false);
  const [showmenu, setshowmenu] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userdata, setUserData] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [content, setContent] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchSession = async () => {
      try {
        const res = await axios.get("/session");
        if (!mounted) return;
        if (res.data && res.data.authenticated) {
          setUserData(res.data.user || {});
          setIsAuthenticated(true);
        } else {
          setUserData({});
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUserData({});
        setIsAuthenticated(false);
      }
    };

    fetchSession();

    const onAuthChange = () => fetchSession();
    window.addEventListener("storage", onAuthChange);
    window.addEventListener("authChange", onAuthChange);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("authChange", onAuthChange);
    };
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const updateCursorPosition = useCallback((e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", updateCursorPosition);
    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
    };
  }, [updateCursorPosition]);

  const handleMouseEnter = useCallback(() => {
    setStyles({ o: 1, t: "scale(1)" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyles({ o: 0, t: "scale(0)" });
  }, []);

  const submitHandler = useCallback((e) => {
    e.preventDefault();
  }, []);

  const textcolor = {
    background:
      "linear-gradient(90deg, rgba(194,78,92,1) 0%, rgba(121,9,19,1) 13%, rgba(242,6,33,1) 27%, rgba(168,69,82,1) 56%, rgba(243,6,42,1) 70%, rgba(255,50,80,1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Logout error", e);
    } finally {
      try {
        localStorage.setItem("auth", Date.now().toString());
        window.dispatchEvent(new Event("authChange"));
      } catch (e) {}
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Left: Menu Button (Mobile) + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsChecked(!isChecked)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-white transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isChecked ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-all"
              style={textcolor}
            >
              <span className="font-black text-xl md:text-2xl">kepapro</span>
            </NavLink>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/all/popular"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Popular
            </NavLink>
            <NavLink
              to="/all/trending"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-2 8 10-12h-9z" />
              </svg>
              Trending
            </NavLink>
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                }`
              }
            >
              News
            </NavLink>
          </div>

          {/* Right: Search + Profile */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearch(!search)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5 text-zinc-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Profile Button */}
            <div ref={profileMenuRef} className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {userdata.userpic ? (
                  <img
                    src={userdata.userpic}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-700"
                    alt="user"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {userdata.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden md:block text-sm text-white max-w-[100px] truncate">
                  {userdata.username || "Guest"}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900/98 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800 overflow-hidden bg-slate-800/70">
                  <div className="p-4 border-b border-zinc-800 bg-gradient-to-br from-zinc-800/50 to-transparent">
                    <div className="flex items-center gap-3">
                      {userdata.userpic ? (
                        <img
                          src={userdata.userpic}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500"
                          alt="user"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                          {userdata.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {userdata.username || "Guest User"}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {userdata.email || "guest@kepapro.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 ">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to={`/user/${encodeURIComponent(
                            userdata.email || ""
                          )}`}
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z" />
                          </svg>
                          Profile
                        </Link>

                        <hr className="my-2 border-zinc-800" />
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
                          </svg>
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
                          </svg>
                          Sign Up
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z" />
                          </svg>
                          Login
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            search ? "max-h-20 border-t border-zinc-800" : "max-h-0"
          }`}
        >
          <div className="p-4">
            <form onSubmit={submitHandler} className="relative">
              <input
                type="text"
                value={resultsearch}
                onChange={(e) => setsearchResult(e.target.value)}
                placeholder="Search anime..."
                className="w-full px-4 py-3 pl-12 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                autoFocus
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isChecked ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isChecked ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsChecked(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[280px] bg-zinc-900 shadow-2xl transition-transform duration-300 ${
            isChecked ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-zinc-800 bg-gradient-to-br from-red-500/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="rgba(255,255,255,0.05)"
                    />
                    <path
                      d="M7 12l3 3 7-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-red-500"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                </div>
                <span className="font-black text-xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  kepapro
                </span>
              </div>
              <button
                onClick={() => setIsChecked(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-zinc-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            <NavLink
              to="/"
              onClick={() => setIsChecked(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Home
            </NavLink>

            <NavLink
              to="/all/popular"
              onClick={() => setIsChecked(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.3l6.18 3.7-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Popular
            </NavLink>

            <NavLink
              to="/all/trending"
              onClick={() => setIsChecked(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-2 8 10-12h-9z" />
              </svg>
              Trending
            </NavLink>

            <NavLink
              to="/news"
              onClick={() => setIsChecked(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
              News
            </NavLink>

            {isAuthenticated && (
              <>
                <div className="pt-4 pb-2">
                  <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4">
                    Your Account
                  </div>
                </div>
                <NavLink
                  to={"/user/" + encodeURIComponent(userdata.email || "")}
                  onClick={() => setIsChecked(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-800 hover:text-white font-medium transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0H4z" />
                  </svg>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* Bottom Action */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-zinc-900">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsChecked(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl font-medium transition-all"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
                </svg>
                Sign Out
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/register"
                  onClick={() => setIsChecked(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsChecked(false)}
                  className="block w-full text-center px-4 py-3 bg-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-700 transition-all"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
