// routes/complaintRoutes.js
router.post(
  "/public",
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
    check("name", "Name is required for public complaints").not().isEmpty(),
    check("ward", "Ward number is required for public complaints").not().isEmpty(),
  ],
  createPublicComplaint
);