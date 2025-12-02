import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Feedback from './pages/user/Feedback';
import ComplaintForm from './pages/user/ComplaintForm';
import Home from './pages/user/Home';
import Mycomplaint from './pages/user/MyComplaint';
import DiscussionForum from './pages/user/DiscussionForum';
import WardAdminDashboard from "./pages/subAdmin/WardAdminDashboard";
// Admin components
import AdminDashboard from './pages/admin/Dashboard';
import QRScanner from './components/QRScanner';
import QRGenerator from './components/QRGenerator';
import PublicComplaintForm from './components/PublicComplaintForm';


function App() {
  return (
    <Router>
      {/* Toast notifications */}
      <Toaster position="top-right" />
      
      {/* Main routes */}
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User routes */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/complaint" element={<ComplaintForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mycomplaints" element={<Mycomplaint />} />
        <Route path="/forum" element={<DiscussionForum />} />

        {/* Admin routes - nested under AdminLayout */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        
          <Route path="/ward-dashboard" element={<WardAdminDashboard />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/qr-scan" element={<QRScanner />} />
         <Route path="/generate-qr" element={<QRGenerator />} />
         <Route path="/public-complaint" element={<PublicComplaintForm />} />
      </Routes>
    </Router>
  );
}

export default App;