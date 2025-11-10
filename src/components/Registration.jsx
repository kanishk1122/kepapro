import { useState } from "react";
import videoFile from "../assets/public/images/videoplayback.mp4";
import axios from "../utils/Axios";
import { Link, useNavigate } from "react-router-dom";

// Ensure axios sends credentials (cookies) by default for cross-origin requests
axios.defaults.withCredentials = true;

const Registration = () => {
  const [scale, setScale] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [formsubmitred, setformsubmitred] = useState(false);
  const [flash, setflash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username) newErrors.username = "Username is required";
    else if (username.length < 3)
      newErrors.username = "Username must be at least 3 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email address is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setflash("");

    try {
      const user = {
        username,
        email,
        password,
      };

      const response = await axios.post("/register", user, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUsername("");
        setEmail("");
        setPassword("");
        setformsubmitred(true);
        setTimeout(() => setScale(true), 100);

        // notify other tabs/components that auth changed
        try {
          localStorage.setItem("auth", Date.now().toString());
          window.dispatchEvent(new Event("authChange"));
        } catch (e) {
          console.warn("auth event error", e);
        }

        // Redirect after animation
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setflash(
          "This email is already registered. Please use a different email."
        );
      } else if (error.response && error.response.status === 500) {
        setflash("Server error. Please try again later.");
      } else {
        setflash("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Success Animation */}
      {formsubmitred && (
        <div
          className={`${
            scale ? "w-full h-full" : "w-0 h-0"
          } flex justify-center items-center absolute inset-0 z-50 transition-all duration-1000 ease-in-out`}
        >
          <video
            className={`${
              scale ? "w-full h-full" : "w-0 h-0"
            } absolute object-cover transition-all duration-1000`}
            autoPlay
            loop
            muted
            src={videoFile}
          ></video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center space-y-8">
            <div className="animate-bounce">
              <svg
                className="w-24 h-24 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p
              className={`${
                scale ? "text-5xl opacity-100" : "text-xl opacity-0"
              } font-bold font-['monument'] transition-all duration-1000 delay-300 tracking-wider`}
            >
              WELCOME
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-3 rounded-full text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
            >
              Go to Home
            </Link>
          </div>
        </div>
      )}

      {/* Registration Form Container */}
      <div className="relative z-10 min-h-screen flex justify-center items-center p-4">
        <div
          className={`w-full max-w-md transition-all duration-700 ${
            scale && formsubmitred
              ? "opacity-0 scale-50"
              : "opacity-100 scale-100"
          }`}
        >
          {/* Card */}
          <div className="relative bg-gradient-to-br from-zinc-800/40 to-neutral-900/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>

            {/* Header */}
            <div className="relative mb-8 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
                Create Account
              </h1>
              <p className="text-zinc-400">Join us and start your journey</p>
            </div>

            {/* Error Message */}
            {flash && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-400 text-sm font-medium">{flash}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300 ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full bg-zinc-900/50 border border-zinc-700 focus:border-red-500 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setflash("");
                    }}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-400 text-xs ml-1 animate-shake">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full bg-zinc-900/50 border border-zinc-700 focus:border-red-500 rounded-xl px-4 py-3 pl-12 text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setflash("");
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs ml-1 animate-shake">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-zinc-500 group-focus-within:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="w-full bg-zinc-900/50 border border-zinc-700 focus:border-red-500 rounded-xl px-4 py-3 pl-12 pr-12 text-white placeholder-zinc-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-red-500/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setflash("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    {passwordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs ml-1 animate-shake">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-red-500 hover:text-red-400">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-red-500 hover:text-red-400"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-zinc-700 disabled:to-zinc-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-red-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-800/40 text-zinc-400">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="block text-center py-3 px-4 border border-zinc-700 hover:border-red-500 rounded-xl text-zinc-300 hover:text-white transition-all duration-300 hover:bg-red-500/5"
            >
              Sign in instead
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-zinc-500 text-sm mt-6">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-red-500 hover:text-red-400">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
