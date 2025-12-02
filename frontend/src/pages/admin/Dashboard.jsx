import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiUsers,
  FiLogOut,
  FiAlertTriangle,
  FiMessageSquare,
  FiX,
  FiSend,
  FiFilter,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiHome,
  FiTrash2,
  FiEye,
  FiEdit
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#FFB74D", "#4FC3F7", "#81C784", "#E57373", "#9575CD"];

// Enhanced Chatbot component
const AIChatBot = ({ stats, categoryData, complaints }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Nagarsaathi AI assistant. How can I help you manage complaints today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = async (message) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          context: { stats, categoryData, complaints }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.reply;
      }
      throw new Error('API response error');
    } catch (error) {
      console.error('AI API Error:', error);
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('total') && lowerMessage.includes('complaint')) {
        return `📊 There are ${stats.total} total complaints in the system.`;
      } else if (lowerMessage.includes('pending')) {
        return `⏳ Currently, ${stats.pending} complaints are pending review (${Math.round((stats.pending/stats.total)*100)}% of total).`;
      } else if (lowerMessage.includes('resolved')) {
        return `✅ Great news! ${stats.resolved} complaints have been resolved successfully.`;
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "👋 Hello! I'm your Nagarsaathi AI assistant. I can help you analyze complaints, provide insights, and answer questions about the system.";
      } else if (lowerMessage.includes('export') || lowerMessage.includes('report')) {
        return "📈 You can export reports by clicking the 'Export Report' button in the dashboard header. It will download a CSV file with all complaint data.";
      } else {
        return "🤖 I'm here to help with complaint management. You can ask about statistics, categories, wards, or any other dashboard-related questions.";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    const botResponseText = await getAIResponse(inputMessage);

    const botResponse = {
      id: messages.length + 2,
      text: botResponseText,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botResponse]);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickQuestions = [
    "📊 Show statistics",
    "⏳ Pending complaints?",
    "📍 Top categories",
    "📈 Export guide",
    "🏆 Best performing ward"
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl z-50 flex items-center justify-center hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border-0 overflow-hidden animate-slideUp">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Nagarsaathi AI Assistant</h3>
                <p className="text-sm opacity-90">Powered by AI • Real-time insights</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <FiX size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`inline-block p-3 rounded-2xl max-w-xs shadow-sm ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-r from-gray-100 to-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {message.text}
                </div>
                <div className={`text-xs mt-1 ${message.sender === "user" ? "text-right text-gray-500" : "text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-white border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2 font-medium">Quick questions:</div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="bg-white border border-gray-300 rounded-full px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about complaints, stats, or insights..."
                className="flex-1 border-2 border-gray-300 rounded-l-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === "" || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-r-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-300"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterWard, setFilterWard] = useState("");
  const [wardWarning, setWardWarning] = useState("");
  const [categoryWarning, setCategoryWarning] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const WARD_THRESHOLD = 5;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === "admin") {
        fetchComplaints();
      } else {
        navigate("/home");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (complaints.length === 0) {
      setWardWarning("");
      setCategoryWarning("");
      return;
    }

    const wardCount = {};
    complaints.forEach(c => {
      const ward = c.user?.ward || c.ward || "Unknown";
      if (!wardCount[ward]) wardCount[ward] = 0;
      wardCount[ward]++;
    });

    const maxWard = Object.entries(wardCount).sort((a, b) => b[1] - a[1])[0];
    if (maxWard && maxWard[1] > WARD_THRESHOLD) {
      setWardWarning(`Alert: Ward "${maxWard[0]}" has ${maxWard[1]} complaints.`);
    } else {
      setWardWarning("");
    }

    const categoryCount = {};
    complaints.forEach(c => {
      const cat = c.category || "Unknown";
      if (!categoryCount[cat]) categoryCount[cat] = 0;
      categoryCount[cat]++;
    });
    const maxCat = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    if (maxCat) {
      setCategoryWarning(`Trend: "${maxCat[0]}" has ${maxCat[1]} complaints.`);
    } else {
      setCategoryWarning("");
    }

    // Store resolved complaints separately
    setResolvedComplaints(complaints.filter(c => c.status === "Resolved"));

  }, [complaints]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const complaintsData = data.complaints || [];
        setComplaints(complaintsData);

        setStats({
          total: complaintsData.length,
          pending: complaintsData.filter((c) => c.status === "Pending").length,
          inProgress: complaintsData.filter((c) => c.status === "In Progress").length,
          resolved: complaintsData.filter((c) => c.status === "Resolved").length,
          rejected: complaintsData.filter((c) => c.status === "Rejected").length,
        });
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        if (newStatus === "Resolved") {
          // Instead of deleting, just update the status
          // The complaint will be filtered out from active view
        }
        fetchComplaints(); // Refresh to show updated status
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDeleteResolved = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this resolved complaint?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          fetchComplaints(); // Refresh list
        } else {
          alert("Failed to delete complaint");
        }
      } catch (error) {
        alert("Error deleting complaint");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleExport = () => {
    const exportData = complaints.map((c) => ({
      ID: c._id,
      Title: c.title,
      Category: c.category,
      Status: c.status,
      Priority: c.priority,
      Location: c.location,
      "User Name": c.user?.name || c.submittedBy || "Unknown",
      "User Ward": c.user?.ward || c.ward || "Unknown",
      "Date Filed": new Date(c.createdAt).toLocaleDateString(),
    }));

    if (exportData.length === 0) return;

    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData.map((obj) =>
      Object.values(obj)
        .map((val) => (typeof val === "string" && val.includes(",") ? `"${val}"` : val))
        .join(",")
    );

    const csvData = [headers, ...rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `complaints_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved": return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200";
      case "In Progress": return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200";
      case "Rejected": return "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200";
      default: return "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "bg-gradient-to-r from-red-600 to-red-500 text-white";
      case "High": return "bg-gradient-to-r from-orange-500 to-orange-400 text-white";
      case "Medium": return "bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-800";
      case "Low": return "bg-gradient-to-r from-gray-400 to-gray-300 text-white";
      default: return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800";
    }
  };

  const pieData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
    { name: "Rejected", value: stats.rejected },
  ];

  const categoryData = Object.entries(
    complaints.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const filteredComplaints = complaints.filter((c) => {
    const userName = c.user?.name || c.submittedBy || '';
    const userWard = c.user?.ward || c.ward || '';
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    const matchesWard = filterWard ? userWard === filterWard : true;
    return matchesSearch && matchesStatus && matchesCategory && matchesWard;
  });

  const activeComplaints = filteredComplaints.filter(c => c.status !== "Resolved");

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FiUser className="text-gray-400" />
              Welcome back, <span className="font-semibold text-gray-800">{user.name}</span>!
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiDownload /> Export Report
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        {/* Alerts */}
        {(wardWarning || categoryWarning) && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow-sm mb-6 animate-pulse">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Insights & Recommendations</h4>
                {wardWarning && (
                  <p className="text-yellow-700 mb-2">
                    {wardWarning} <span className="text-yellow-600 text-sm">Consider ward-level intervention.</span>
                  </p>
                )}
                {categoryWarning && (
                  <p className="text-yellow-700">
                    {categoryWarning} <span className="text-yellow-600 text-sm">Allocate resources accordingly.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, icon: <FiAlertCircle />, color: "from-gray-600 to-gray-700", trend: "All complaints" },
          { label: "Pending", value: stats.pending, icon: <FiClock />, color: "from-yellow-500 to-amber-600", trend: "Needs attention" },
          { label: "In Progress", value: stats.inProgress, icon: <FiUsers />, color: "from-blue-500 to-cyan-600", trend: "Being addressed" },
          { label: "Resolved", value: stats.resolved, icon: <FiCheckCircle />, color: "from-green-500 to-emerald-600", trend: "Completed" },
          { label: "Rejected", value: stats.rejected, icon: <FiAlertTriangle />, color: "from-red-500 to-pink-600", trend: "Not applicable" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-400 mt-2">{card.trend}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${card.color} rounded-full`}
                style={{ width: `${(card.value / (stats.total || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-purple-600" />
              Complaint Status Distribution
            </h2>
            <div className="text-sm text-gray-500">{stats.total} total</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} complaints`, 'Count']}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiHome className="text-blue-600" />
              Complaints by Category
            </h2>
            <div className="text-sm text-gray-500">{categoryData.length} categories</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                formatter={(value) => [`${value} complaints`, 'Count']}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#colorGradient)" />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiFilter className="text-purple-600" />
            Filter Complaints
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Pending">📝 Pending</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Resolved">✅ Resolved</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
            
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {[...new Set(complaints.map((c) => c.category))].map((cat) => (
                <option key={cat} value={cat}>🏷️ {cat}</option>
              ))}
            </select>
            
            <select 
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Wards</option>
              {[...new Set(complaints.map((c) => c.user?.ward || c.ward || 'No Ward'))]
                .filter(ward => ward && ward !== 'No Ward')
                .map((ward) => (
                  <option key={ward} value={ward}>🏘️ {ward}</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Complaints Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiAlertCircle className="text-blue-600" />
              Active Complaints ({activeComplaints.length})
            </h2>
            <span className="text-sm text-gray-500">
              Showing {activeComplaints.length} of {filteredComplaints.length}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                {["User & Ward", "Complaint Details", "Category", "Priority", "Location", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <FiAlertCircle className="mx-auto h-12 w-12 mb-4" />
                      <p className="text-lg font-medium">No active complaints found</p>
                      <p className="text-sm">Try adjusting your filters or check back later</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activeComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{c.user?.name || c.submittedBy || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FiHome size={12} /> {c.user?.ward || c.ward || 'No Ward'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{c.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{c.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="mb-1 truncate max-w-xs">{c.location}</span>
                        {c.coordinates ? (
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${c.coordinates.lat}&mlon=${c.coordinates.lng}&zoom=17&marker=${c.coordinates.lat},${c.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                          >
                            <FiMapPin size={12} /> View Map
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">No coordinates</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-xl ${getStatusColor(c.status)} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      >
                        <option value="Pending">📝 Pending</option>
                        <option value="In Progress">⚡ In Progress</option>
                        <option value="Resolved">✅ Resolved</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/complaint/${c._id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(c._id, "Resolved")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Resolved"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved Complaints Section */}
      {resolvedComplaints.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-green-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiCheckCircle className="text-green-600" />
                Resolved Complaints ({resolvedComplaints.length})
              </h2>
              <button
                onClick={() => {
                  if (window.confirm("Delete all resolved complaints?")) {
                    // Implement bulk delete
                  }
                }}
                className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1"
              >
                <FiTrash2 /> Clear All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-gradient-to-r from-green-100 to-emerald-100">
                <tr>
                  {["User", "Complaint", "Resolved On", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {resolvedComplaints.map((c) => (
                  <tr key={c._id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{c.user?.name || c.submittedBy}</div>
                      <div className="text-sm text-gray-500">{c.user?.ward || c.ward}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{c.title}</div>
                      <div className="text-sm text-gray-500">{c.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteResolved(c._id)}
                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all flex items-center gap-1"
                      >
                        <FiTrash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Chatbot */}
      <AIChatBot stats={stats} categoryData={categoryData} complaints={complaints} />
    </div>
  );
};

export default AdminDashboard;