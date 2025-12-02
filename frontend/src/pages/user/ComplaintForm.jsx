"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaCamera, FaMapMarkerAlt, FaExclamationCircle } from "react-icons/fa"
import Navbar from "../../components/Navbar"
import LocationPicker from "../../components/LocationPicker"

const ComplaintForm = () => {
  const [user, setUser] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "Medium",
    image: null,
    coordinates: null,
    formattedAddress: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const categories = [
    "Garbage",
    "Potholes",
    "Drainage",
    "Streetlights",
    "Public Nuisance",
    "Water Supply",
    "Sewage",
    "Other",
  ]
  const priorities = ["Low", "Medium", "High", "Critical"]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      setPreviewImage(URL.createObjectURL(file))
      setFormData({ ...formData, image: file })
      setError("")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleLocationSelect = (locationData) => {
    console.log("Location data received:", locationData);
    
    setFormData({
      ...formData,
      location: locationData.address,
      coordinates: locationData.coordinates,
      formattedAddress: locationData.address
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const submitData = new FormData()

      submitData.append("title", formData.title)
      submitData.append("category", formData.category)
      submitData.append("description", formData.description)
      submitData.append("location", formData.location)
      submitData.append("priority", formData.priority)
      
      if (formData.coordinates) {
        submitData.append("coordinates", JSON.stringify(formData.coordinates))
        submitData.append("formattedAddress", formData.formattedAddress)
      }

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      })

      const data = await response.json()

      if (response.ok) {
        alert("Complaint submitted successfully!")
        navigate("/mycomplaints")
      } else {
        throw new Error(data.error || "Failed to submit complaint")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Report an Issue
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help keep your community clean and safe by reporting municipal issues
            </p>
          </div>

          {/* User Info */}
          <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-6 mb-8 border border-purple-100 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">Citizen • Ward: {user.ward}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your report will be submitted to the {user.ward} ward office
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaExclamationCircle className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Issue Details</h2>
                  <p className="text-sm text-gray-600">Fill in all required fields (*)</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                  <FaExclamationCircle className="text-red-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Issue Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Overflowing garbage bin near Main Street"
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </div>
                </div>

                {/* Category & Priority Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 appearance-none"
                    >
                      <option value="" className="text-gray-400">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="text-gray-700">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Priority Level</label>
                    <div className="relative">
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 appearance-none"
                      >
                        {priorities.map((priority) => (
                          <option key={priority} value={priority} className="text-gray-700">
                            {priority}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <label className="block text-gray-700 font-bold mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-purple-600" />
                    Location *
                  </label>
                  <p className="text-sm text-gray-600 mb-4">Click on the map to select the exact location</p>
                  
                  <div className="mb-4">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                  
                  {formData.location && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Selected Address</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide detailed information about the issue. Include date, time, and specific observations..."
                    required
                    maxLength={500}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 resize-none"
                  ></textarea>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Minimum 50 characters recommended</span>
                    <span>{formData.description.length}/500 characters</span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <FaCamera className="text-purple-600" />
                    Upload Photo (Optional)
                  </label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                          <FaCamera className="text-purple-600 text-2xl" />
                        </div>
                        <span className="text-purple-600 font-medium">Click to upload photo</span>
                        <span className="text-sm text-gray-500 mt-1">JPEG, PNG (Max 5MB)</span>
                      </label>
                    </div>

                    {previewImage && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">Preview</span>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null)
                              setFormData({ ...formData, image: null })
                            }}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      loading
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 text-white"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        Submitting...
                      </>
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Tips for Effective Reports</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">!</span>
                  </div>
                  <span>Be specific and descriptive in your title</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">!</span>
                  </div>
                  <span>Include exact location using the map</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">!</span>
                  </div>
                  <span>Photos help officials understand the issue better</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-purple-600 text-xs">!</span>
                  </div>
                  <span>Set appropriate priority level for urgency</span>
                </li>
              </ul>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Response Times</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Critical Priority</span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">High Priority</span>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">3 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Medium Priority</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">1 week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Low Priority</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">2 weeks</span>
                </div>
              </div>
            </div>

            {/* Status Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Track Your Complaint</h3>
              <p className="text-sm text-gray-600 mb-4">
                After submission, you can track the status of your complaint in "My Complaints" section.
              </p>
              <button
                onClick={() => navigate("/mycomplaints")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
              >
                View My Complaints
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintForm