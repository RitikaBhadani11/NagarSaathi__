const Complaint = require("../models/Complaint");
const { validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/complaints/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// @desc    Create new complaint (for logged-in users)
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { 
      title, 
      description, 
      category, 
      location, 
      priority, 
      coordinates, 
      formattedAddress 
    } = req.body;
    
    const complaintData = {
      title,
      description,
      category,
      location,
      priority: priority || "Medium",
      ward: req.user.ward,
      user: req.user.id,
      status: "Pending",
      isPublic: false,
    };

    // ✅ Save coordinates if provided
    if (coordinates) {
      try {
        const coords = JSON.parse(coordinates);
        complaintData.coordinates = coords;
        complaintData.formattedAddress = formattedAddress || location;
      } catch (err) {
        console.log("Invalid coordinates format:", err.message);
      }
    }

    // Handle image
    if (req.file) {
      complaintData.image = `/uploads/complaints/${req.file.filename}`;
    }

    const complaint = await Complaint.create(complaintData);
    
    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create public complaint (no auth required)
// @route   POST /api/complaints/public
// @access  Public
exports.createPublicComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { 
      title, 
      description, 
      category, 
      location, 
      name, 
      ward,
      email, 
      phone,
      coordinates, 
      formattedAddress 
    } = req.body;
    
    const complaintData = {
      title,
      description,
      category,
      location,
      ward,
      status: "Pending",
      priority: "Medium",
      isPublic: true,
      submittedBy: name,
      publicEmail: email || "",
      publicPhone: phone || "",
    };

    // ✅ Save coordinates if provided
    if (coordinates) {
      try {
        const coords = JSON.parse(coordinates);
        complaintData.coordinates = coords;
        complaintData.formattedAddress = formattedAddress || location;
      } catch (err) {
        console.log("Invalid coordinates format:", err.message);
      }
    }

    // Handle image for public complaints
    if (req.file) {
      complaintData.image = `/uploads/complaints/${req.file.filename}`;
    }

    const complaint = await Complaint.create(complaintData);
    
    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Create public complaint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all complaints for logged in user
// @route   GET /api/complaints/my
// @access  Private
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("user", "name email ward")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete complaint (User can delete their own)
// @route   DELETE /api/complaints/:id
// @access  Private
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: "Complaint not found",
      });
    }

    // Check if user owns the complaint or is admin
    if (complaint.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this complaint",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all complaints (Admin only)
// @route   GET /api/complaints
// @access  Private/Admin
exports.getAllComplaints = async (req, res) => {
  try {
    console.log("Fetching all complaints with user population...");
    
    const complaints = await Complaint.find()
      .populate("user", "name email ward phone")
      .sort({ createdAt: -1 });

    console.log(`Found ${complaints.length} complaints`);
    
    // Debug: Check if user data is populated
    complaints.forEach((complaint, index) => {
      console.log(`Complaint ${index + 1}:`, {
        title: complaint.title,
        userId: complaint.user?._id,
        userName: complaint.user?.name,
        userWard: complaint.user?.ward
      });
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update complaint status (Admin only)
// @route   PUT /api/complaints/:id
// @access  Private/Admin
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    complaint.status = status;
    if (status === "Resolved") complaint.resolvedAt = new Date();

    await complaint.save();

    await complaint.populate("user", "name email ward");

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get complaints by ward number
// @route   GET /api/complaints/ward/:wardNumber
// @access  Private
exports.getComplaintsByWard = async (req, res) => {
  try {
    const { wardNumber } = req.params;

    // Direct query with proper population
    const complaints = await Complaint.find()
      .populate({
        path: 'user',
        select: 'name ward',
        match: { ward: new RegExp(`ward ${wardNumber}`, 'i') } // Case-insensitive match
      })
      .sort({ createdAt: -1 });

    // Filter out complaints where user is null (no match)
    const filteredComplaints = complaints.filter(c => c.user !== null);

    res.status(200).json({
      success: true,
      count: filteredComplaints.length,
      complaints: filteredComplaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Export multer upload middleware (for both routes)
exports.uploadImage = upload.single("image");