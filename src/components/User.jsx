import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from '../utils/Axios.jsx';

const User = () => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [decodedToken, setDecodedToken] = useState(null);
  const [userdata, setUserData] = useState({});
  const [content, setContent] = useState([]);
  const [showBookmark, setShowBookmark] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  const { username } = useParams();

  const jwt_decode = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setDecodedToken(decoded);
    }
  }, [token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post("/userdetail", { email: username }, { withCredentials: true });
        setUserData(response.data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    const fetchContent = async () => {
      try {
        const response = await axios.get("/watchall");
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchUserDetails();
    fetchContent();
  }, [username]);

  useEffect(() => {
    if (userdata.bookmarks && content.length > 0) {
      const filteredBookmarks = userdata.bookmarks.map((bookmark) => {
        return content.find(item => 
          item.animename === bookmark.animename &&
          item.season === bookmark.season &&
          item.ep === bookmark.ep
        );
      }).filter(item => item !== undefined);
      setBookmarks(filteredBookmarks);
    }
  }, [userdata.bookmarks, content]);

  const userLogout = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  const toggleBookmarkVisibility = () => {
    setShowBookmark(prev => !prev);
  };

  return (
    <>
      <Navbar />
      <div>
        <div className='w-full flex justify-end items-end '>
          <svg onClick={userLogout} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path>
          </svg>
        </div>
        {decodedToken && decodedToken.email === username ? (
          <div className='bg-neutral-900 w-full h-fit text-white'>
            <div className='min-h-[50vh] justify-center gap-10 items-center h-fit flex flex-wrap relative w-[100vw]'>
              <div className='w-[200px] overflow-hidden min-w-[200px] min-h-[200px] h-[200px] bg-zinc-700 rounded-full'> <img src={userdata.userpic} className='w-full h-full object-cover' alt="" /> </div>
              <div className='text-4xl tracking-widest w-[300px] h-full text-center flex flex-col gap-3 px-8 py-3 rounded-2xl '>
                
                <h2>{userdata.username}</h2>
                <Link to={`/edit/${userdata.email}`}>Edit</Link>
              </div>
            </div>
            <div className='flex p-3 flex-col backdrop-blur-xl h-fit py-10 w-screen max-w-[840px] max-h-fit p-6 rounded-3xl bg-[rgba(48,47,47,0.51)]'>
              <div className='w-120px flex'>
                <div className='w-120px h-120px'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={toggleBookmarkVisibility}
                    className={`${showBookmark ? "w-[5vw] h-[5vw]" : "w-[10vw] h-[10vw]"} min-h-[70px] min-w-[70px] duration-700`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 2H20C20.5523 2 21 2.44772 21 3V22.2763C21 22.5525 20.7761 22.7764 20.5 22.7764C20.4298 22.7764 20.3604 22.7615 20.2963 22.7329L12 19.0313L3.70373 22.7329C3.45155 22.8455 3.15591 22.7322 3.04339 22.4801C3.01478 22.4159 3 22.3465 3 22.2763V3C3 2.44772 3.44772 2 4 2ZM19 19.9645V4H5V19.9645L12 16.8412L19 19.9645ZM12 13.5L9.06107 15.0451L9.62236 11.7725L7.24472 9.45492L10.5305 8.97746L12 6L13.4695 8.97746L16.7553 9.45492L14.3776 11.7725L14.9389 15.0451L12 13.5Z"></path>
                  </svg>
                </div>
                <div onClick={toggleBookmarkVisibility} className='text-4xl font-semibold'>
                  {showBookmark ? <p>Bookmarks</p> : <div>Click to show bookmarks</div>}
                </div>
              </div>
              <div className='flex flex-col gap-3 '>
                {showBookmark && (
                  userdata.bookmarks && bookmarks.length > 0 ? (
                    bookmarks.map((bookmark, index) => (
                      <div key={index} className='bg-zinc-700 rounded-2xl p-3 flex gap-3  h-fit'>
                        <div className='w-[150px] h-[100px] rounded-2xl overflow-hidden '><img className='w-full h-full object-cover' src={bookmark.thumnail} alt="" /></div>
                       <div className='flex flex-col gap-2'>
                       <div>Anime: {bookmark.animename}</div>
                        <div>Season: {bookmark.season}</div>
                        <div>Episode: {bookmark.ep}</div>
                        <Link to={`/watch/${bookmark.animename}/${bookmark.season}/${bookmark.ep}`}className='bg-red-600 rounded-full px-2 py-1 w-fit' >Watch now </Link>
                       </div>
                        
                      </div>
                    ))
                  ) : (
                    <div>No bookmarks found.</div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>Something went wrong</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default User;
