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
// Ensure axios sends credentials (cookies)
axios.defaults.withCredentials = true;

const Navbar = ({ setsearchResult, resultsearch }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data, setData, result, setResult } = useContext(detailsContext);
  const [styles, setStyles] = useState({ o: 0, t: "scale(0)" });
  const [CursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState(true);
  const [temp, setTemp] = useState(false);
  const [showmenu, setshowmenu] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userdata, setUserData] = useState({});
  const [content, setContent] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    // Initial check on component mount
    handleResize();

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch session (server reads the cookie and returns user data)
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
    window.addEventListener("storage", onAuthChange); // cross-tab
    window.addEventListener("authChange", onAuthChange); // same-tab custom event

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

  // Function to decode the token

  const handleMouseEnter = useCallback(() => {
    setStyles({ o: 1, t: "scale(1)" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyles({ o: 0, t: "scale(0)" });
  }, []);

  const submitHandler = useCallback((e) => {
    e.preventDefault();
  }, []);

  const navLinkProps =
    isAuthenticated && userdata?.email
      ? { to: `/user/${encodeURIComponent(userdata.email)}` }
      : {
          onClick: () => {
            setTemp((prev) => !prev);
            isSmallScreen && setSearch((s) => !s);
          },
        };

  const textcolor = {
    color: "rgb(194,78,92)",
    background:
      "linear-gradient(90deg, rgba(194,78,92,1) 0%, rgba(121,9,19,1) 13%, rgba(242,6,33,1) 27%, rgba(168,69,82,1) 56%, rgba(243,6,42,1) 70%, rgba(0,212,255,1) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const width = {
    width: search ? "100%" : "0px",
  };

  return (
    <nav className="flex text-2xl max-md:h-fit  max-md:pb-[80px] justify-between  transition-height duration-300 ease-in-out h-fit py-3 px-0 text-white bg-black relative">
      <div className="p-3 duration-700">
        <input
          type="checkbox"
          role="button"
          aria-label="Display the menu"
          className="menu md:hidden"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {isChecked && (
          <div
            className={` transition-height duration-1000 rounded-2xl *:w-full *:text-xl  ease-in-out  ${
              isChecked ? "w-fit h-fit" : "w-0 h-0"
            } bg-zinc-700  w-[100px]`}
          >
            <div className="p2 flex duration-500 flex-col text-[20vw] w-full z-10 items-start gap-3 pt-3">
              <NavLink
                to="/register"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="navlink  w-fit px-2 py-1 rounded-lg backdrop-blur-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
                style={(e) =>
                  e.isActive
                    ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                    : { background: "transparent" }
                }
              >
                register
              </NavLink>
              <NavLink
                to="/login"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="navlink  w-fit px-2 py-1 rounded-lg backdrop-blur-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
                style={(e) =>
                  e.isActive
                    ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                    : { background: "transparent" }
                }
              >
                login
              </NavLink>
              <NavLink
                to="/all/popular"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="navlink  w-fit px-2 py-1 rounded-lg backdrop-blur-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
                style={(e) =>
                  e.isActive
                    ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                    : { background: "transparent" }
                }
              >
                Populer 🌟
              </NavLink>
              <NavLink
                to="/all/trending"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="navlink  w-fit px-2 py-1 backdrop-blur-lg rounded-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
                style={(e) =>
                  e.isActive
                    ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                    : { background: "transparent" }
                }
              >
                trending 🔥
              </NavLink>
              <NavLink
                to="/news"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="navlink  w-fit px-2 py-1 rounded-lg border-0 backdrop-blur-lg border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
                style={(e) =>
                  e.isActive
                    ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                    : { background: "transparent" }
                }
              >
                News 📰
              </NavLink>
            </div>
          </div>
        )}
      </div>
      <div
        className={`p1 h-16 w-[330px]  flex text-2xl  z-30 gap-8 justify-evenly px-1 py-3 text-white bg-transparent relative `}
      >
        <NavLink
          to="/"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          id="logo"
          className="navlink w-fit px-2 py-1 text-gradient-to-r from-red-600 via-red-900 to-blue-300 text-[35px] backdrop-blur-lg  font-['monument'] rounded-lg border-0 border-12 font-black border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
          style={textcolor}
        >
          kepapro
        </NavLink>
      </div>
      <div className="p2 flex max-md:opacity-0 max-md:scale-0 max-md:w-0 justify-center w-[30vw] z-10 items-start gap-3 pt-3">
        <NavLink
          to="/all/popular"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="navlink text-lg w-fit px-2 py-1 rounded-lg backdrop-blur-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
          style={(e) =>
            e.isActive
              ? { backdropFilter: "blur(10px)", fontWeight: "700" }
              : { background: "transparent" }
          }
        >
          Populer
        </NavLink>
        <NavLink
          to="/"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="navlink text-lg w-fit px-2 py-1 rounded-lg backdrop-blur-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
          style={(e) =>
            e.isActive
              ? { backdropFilter: "blur(10px)", fontWeight: "700" }
              : { background: "transparent" }
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/all/trending"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="navlink text-lg w-fit px-2 py-1 backdrop-blur-lg rounded-lg border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
          style={(e) =>
            e.isActive
              ? { backdropFilter: "blur(10px)", fontWeight: "700" }
              : { background: "transparent" }
          }
        >
          trending 🔥
        </NavLink>
        {/* <NavLink
          to="/news"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="navlink text-lg w-fit px-2 py-1 rounded-lg hover:text-2xl duration-200 border-0 backdrop-blur-lg border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
          style={(e) =>
            e.isActive
              ? { backdropFilter: "blur(10px)", fontWeight: "700" }
              : { background: "transparent" }
          }
        >
          News 📰
        </NavLink> */}
      </div>
      <div className=" h-fit pt-3 flex w-fit  flex-wrap z-2 text-2xl gap-4 justify:center items-center  max-md:justify-evenly max-md:items-end  text-white  overflow-hidden bg-transparent duration-600">
        <div className="flex flex-wrap">
          <div className="flex flex-col justify-start items-start w-fit">
            <NavLink
              {...navLinkProps}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="navlink text-lg w-fit flex flex-col justify-center items-end gap-4 px-1 py-1  rounded-full overflow-hidden border-0 border-12 border-[rgba(0, 0, 0,0.8)] border-opacity-40 z-99"
              style={({ isActive }) =>
                isActive
                  ? { backdropFilter: "blur(10px)", fontWeight: "700" }
                  : { background: "transparent" }
              }
            >
              <div className="relative">
                {userdata.userpic ? (
                  <img
                    src={userdata.userpic}
                    className="w-[32px] rounded-full h-[32px] object-cover"
                    alt="userimage"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="currentColor"
                  >
                    <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path>
                  </svg>
                )}
                {/* online marker when authenticated */}
                {isAuthenticated && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 ring-2 ring-black" />
                )}
              </div>
            </NavLink>
            <div
              className={`bg-zinc-800   flex justify-start  w-[120px]   rounded-2xl  duration-300 ease-in-out ${
                temp ? " h-[100px] text-[100%] " : "h-0 text-[0%]  "
              }`}
            >
              <div className="font-medium flex flex-col  text-center justify-center p-3">
                <Link to="/register">sign up</Link>
                <div className="bg-zinc-600 border-zinc-600 h-1 rounded" />

                <Link to="login">login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* optionally show username next to avatar when available */}
      {isAuthenticated && userdata?.username && (
        <div className="hidden max-md:block ml-3 text-sm text-zinc-300">
          {userdata.username}
        </div>
      )}
      {isChecked == false && (
        <div
          className={`bg-transparent  max-w-[400px] p-3  pr-3 w-[400px]  top-[10vh] max-md:absolute max-md:w-full max-md:left-1/2 max-md:-translate-x-1/2  flex justify-end items-end h-fit  max-md:ml-0 gap-3 `}
          style={width}
        >
          <form
            className={`p-2 flex justify-start   max-md:left-1/2  w-0 duration-600 gap-2 items-center`}
            style={width}
            onSubmit={submitHandler}
            value={result}
            onChange={(e) => setResult(e.target.value)}
          >
            <input
              onChange={(e) => setsearchResult(e.target.value)}
              value={resultsearch}
              className="px-2  duration-500  max-md:w-full -mt-2 py-1 rounded-xl placeholder:text-zinc-400 bg-transparent border-2 border-zinc-400 "
              style={width}
              placeholder="search"
              type="text"
            />
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
