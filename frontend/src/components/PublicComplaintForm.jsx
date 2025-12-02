import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaExclamationCircle, 
  FaListAlt, 
  FaLocationArrow,
  FaArrowRight,
  FaSpinner,
  FaShieldAlt,
  FaQrcode,
  FaUpload,
  FaCalendarAlt
} from 'react-icons/fa';

const PublicComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ward: "",
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const categories = [
    { value: "Garbage", label: "🗑️ Garbage Collection", color: "bg-red-100 text-red-800" },
    { value: "Potholes", label: "🕳️ Potholes", color: "bg-orange-100 text-orange-800" },
    { value: "Drainage", label: "💧 Drainage Issues", color: "bg-blue-100 text-blue-800" },
    { value: "Streetlights", label: "💡 Streetlights", color: "bg-yellow-100 text-yellow-800" },
    { value: "Public Nuisance", label: "🚫 Public Nuisance", color: "bg-purple-100 text-purple-800" },
    { value: "Water Supply", label: "🚰 Water Supply", color: "bg-cyan-100 text-cyan-800" },
    { value: "Sewage", label: "🚽 Sewage Problems", color: "bg-brown-100 text-brown-800" },
    { value: "Other", label: "📌 Other Issues", color: "bg-gray-100 text-gray-800" }
  ];

  const priorities = [
    { value: "Low", label: "Low", color: "bg-gray-100 text-gray-800", icon: "🔵" },
    { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: "🟡" },
    { value: "High", label: "High", color: "bg-orange-100 text-orange-800", icon: "🟠" },
    { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800", icon: "🔴" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/complaints/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Complaint submitted successfully! Reference ID: ${data.complaint._id}`);
        setFormData({
          name: "",
          ward: "",
          title: "",
          category: "",
          description: "",
          location: "",
          priority: "Medium",
        });
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        throw new Error(data.error || "Failed to submit complaint");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to connect to server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Public Complaint Form
          </h2>
          <p className="text-gray-600 mt-2">No login required - help improve your community</p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <div className="text-red-500 mt-0.5">⚠</div>
              <div className="text-red-700">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fadeIn">
              <div className="text-green-500 mt-0.5">✅</div>
              <div className="text-green-700">
                <strong>Success!</strong> {success}
                <p className="text-sm text-green-600 mt-1">
                  Your complaint has been registered and will be reviewed shortly.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      maxLength={100}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      placeholder="e.g., Ward 9"
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaExclamationCircle className="text-green-600" />
                Complaint Details
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title for your complaint"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="">-- Select Issue Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <FaLocationArrow className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-500" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Specific location of the issue"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.icon} {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaListAlt className="text-purple-600" />
                Description
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the issue clearly... Include any relevant details that can help authorities address it quickly."
                  required
                  maxLength={500}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.description.length}/500 characters
                  </p>
                  <div className="text-xs text-gray-400">
                    <FaCalendarAlt className="inline mr-1" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting Complaint...
                </>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/login"
                className="text-center px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <FaUser /> Already have an account? Login
              </Link>
              
              <Link
                to="/generate-qr"
                className="text-center px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                <FaQrcode /> Generate QR Code
              </Link>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Your information is secure and will only be used for complaint resolution purposes.
              <br />
              By submitting, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicComplaintForm;