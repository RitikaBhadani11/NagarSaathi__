import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaMapMarkerAlt, 
  FaPhone,
  FaCheckCircle,
  FaArrowRight,
  FaQrcode,
  FaSpinner,
  FaShieldAlt,
  FaUsers,
  FaLeaf,
  FaCity
} from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ward: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      if (/[^A-Za-z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      navigate('/login', {
        state: {
          signupSuccess: true,
          email: formData.email
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Fair';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Panel - Brand & Features */}
        <div className="lg:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 md:p-12 text-white">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h1 className="text-3xl font-bold">NagarSaathi</h1>
            </div>
            <p className="text-blue-100 text-lg">Join thousands of citizens making their city better</p>
          </div>

          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Report Issues Instantly</h3>
                <p className="text-blue-100 text-sm">File complaints about garbage, potholes, streetlights and more</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Track Resolution</h3>
                <p className="text-blue-100 text-sm">Monitor complaint status and get updates in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <FaLeaf className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Ward-based Support</h3>
                <p className="text-blue-100 text-sm">Direct connection with your local ward administration</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-blue-100">
              Already a member?{' '}
              <Link
                to="/login"
                className="font-semibold text-white hover:text-blue-100 underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="lg:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Start contributing to your community today</p>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-4"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <div className="text-red-500 mt-0.5">⚠</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                    required
                    minLength={3}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="Create secure password"
                    required
                    minLength={6}
                  />
                </div>
                {formData.password && (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength < 50 ? 'text-red-600' : 
                        passwordStrength < 75 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Use 6+ characters with uppercase, numbers & symbols
                    </div>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ward Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ward Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="" className="text-gray-400">Select your ward</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={`Ward ${i + 1}`}>
                      🏘️ Ward {i + 1}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="text-gray-400">▼</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Select the ward where you reside. This helps route complaints to the right authorities.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight />
                </>
              )}
            </button>

            {/* Terms & Conditions */}
            <div className="text-center text-sm text-gray-500">
              <p>
                By signing up, you agree to our{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>

          {/* QR Code Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/generate-qr')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-3 group hover:shadow-lg hover:shadow-green-500/20"
            >
              <FaQrcode className="text-xl group-hover:scale-110 transition-transform" />
              <span>Scan QR to File Complaint Instantly</span>
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Already have a QR code? Scan it to report issues without signing up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;