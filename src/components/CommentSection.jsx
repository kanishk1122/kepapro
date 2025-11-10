import { useState, useEffect, useRef } from "react";
import axios from "../utils/Axios";
import { io } from "socket.io-client";

// Ensure axios sends credentials (cookies) by default for cross-origin requests
axios.defaults.withCredentials = true;

const CommentSection = ({ animename, season, episode, userdata }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [usePolling, setUsePolling] = useState(false); // toggle to force polling

  // Use userdata from session endpoint instead of client-side token decoding
  // userdata may contain: { email, username, userpic, isAdmin, ... }

  // Prefer explicit env var; otherwise connect back to same origin (works for dev & prod).
  // IMPORTANT: For Netlify serverless deployments you must run a separate socket-enabled server
  // and set VITE_SOCKET_URL to its URL (e.g. https://sockets.example.com).
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8888";

  // Initialize Socket.IO connection with automatic fallback to polling
  useEffect(() => {
    let mounted = true;

    // Try candidate socket endpoints and optional proxy path (Netlify function path)
    const tryConnectCandidates = async () => {
      // Clean previous socket if present
      try {
        if (socketRef.current) {
          socketRef.current.off();
          socketRef.current.disconnect();
        }
      } catch (e) {
        console.error("Error cleaning up previous socket:", e);
      }

      const transports = usePolling ? ["polling"] : ["websocket", "polling"];

      // Candidate bases to try (env var first, then same-origin, then localhost:8888)
      const bases = [
        import.meta.env.VITE_SOCKET_URL,
        "http://localhost:8888",
      ].filter(Boolean);

      // Some setups (Netlify dev/proxy) may require a custom engine.io path:
      const pathCandidates = [undefined, "/.netlify/functions/api/socket.io"];

      let connected = false;

      for (const base of bases) {
        for (const path of pathCandidates) {
          if (!mounted) return;
          // create socket for this attempt
          const opts = {
            transports,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 8000,
            withCredentials: true,
          };
          if (path) opts.path = path;

          const socket = io(base, opts);

          // small helper to await connect or error
          const wait = new Promise((resolve) => {
            const onConnect = () => {
              socket.off("connect_error", onError);
              resolve({ ok: true, socket });
            };
            const onError = (err) => {
              socket.off("connect", onConnect);
              resolve({ ok: false, err });
            };
            socket.once("connect", onConnect);
            socket.once("connect_error", onError);
            // safety timeout
            setTimeout(() => {
              socket.off("connect", onConnect);
              socket.off("connect_error", onError);
              resolve({ ok: false, err: new Error("connect timeout") });
            }, 6000);
          });

          const result = await wait;
          if (result.ok) {
            // we have a connected socket; set it and wire events
            socketRef.current = result.socket;
            setIsSocketConnected(true);

            // standard events
            socketRef.current.on("reconnect", (attempt) => {
              socketRef.current.emit("join-video", {
                animename,
                season,
                episode,
              });
            });
            socketRef.current.on("disconnect", (reason) => {
              setIsSocketConnected(false);
            });
            socketRef.current.on("new-comment", (newComment) => {
              setComments((prev) => [...prev, newComment]);
            });
            socketRef.current.on("viewer-count", (count) =>
              setViewerCount(count)
            );
            socketRef.current.on("user-typing", ({ username }) => {
              setIsTyping(true);
              setTypingUser(username);
            });
            socketRef.current.on("user-stop-typing", () => {
              setIsTyping(false);
              setTypingUser("");
            });
            socketRef.current.on("comment-deleted", ({ commentId }) => {
              setComments((prev) => prev.filter((c) => c._id !== commentId));
            });

            // join room and finish
            socketRef.current.emit("join-video", {
              animename,
              season,
              episode,
            });
            connected = true;
            break;
          } else {
            // not connected: ensure socket cleaned up
            try {
              socket.off();
              socket.disconnect();
            } catch (e) {}
            // continue to next candidate
          }
        }
        if (connected) break;
      }

      if (!connected) {
        // none connected -> mark as not connected (no debug logs/UI)
        setIsSocketConnected(false);
      }
    };

    tryConnectCandidates();

    return () => {
      mounted = false;
      try {
        if (socketRef.current) {
          socketRef.current.emit("leave-video", { animename, season, episode });
          socketRef.current.off();
          socketRef.current.disconnect();
        }
      } catch (e) {}
    };
  }, [animename, season, episode, usePolling, SOCKET_URL]);

  // Fetch initial comments
  useEffect(() => {
    fetchComments();
  }, [animename, season, episode]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/comments/${animename}/${season}/${episode}`
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // helper: wait a short time for socket to connect
  const waitForSocketConnect = (timeout = 2000) => {
    if (socketRef.current && socketRef.current.connected)
      return Promise.resolve(true);
    return new Promise((resolve) => {
      let settled = false;
      const onConnect = () => {
        if (settled) return;
        settled = true;
        socketRef.current.off("connect", onConnect);
        resolve(true);
      };

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        socketRef.current.off("connect", onConnect);
        resolve(false);
      }, timeout);

      if (socketRef.current) socketRef.current.on("connect", onConnect);
    });
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);

    // Emit typing event (use userdata.username if available)
    if (userdata?.username && socketRef.current) {
      socketRef.current.emit("typing", {
        animename,
        season,
        episode,
        username: userdata.username,
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to emit stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("stop-typing", { animename, season, episode });
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userdata?.email || !comment.trim()) return;

    setIsSubmitting(true);

    try {
      // Prefer socket emit, but wait briefly for socket to connect.
      const connected = await waitForSocketConnect(2000);
      if (connected && socketRef.current && socketRef.current.connected) {
        socketRef.current.emit(
          "post-comment",
          {
            animename,
            season,
            ep: episode,
            comment: comment.trim(),
            image: userdata.userpic || null,
            email: userdata.email,
            username: userdata.username,
          },
          (err, savedComment) => {
            if (err) {
              console.error("Error saving comment via socket (ack):", err);
              // fallback to HTTP POST
              fallbackPostComment();
            } else {
              setComment("");
            }
          }
        );
      } else {
        // socket unavailable, fallback to HTTP POST
        await fallbackPostComment();
      }

      // Stop typing indicator
      if (socketRef.current) {
        socketRef.current.emit("stop-typing", { animename, season, episode });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // fallback: POST to HTTP endpoint (ensures comment still gets saved)
  const fallbackPostComment = async () => {
    try {
      const response = await axios.post(
        "/api/comments",
        {
          animename,
          season,
          ep: episode,
          comment: comment.trim(),
          image: userdata.userpic || null,
        },
        { withCredentials: true }
      );
      const saved = response?.data?.comment;
      if (saved) {
        setComments((prev) => [...prev, saved]);
        setComment("");
      } else {
        // refresh comments as a fallback
        await fetchComments();
      }
    } catch (err) {
      console.error("Fallback POST failed:", err);
      throw err;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8 bg-zinc-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💬</span> Comments ({comments.length})
        </h2>
        <div className="flex items-center gap-3 bg-zinc-700/50 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-zinc-300 text-sm font-medium">
            {viewerCount} {viewerCount === 1 ? "viewer" : "viewers"}
          </div>
        </div>
      </div>

      {/* Add Comment Form */}
      {userdata?.email ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 ring-2 ring-red-500/30">
              {userdata.userpic ? (
                <img
                  src={userdata.userpic}
                  className="w-full h-full object-cover"
                  alt="User"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white font-bold text-lg">
                  {userdata.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Share your thoughts..."
                maxLength={500}
                className="w-full bg-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] placeholder-zinc-400"
                style={{ resize: "vertical" }}
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-zinc-400 text-sm">
                  {comment.length}/500 characters
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>Post Comment</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-zinc-700/30 rounded-xl text-center">
          <p className="text-zinc-300 mb-3">
            Please sign in to join the conversation
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/login"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Register
            </a>
          </div>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="mb-4 flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 bg-zinc-700/30 p-4 rounded-lg animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-700 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-32" />
                <div className="h-4 bg-zinc-700 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-zinc-400 text-lg">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((item, index) => (
            <div
              key={item._id || index}
              className="flex gap-4 bg-zinc-700/30 hover:bg-zinc-700/50 p-4 rounded-lg transition-all duration-200 group animate-fadeIn"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex-shrink-0 ring-2 ring-transparent group-hover:ring-red-500/30 transition-all">
                {item.image ? (
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                    alt={item.username || "User"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-600 to-zinc-800 text-white font-bold text-lg">
                    {item.username?.[0]?.toUpperCase() ||
                      item.email?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white">
                    {item.username || item.email?.split("@")[0] || "Anonymous"}
                  </span>
                  <span className="text-zinc-500 text-sm">•</span>
                  <span className="text-zinc-400 text-sm">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-white leading-relaxed break-words">
                  {item.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
