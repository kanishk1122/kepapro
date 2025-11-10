import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/Axios.jsx";

// Ensure axios sends credentials
axios.defaults.withCredentials = true;

const User = () => {
  const [loggedInUser, setLoggedInUser] = useState(null); // from /session
  const [userdata, setUserData] = useState({});
  const [content, setContent] = useState([]);
  const [showBookmark, setShowBookmark] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  const { username } = useParams();

  useEffect(() => {
    // fetch current session user (if any)
    const fetchSession = async () => {
      try {
        const res = await axios.get("/session");
        if (res.data?.authenticated) setLoggedInUser(res.data.user);
        else setLoggedInUser(null);
      } catch (err) {
        setLoggedInUser(null);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoadingUser(true);
        // this uses protected route; server will read cookie JWT
        const response = await axios.post(
          "/userdetail",
          { email: username },
          { withCredentials: true }
        );
        setUserData(response.data || {});
      } catch (error) {
        console.log("Error fetching user details:", error);
        setUserData({});
      } finally {
        setIsLoadingUser(false);
      }
    };

    const fetchContent = async () => {
      try {
        setIsLoadingContent(true);
        const response = await axios.get("/watchall");
        setContent(response.data || []);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent([]);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchUserDetails();
    fetchContent();
  }, [username]);

  useEffect(() => {
    // map bookmarks to content items safely
    if (!userdata?.bookmarks || content.length === 0) {
      setBookmarks([]);
      return;
    }
    const filteredBookmarks = userdata.bookmarks
      .map((bookmark) =>
        content.find(
          (item) =>
            item.animename === bookmark.animename &&
            item.season === bookmark.season &&
            item.ep === bookmark.ep
        )
      )
      .filter(Boolean);
    setBookmarks(filteredBookmarks);
  }, [userdata, content]);

  const userLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      // notify other tabs/components and redirect
      try {
        localStorage.setItem("auth", Date.now().toString());
        window.dispatchEvent(new Event("authChange"));
      } catch (e) {}
      window.location.href = "/";
    }
  };

  const toggleBookmarkVisibility = () => {
    setShowBookmark((prev) => !prev);
  };

  const isOwner = loggedInUser?.email === username;

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Profile header */}
        <section className="bg-gradient-to-r from-zinc-900 via-neutral-900 to-black rounded-3xl p-6 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden ring-4 ring-red-600/40 shadow-lg bg-zinc-800">
                {isLoadingUser ? (
                  <div className="w-full h-full animate-pulse bg-zinc-700" />
                ) : (
                  <img
                    src={userdata.userpic || "/placeholder-avatar.png"}
                    alt={userdata.username || "User"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              {isOwner && (
                <Link
                  to={`/edit/${userdata.email}`}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm shadow-md"
                >
                  Edit
                </Link>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {isLoadingUser ? (
                  <span className="inline-block w-48 h-8 bg-zinc-700 rounded animate-pulse" />
                ) : (
                  userdata.username || "Unnamed User"
                )}
              </h1>
              <p className="text-sm text-zinc-400 mt-2">
                {isLoadingUser ? (
                  <span className="inline-block w-64 h-4 bg-zinc-700 rounded animate-pulse" />
                ) : (
                  userdata.bio || `${bookmarks.length} saved bookmarks`
                )}
              </p>

              <div className="mt-4 flex gap-3 justify-center md:justify-start">
                <div className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-200">
                  <strong className="text-white">{bookmarks.length}</strong>{" "}
                  Bookmarks
                </div>
                <div className="px-3 py-1 rounded-full bg-zinc-800 text-sm text-zinc-200">
                  <strong className="text-white">{content.length}</strong>{" "}
                  Titles
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bookmarks area */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Bookmarks</h2>
            <button
              onClick={toggleBookmarkVisibility}
              className="text-sm bg-zinc-800 px-3 py-1 rounded-lg text-zinc-200"
            >
              {showBookmark ? "Hide" : "Show"}
            </button>
          </div>

          {isLoadingContent || isLoadingUser ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-zinc-800 rounded-xl animate-pulse h-36"
                />
              ))}
            </div>
          ) : showBookmark ? (
            bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((b, idx) => (
                  <article
                    key={idx}
                    className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition"
                  >
                    <div className="relative h-44 bg-zinc-800">
                      <img
                        src={b.thumnail || "/placeholder-thumb.png"}
                        alt={`${b.animename} - S${b.season}E${b.ep}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="font-semibold">{b.animename}</div>
                        <div className="text-xs text-zinc-300">
                          S{b.season} • E{b.ep}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-zinc-300">
                        {b.seasonname || `Season ${b.season}`}
                      </div>
                      <Link
                        to={`/watch/${b.animename}/${b.season}/${b.ep}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Watch
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-zinc-800 rounded-xl text-center text-zinc-400">
                No bookmarks yet — when you add favorites they'll show up here.
              </div>
            )
          ) : null}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default User;
