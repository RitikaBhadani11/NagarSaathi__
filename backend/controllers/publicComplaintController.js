// controllers/complaintController.js - Add this function
// controllers/complaintController.js
exports.createPublicComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, location, priority, name, ward } = req.body;

    const complaintData = {
      title,
      description,
      category,
      location,
      name,
      ward,
      priority: priority || "Medium",
      isPublic: true,
      status: "Pending"
    };

    const complaint = await Complaint.create(complaintData);

    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};