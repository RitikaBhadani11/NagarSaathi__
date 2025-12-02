"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { FaMapMarkerAlt, FaCalendar, FaTrash, FaExclamationCircle, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa"

const statusIcons = {
  Pending: <FaClock className="mr-2" />,
  "In Progress": <FaExclamationCircle className="mr-2" />,
  Resolved: <FaCheckCircle className="mr-2" />,
  Rejected: <FaTimesCircle className="mr-2" />,
}

const statusStyles = {
  Pending: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200",
  "In Progress": "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200",
  Resolved: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200",
  Rejected: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200",
}

const priorityColors = {
  Low: "text-green-600 bg-green-50 border-green-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  High: "text-orange-600 bg-orange-50 border-orange-200",
  Critical: "text-red-600 bg-red-50 border-red-200",
}

const MyComplaints = () => {
  const [user, setUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      fetchComplaints()
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/complaints/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setComplaints(data.complaints || [])
      } else {
        console.error("Failed to fetch complaints")
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setComplaints(complaints.filter((complaint) => complaint._id !== id))
        setShowDeleteConfirm(null)
        
      } else {
       
      }
    } catch (error) {
      console.error("Error deleting complaint:", error)
      
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">My Complaints</h1>
          <p className="text-gray-600">Track and manage all your submitted complaints</p>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-6 mb-8 border border-purple-100 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <div className="flex items-center mt-1 space-x-4">
                <span className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Ward: {user.ward}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 text-sm">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-800">All Submitted Complaints</h2>
              <p className="text-sm text-gray-600">Total: {complaints.length} complaints</p>
            </div>
            <button
              onClick={() => navigate("/complaint")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
            >
              File New Complaint
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-200">
                <FaExclamationCircle className="text-purple-500 text-2xl" />
              </div>
              <p className="text-gray-600 mb-4">No complaints filed yet.</p>
              <button
                onClick={() => navigate("/complaint")}
                className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-2 rounded-lg font-bold hover:shadow-md hover:shadow-purple-200 transition-all"
              >
                File Your First Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 relative hover:border-purple-300 group"
                >
                  {/* Delete Confirmation Overlay */}
                  {showDeleteConfirm === complaint._id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaTimesCircle className="text-red-500 text-2xl" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Complaint?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this complaint? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(complaint._id)}
                            className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                          >
                            Yes, Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(complaint._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100 opacity-0"
                    title="Delete complaint"
                  >
                    <FaTrash />
                  </button>

                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                        {complaint.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusStyles[complaint.status] || "bg-gray-100 text-gray-700"}`}>
                          {statusIcons[complaint.status]}
                          {complaint.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[complaint.priority] || "bg-gray-100 text-gray-700"}`}>
                          {complaint.priority} Priority
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {complaint.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {complaint.description}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{complaint.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCalendar className="mr-1" />
                        <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0">
                      <span className="text-sm text-gray-500">Ward: </span>
                      <span className="text-sm font-medium text-purple-600">{user.ward}</span>
                    </div>
                  </div>

                  {/* Image Preview (if exists) */}
                  {complaint.image && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-2">Attached Image:</p>
                      <div className="w-32 h-32 border rounded-lg overflow-hidden">
                        <img
                          src={complaint.image}
                          alt="Complaint"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyComplaints