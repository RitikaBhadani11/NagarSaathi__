import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Navbar from "../../components/Navbar";
import { FaArrowLeft, FaSmile, FaFrown, FaMeh } from "react-icons/fa";

const Feedback = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRating = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      setFormData((prev) => ({
        ...prev,
        message: "",
        rating: 0,
      }));

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      alert("Error submitting feedback: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Share Your Feedback
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help us improve NagarSaathi by sharing your experience and suggestions
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Feedback Form</h2>
                  <p className="text-sm text-gray-600">Your honest feedback helps us improve</p>
                </div>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-700 text-lg">Thank You!</h3>
                      <p className="text-emerald-600">Your feedback has been submitted successfully.</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Rating Section */}
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                  <label className="block text-gray-700 font-bold mb-4">Rate Your Experience</label>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => handleRating(val)}
                          className="focus:outline-none transform hover:scale-125 transition-transform duration-200"
                        >
                          <Star
                            size={40}
                            className={`transition-all duration-200 ${
                              val <= formData.rating
                                ? "text-yellow-500 fill-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${formData.rating > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                        {formData.rating > 0 ? `${formData.rating}.0` : "0.0"}
                      </span>
                      <div className="text-sm text-gray-500">out of 5.0</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {formData.rating <= 2 && formData.rating > 0 && (
                      <div className="flex items-center text-red-600">
                        <FaFrown className="mr-2 text-xl" />
                        <span className="font-medium">Poor</span>
                      </div>
                    )}
                    {formData.rating === 3 && (
                      <div className="flex items-center text-amber-600">
                        <FaMeh className="mr-2 text-xl" />
                        <span className="font-medium">Average</span>
                      </div>
                    )}
                    {formData.rating >= 4 && (
                      <div className="flex items-center text-green-600">
                        <FaSmile className="mr-2 text-xl" />
                        <span className="font-medium">Excellent</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 ml-auto">
                      {formData.rating === 5 && "Excellent! We're thrilled you had a great experience!"}
                      {formData.rating === 4 && "Very good! Thank you for your positive feedback!"}
                      {formData.rating === 3 && "Good! We'll work to make your experience even better."}
                      {formData.rating === 2 && "Fair. We appreciate your honest feedback to improve."}
                      {formData.rating === 1 && "Poor. We're sorry to hear that and will address your concerns."}
                      {formData.rating === 0 && "Select a rating to help us understand your experience."}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Your Feedback <span className="text-gray-500 text-sm">(Required)</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What did you like? What can we improve? Please share your thoughts..."
                    rows="6"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white hover:border-gray-400 resize-none"
                  ></textarea>
                  <div className="text-right text-sm text-gray-500 mt-2">
                    Minimum 20 characters
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.rating === 0 || formData.message.length < 20}
                    className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting || formData.rating === 0 || formData.message.length < 20
                        ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 text-white"
                    }`}
                  >
                    {isSubmitting ? (
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
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className="inline-block mt-1 bg-white text-purple-700 px-2 py-1 rounded-full text-xs font-medium border border-purple-200">
                    {user.ward}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your feedback helps us serve your community better.
              </p>
            </div>

           

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;