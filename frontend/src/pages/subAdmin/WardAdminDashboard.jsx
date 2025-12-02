// Full updated component with resolved complaints deletion
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaSignOutAlt,
  FaFilter,
  FaSearch,
  FaExclamationCircle,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaChartBar,
  FaChartPie,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaTrash,
  FaCheck
} from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const WardAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const wardNumber = parsedUser.ward.replace(/\D/g, "");
      fetchComplaints(wardNumber);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchComplaints = async (ward) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/complaints/ward/${ward}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      // Filter out resolved complaints from the display
      const activeComplaints = data.complaints ? data.complaints.filter(c => c.status !== "Resolved") : [];
      setComplaints(activeComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
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
        const updated = await response.json();
        
        // If new status is "Resolved", remove it from the list
        if (newStatus === "Resolved") {
          setComplaints(prev => prev.filter(c => c._id !== id));
          
          // Show success message for resolved complaint
          alert("Complaint marked as resolved and removed from the dashboard!");
        } else {
          // Update status for other status changes
          setComplaints((prev) =>
            prev.map((c) => (c._id === id ? { ...c, status: updated.complaint.status } : c))
          );
        }
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper function for status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      "Pending": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "In Progress": "bg-blue-100 text-blue-800 border border-blue-200",
      "Resolved": "bg-green-100 text-green-800 border border-green-200"
    };
    const icons = {
      "Pending": <FaClock className="mr-1" />,
      "In Progress": <FaSpinner className="mr-1 animate-spin" />,
      "Resolved": <FaCheckCircle className="mr-1" />
    };
    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${styles[status] || "bg-gray-100"}`}>
        {icons[status]}
        {status}
      </div>
    );
  };

  // Helper function for priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      "Critical": "bg-red-100 text-red-800 border border-red-200",
      "High": "bg-orange-100 text-orange-800 border border-orange-200",
      "Medium": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      "Low": "bg-emerald-100 text-emerald-800 border border-emerald-200"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-gray-100"}`}>
        {priority}
      </span>
    );
  };

  // Calculate statistics (only for active complaints)
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  // Filter complaints based on status and search query
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Chart data and options
  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      label: "Number of Active Complaints",
      data: Object.values(categoryCounts),
      backgroundColor: [
        "#4F46E5", "#6366F1", "#818CF8", "#A5B4FC",
        "#C7D2FE", "#E0E7FF", "#8B5CF6", "#A78BFA",
        "#C4B5FD", "#DDD6FE"
      ],
      borderRadius: 8,
      borderWidth: 0
    }],
  };

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        "#FBBF24", "#38BDF8", "#10B981"
      ],
      borderWidth: 0,
      hoverOffset: 15
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: "Active Complaints by Category",
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: { top: 10, bottom: 30 }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: "Status Distribution (Active)",
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: { top: 10, bottom: 30 }
      }
    }
  };

  // Function to handle delete (mark as resolved)
  const handleMarkAsResolved = async (id) => {
    if (window.confirm("Are you sure you want to mark this complaint as resolved? It will be removed from the dashboard.")) {
      await handleStatusChange(id, "Resolved");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                <FaBuilding className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ward Administration Dashboard</h1>
                {user && (
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-1 text-gray-400" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-1 text-gray-400" />
                      <span className="font-medium">{user.ward}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Complaints</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{complaints.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FaExclamationCircle className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg p-6 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statusCounts["Pending"] || 0}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statusCounts["In Progress"] || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaSpinner className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg p-6 border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quick Resolve</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  <button 
                    onClick={() => {
                      if (filteredComplaints.length > 0) {
                        if (window.confirm("Mark all visible complaints as resolved?")) {
                          // This would require additional implementation
                          alert("Feature coming soon!");
                        }
                      }
                    }}
                    className="hover:text-emerald-700 transition-colors"
                  >
                    →
                  </button>
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <FaCheck className="text-2xl text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

       

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <FaChartBar className="text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Active Complaints by Category</h3>
            </div>
            <div className="h-72">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <FaChartPie className="text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Status Distribution (Active)</h3>
            </div>
            <div className="h-72">
              <Pie data={statusData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Complaints List Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Active Complaints Management</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage complaints • Mark as "Resolved" to remove from dashboard
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search active complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none w-full sm:w-auto"
                  >
                    <option value="All">All Active Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                <span className="mt-4 text-lg text-gray-600 font-medium">Loading active complaints...</span>
                <p className="text-gray-500 mt-2">Resolved complaints are automatically filtered out</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <FaCheckCircle className="text-4xl text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No active complaints!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || filterStatus !== "All" 
                    ? "Try adjusting your search or filter criteria" 
                    : "All complaints in your ward have been resolved. Great work!"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredComplaints.map((complaint) => (
                  <div 
                    key={complaint._id} 
                    className="bg-gradient-to-r from-white to-gray-50 hover:from-indigo-50 hover:to-white border border-gray-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:border-indigo-200 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {complaint.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(complaint.priority)}
                            {getStatusBadge(complaint.status)}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-bold text-indigo-600">
                                {complaint.category.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{complaint.category}</span>
                          </div>
                          
                          {complaint.location && (
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-gray-400" />
                              <span className="truncate max-w-[200px]">{complaint.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:text-right">
                        <div className="flex flex-col gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Update Status
                            </label>
                            <select
                              value={complaint.status}
                              onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                              disabled={updatingId === complaint._id}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[140px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              {updatingId === complaint._id ? (
                                <option>Updating...</option>
                              ) : (
                                <>
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Resolved" className="bg-green-50 text-green-700 font-semibold">
                                    ✓ Mark as Resolved
                                  </option>
                                </>
                              )}
                            </select>
                          </div>
                          
                          <button
                            onClick={() => handleMarkAsResolved(complaint._id)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <FaCheck />
                            Quick Resolve
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-2">
                          ID: {complaint._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filteredComplaints.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                <div>
                  Showing <span className="font-medium">{filteredComplaints.length}</span> active complaints
                </div>
                <div>
                  {filterStatus !== "All" && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                      Filtered by: {filterStatus}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WardAdminDashboard;