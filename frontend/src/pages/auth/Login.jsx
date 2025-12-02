"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaLock, 
  FaHashtag, 
  FaUserShield, 
  FaBuilding, 
  FaUserCircle,
  FaGoogle,
  FaArrowRight,
  FaSpinner,
  FaShieldAlt,
  FaUsers
} from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    wardNumber: "",
    loginType: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLoginType = (type) => {
    setCredentials({
      username: "",
      password: "",
      wardNumber: "",
      loginType: type,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (credentials.loginType === "admin") {
        response = await fetch("http://localhost:5000/api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });
      } else if (credentials.loginType === "wardAdmin") {
        response = await fetch("http://localhost:5000/api/auth/wardadmin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
            wardNumber: String(credentials.wardNumber),
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.username,
            password: credentials.password,
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name || "User"}!`);

      if (data.user.role === "admin") navigate("/dashboard");
      else if (data.user.role === "wardAdmin") navigate("/ward-dashboard");
      else navigate("/home");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/google/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId: credentialResponse.credential }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome, ${data.user.name || "User"}!`);
      navigate("/home");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
    toast.error("Google authentication failed");
  };

  const getLoginColor = (type) => {
    switch(type) {
      case "admin": return "from-red-500 to-red-600";
      case "wardAdmin": return "from-emerald-500 to-green-600";
      default: return "from-indigo-500 to-purple-600";
    }
  };

  const getLoginIcon = (type) => {
    switch(type) {
      case "admin": return <FaUserShield className="text-2xl" />;
      case "wardAdmin": return <FaBuilding className="text-2xl" />;
      default: return <FaUserCircle className="text-2xl" />;
    }
  };

  const getLoginTitle = (type) => {
    switch(type) {
      case "admin": return "Admin Portal";
      case "wardAdmin": return "Ward Admin";
      default: return "Citizen Login";
    }
  };

  const getLoginSubtitle = (type) => {
    switch(type) {
      case "admin": return "Municipal Administration Dashboard";
      case "wardAdmin": return "Ward-level Complaint Management";
      default: return "Community Grievance Portal";
    }
  };

  const currentColor = getLoginColor(credentials.loginType);
  const currentIcon = getLoginIcon(credentials.loginType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white animate-fadeIn">
        {/* Left Panel - Login Type Selector */}
        <div className="md:w-1/3 bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">NagarSaathi</h1>
            <p className="text-gray-300">Smart Municipal Grievance System</p>
          </div>
          
          <div className="space-y-4 mb-10">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Select Login Type</h3>
            
            <button
              onClick={() => toggleLoginType("user")}
              className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                credentials.loginType === "user" 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform scale-[1.02]" 
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <FaUserCircle className="text-xl" />
              <div className="text-left">
                <div className="font-semibold">Citizen</div>
                <div className="text-xs text-gray-300">File & Track Complaints</div>
              </div>
            </button>

            <button
              onClick={() => toggleLoginType("wardAdmin")}
              className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                credentials.loginType === "wardAdmin" 
                  ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg transform scale-[1.02]" 
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <FaBuilding className="text-xl" />
              <div className="text-left">
                <div className="font-semibold">Ward Admin</div>
                <div className="text-xs text-gray-300">Manage Ward Complaints</div>
              </div>
            </button>

            <button
              onClick={() => toggleLoginType("admin")}
              className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${
                credentials.loginType === "admin" 
                  ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg transform scale-[1.02]" 
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <FaUserShield className="text-xl" />
              <div className="text-left">
                <div className="font-semibold">Super Admin</div>
                <div className="text-xs text-gray-300">System Administration</div>
              </div>
            </button>
          </div>

          <div className="text-sm text-gray-400">
            <p>Need help? <span className="text-blue-400 cursor-pointer">Contact Support</span></p>
            <p className="mt-2">© 2024 NagarSaathi. All rights reserved.</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="md:w-2/3 p-8 md:p-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${currentColor} text-white`}>
                {currentIcon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{getLoginTitle(credentials.loginType)}</h2>
                <p className="text-gray-600">{getLoginSubtitle(credentials.loginType)}</p>
              </div>
            </div>
            
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <div className="text-red-500 mt-0.5">⚠</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {credentials.loginType === "user" ? "Email Address" : "Username"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder={credentials.loginType === "user" ? "citizen@example.com" : "Enter your username"}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {credentials.loginType === "wardAdmin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ward Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHashtag className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="wardNumber"
                      value={credentials.wardNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-white placeholder-gray-400"
                      placeholder="e.g., Ward 9"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : `bg-gradient-to-r ${currentColor} hover:shadow-lg hover:shadow-${currentColor.split(' ')[1].replace('to-', '')}/20`
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Login to {getLoginTitle(credentials.loginType)}</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {credentials.loginType === "user" && (
            <div className="mt-8">
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID"}>
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      shape="rectangular"
                      width="100%"
                      text="signin_with"
                      size="large"
                      theme="outline"
                      logo_alignment="left"
                    />
                  </div>
                </GoogleOAuthProvider>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            {credentials.loginType === "user" ? (
              <div className="text-center">
                <p className="text-gray-600">
                  New to NagarSaathi?{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Create an account
                  </button>
                </p>
                
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">
                  Not a {credentials.loginType}?{" "}
                  <button
                    onClick={() => toggleLoginType("user")}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Switch to Citizen Login
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;