import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaQuoteLeft,
  FaHandsHelping,
  FaRecycle,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaArrowRight,
  FaPlus,
  FaStar
} from "react-icons/fa";
import { GiTreeGrowth, GiSparkles } from "react-icons/gi";
import Navbar from "../../components/Navbar";

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    recentComplaints: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserStats();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const complaints = data.complaints || [];

        setStats({
          totalComplaints: complaints.length,
          resolvedComplaints: complaints.filter((c) => c.status === "Resolved").length,
          pendingComplaints: complaints.filter((c) => c.status === "Pending").length,
          recentComplaints: complaints.slice(0, 3),
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Welcome Section */}
      <section className="py-8 px-4 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-white to-purple-50 rounded-3xl shadow-lg p-6 md:p-8 mb-8 border border-purple-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                  <span className="text-white font-bold text-3xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">{user.name}</span>!
                  </h1>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                      {user.ward}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-700">Making your community better together</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/complaint")}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <FaPlus /> New Complaint
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Complaints</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{loading ? "..." : stats.totalComplaints}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl border border-purple-200">
                  <FaChartLine className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">All reported issues</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-3xl font-bold text-pink-600 mt-1">{loading ? "..." : stats.resolvedComplaints}</p>
                </div>
                <div className="p-3 bg-pink-100 rounded-xl border border-pink-200">
                  <FaUsers className="h-8 w-8 text-pink-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Successfully closed</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{loading ? "..." : stats.pendingComplaints}</p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-xl border border-indigo-200">
                  <FaExclamationTriangle className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Awaiting resolution</p>
              </div>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Complaints</h3>
              {stats.recentComplaints.length > 0 && (
                <button 
                  onClick={() => navigate("/complaints")}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View all <FaArrowRight className="text-xs" />
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : stats.recentComplaints.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-200">
                  <FaExclamationTriangle className="text-purple-500 text-2xl" />
                </div>
                <p className="text-gray-600 mb-4">No complaints filed yet.</p>
                <button 
                  onClick={() => navigate("/complaint")}
                  className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-2 rounded-lg font-bold hover:shadow-md hover:shadow-purple-200 transition-all"
                >
                  Start by filing your first complaint!
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentComplaints.map((complaint) => (
                  <div
                    key={complaint._id}
                    className="group bg-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all duration-300 cursor-pointer hover:shadow-sm"
                    onClick={() => navigate(`/complaint/${complaint._id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 group-hover:text-purple-700">{complaint.title}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="bg-gray-100 px-2 py-1 rounded-md mr-2 border border-gray-200">{complaint.category}</span>
                          <span className="text-gray-400">•</span>
                          <span className="ml-2">{complaint.location}</span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-bold mt-2 md:mt-0 border ${
                          complaint.status === "Resolved"
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border-emerald-200"
                            : complaint.status === "In Progress"
                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200"
                            : complaint.status === "Pending"
                            ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
                            : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-3xl mx-4 md:mx-auto max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-purple-50/60 to-white/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=2070&q=80&blend=222&sat=-30"
          alt="Clean neighborhood at night"
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-800">
              Together for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Cleaner Tomorrow</span>
            </h1>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/40 to-pink-200/40 blur-xl rounded-full"></div>
              <p className="text-xl md:text-2xl italic font-light px-6 py-4 rounded-2xl relative z-10 backdrop-blur-sm bg-white/80 border border-white">
                "Keeping our surroundings clean is not an option - it's our responsibility"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-pink-400 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">Building sustainable communities through collective action and environmental stewardship</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-xl mr-4 border border-purple-200">
                  <FaHandsHelping className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To empower communities to maintain clean, safe, and sustainable neighborhoods through collaborative
                reporting, awareness, and civic engagement. We bridge the gap between citizens and local authorities.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-pink-500">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-pink-100 rounded-xl mr-4 border border-pink-200">
                  <GiSparkles className="text-pink-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                A world where every citizen actively participates in creating and maintaining pristine living
                environments that foster health, happiness, and community pride through sustainable practices.
              </p>
            </div>
          </div>

          {/* Inspirational Quotes */}
          <div className="space-y-6">
            {[
              {
                quote: "We won't have a society if we destroy the environment.",
                author: "Margaret Mead",
                gradient: "from-purple-400 to-violet-400",
                bg: "bg-gradient-to-br from-white to-purple-50",
                icon: <FaStar className="text-purple-500" />
              },
              {
                quote: "Cleanliness is next to godliness.",
                author: "John Wesley",
                gradient: "from-pink-400 to-rose-400",
                bg: "bg-gradient-to-br from-white to-pink-50",
                icon: <GiSparkles className="text-pink-500" />
              },
              {
                quote: "The environment is where we all meet; where all have a mutual interest.",
                author: "Lady Bird Johnson",
                gradient: "from-indigo-400 to-purple-400",
                bg: "bg-gradient-to-br from-white to-indigo-50",
                icon: <FaHandsHelping className="text-indigo-500" />
              },
            ].map(({ quote, author, gradient, bg, icon }, i) => (
              <div className={`${bg} p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100`} key={i}>
                <div className="flex items-start">
                  <div className={`p-2 bg-gradient-to-r ${gradient} rounded-lg mr-4`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-lg italic text-gray-700 leading-relaxed">
                      "{quote}"
                    </p>
                    <span className="block font-semibold text-purple-600 mt-3">- {author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Guiding principles that drive our community initiatives</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRecycle className="text-4xl" />,
                title: "Sustainability",
                desc: "Promoting eco-friendly solutions for long-term community health and environmental preservation",
                gradient: "from-purple-400 to-violet-400",
                border: "border-purple-200"
              },
              {
                icon: <FaUsers className="text-4xl" />,
                title: "Community",
                desc: "Strengthening bonds through collective environmental action and shared responsibility",
                gradient: "from-violet-400 to-pink-400",
                border: "border-violet-200"
              },
              {
                icon: <FaHandsHelping className="text-4xl" />,
                title: "Responsibility",
                desc: "Encouraging personal accountability for shared spaces and collective well-being",
                gradient: "from-pink-400 to-purple-400",
                border: "border-pink-200"
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${val.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-800">{val.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-white to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 text-center relative overflow-hidden border border-purple-100">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-violet-200/30 to-purple-200/30 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make a Difference?</h2>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of community members who are actively shaping cleaner, safer neighborhoods.
                Your voice matters!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/complaint")}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Report an Issue Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate("/complaints")}
                  className="bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 px-8 py-4 rounded-xl font-bold transition-all duration-300"
                >
                  View All Complaints
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;